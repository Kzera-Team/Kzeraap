import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync } from 'fs';

// CT-CON-04 — Divergência de valor
// CT-CON-05 — Divergência de perfil
// CT-CON-06 — Pagamento posterior provável
//
// Massa:
//   vendas_qa_con.csv:
//     701 Ricardo / Escova / total=100 / valorPago=100  → divergência de valor (fin. diz 90)
//     702 Ricardo / Escova / total=25  / valorPago=25   → divergência de perfil (fin. diz Guilherme)
//     703 Guilherme / Shampoo / total=45 / valorPago=0  → pagamento posterior provável
//   financeiro_qa_con.csv:
//     #701 - Pix  / valor=90  / Ricardo    → 90 ≠ 100 → divergencia_valor
//     #702 - Pix  / valor=25  / Guilherme  → perfil diverge → divergencia_perfil
//     Credito Guilherme / valor=45 / Guilherme / sem ref → pagamento_posterior_provavel

const BASE        = 'http://localhost:4174/Kzeraap/';
const SENHA       = 'teste1234';
const CODIGO_RULE = JSON.stringify({ parts: [{ tipo: 'bairro', tamanho: 3 }] });
const CSV_V       = readFileSync('/tmp/vendas_qa_con.csv');
const CSV_F       = readFileSync('/tmp/financeiro_qa_con.csv');

function log(m) { console.log(`[${new Date().toISOString().slice(11,19)}] ${m}`); }

async function jsClick(page, sel) {
  return page.evaluate(s => { const el = document.querySelector(s); if (el) { el.click(); return true; } return false; }, sel);
}

async function login(page) {
  const pwd = await page.locator('input[type="password"]').count();
  if (pwd === 0) { log('Já logado'); return; }
  await page.locator('input[type="password"]').first().fill(SENHA);
  if (pwd >= 2) await page.locator('input[type="password"]').nth(1).fill(SENHA);
  const btn = page.locator('button').filter({ hasText: /criar|confirmar|entrar/i }).first();
  await btn.click();
  await page.waitForSelector('[data-nav]', { timeout: 30000 });
  await page.waitForTimeout(1000);
}

async function readStore(page, storeName) {
  return page.evaluate(name => new Promise(resolve => {
    const req = indexedDB.open('kzera_operacional_1102');
    req.onsuccess = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(name)) { db.close(); resolve([]); return; }
      const tx = db.transaction(name, 'readonly');
      const all = tx.objectStore(name).getAll();
      all.onsuccess = () => { db.close(); resolve(all.result); };
      all.onerror = () => { db.close(); resolve([]); };
    };
    req.onerror = () => resolve([]);
  }), storeName);
}

async function run() {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    headless: true
  });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();

  const errors = [];
  page.on('pageerror', e => { errors.push(e.message); log('[pageerror] ' + e.message.slice(0, 200)); });
  page.on('console', m => { if (m.type() === 'error') log('[console.error] ' + m.text().slice(0, 200)); });

  await page.addInitScript(r => {
    localStorage.setItem('kzera-config:codigoPerfilRule', r);
    localStorage.setItem('kzera:passkeyCredentialId', 'ZmFrZS1xYS10ZXN0ZQ');
  }, CODIGO_RULE);

  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  await login(page);
  await page.waitForTimeout(500);

  // Seed: Ricardo, Guilherme, Escova, Shampoo
  await jsClick(page, '[data-nav="perfis"]');
  await page.waitForSelector('[data-action="novo-perfil"]', { timeout: 8000 });
  for (const nome of ['Ricardo', 'Guilherme']) {
    await jsClick(page, '[data-action="novo-perfil"]');
    await page.waitForSelector('#perfil-nome', { timeout: 6000 });
    await page.locator('#perfil-nome').fill(nome);
    await jsClick(page, '[data-testid="perfil-form"] button[type="submit"]');
    await page.waitForSelector('[data-action="novo-perfil"]', { timeout: 10000 });
    await page.waitForTimeout(300);
  }
  await jsClick(page, '[data-nav="itens"]');
  await page.waitForSelector('[data-action="novo-item"]', { timeout: 8000 });
  for (const nome of ['Escova', 'Shampoo']) {
    await jsClick(page, '[data-action="novo-item"]');
    await page.waitForSelector('#item-nome', { timeout: 6000 });
    await page.locator('#item-nome').fill(nome);
    await jsClick(page, '[data-testid="item-form"] button[type="submit"]');
    await page.waitForSelector('[data-action="novo-item"]', { timeout: 10000 });
    await page.waitForTimeout(300);
  }
  log('Seed criado: Ricardo, Guilherme, Escova, Shampoo');

  // Importar, preparar, conciliar
  await jsClick(page, '[data-nav="importacao-transacoes"]');
  await page.waitForTimeout(1000);
  await page.locator('[role="dialog"][aria-modal="true"]').waitFor({ state: 'attached', timeout: 10000 }).catch(() => {});

  const fileInput1 = page.locator('[data-file-upload-transacoes]');
  await fileInput1.waitFor({ state: 'attached', timeout: 15000 });
  await fileInput1.setInputFiles([{ name: 'vendas_qa_con.csv', mimeType: 'text/csv', buffer: CSV_V }]);
  await page.waitForTimeout(1000);

  const fileInput2 = page.locator('[data-file-upload-financeiro]');
  await fileInput2.waitFor({ state: 'attached', timeout: 10000 });
  await fileInput2.setInputFiles([{ name: 'financeiro_qa_con.csv', mimeType: 'text/csv', buffer: CSV_F }]);
  await page.waitForTimeout(1000);

  await jsClick(page, '[data-preparar-importacao]');
  await page.waitForSelector('[data-conciliar-importacao]', { timeout: 15000 });
  await page.waitForTimeout(1000);

  log('Preparação concluída');

  // ── Verificar staging antes da conciliação ──
  const txnsPre = await readStore(page, 'registrosImportacaoTransacoes');
  const finsPre  = await readStore(page, 'registrosImportacaoFinanceira');
  log(`Staging pré-conciliação: ${txnsPre.length} transacoes, ${finsPre.length} financeiros`);

  // Conciliar
  await jsClick(page, '[data-conciliar-importacao]');
  await page.waitForTimeout(2000);

  const msgAposConciliar = await page.evaluate(() =>
    document.querySelector('[data-importacao-mensagem]')?.textContent?.trim() ?? null
  );
  log(`Mensagem pós-conciliar: ${msgAposConciliar}`);

  // ── Verificar staging pós-conciliação ──
  const txnsPos = await readStore(page, 'registrosImportacaoTransacoes');
  log('\n=== Staging pós-conciliação ===');
  for (const r of txnsPos) {
    const num = r.numeroOriginal || r.dadosNormalizados?.numero || '?';
    const ids = (r.financeiroStagingIdsResolvidos || []).length;
    const res = r.resolucaoConciliacao || 'N/A';
    log(`  txn #${num} status=${r.status} financeiroIds=${ids} resolucao=${res}`);
  }

  const finsPos = await readStore(page, 'registrosImportacaoFinanceira');
  log('\n=== Financeiros pós-conciliação ===');
  for (const r of finsPos) {
    const desc = r.dadosNormalizados?.descricao || r.dadosNormalizados?.numerTransacaoReferenciado || '?';
    const numRef = r.numeroTransacaoReferenciado || r.dadosNormalizados?.numeroTransacaoReferenciado || 'sem-ref';
    log(`  fin "${desc.slice(0,30)}" numRef=${numRef} status=${r.status}`);
  }

  // ── CT-CON-04 e CT-CON-05: verificar que nenhuma txn foi auto-vinculada ──
  log('\n=== CT-CON-04 / CT-CON-05 — Sem vínculo automático ===');
  const txn701 = txnsPos.find(r => (r.numeroOriginal || r.dadosNormalizados?.numero) === '701');
  const txn702 = txnsPos.find(r => (r.numeroOriginal || r.dadosNormalizados?.numero) === '702');
  const txn703 = txnsPos.find(r => (r.numeroOriginal || r.dadosNormalizados?.numero) === '703');

  const ids701 = (txn701?.financeiroStagingIdsResolvidos || []).length;
  const ids702 = (txn702?.financeiroStagingIdsResolvidos || []).length;
  const ids703 = (txn703?.financeiroStagingIdsResolvidos || []).length;

  log(`CT-CON-04: txn 701 financeiroIds=${ids701} (esperado 0) → ${ids701 === 0 ? '✓ APROVADO' : '✗ REPROVADO'}`);
  log(`CT-CON-05: txn 702 financeiroIds=${ids702} (esperado 0) → ${ids702 === 0 ? '✓ APROVADO' : '✗ REPROVADO'}`);
  log(`CT-CON-06: txn 703 financeiroIds=${ids703} (esperado 0) → ${ids703 === 0 ? '✓ APROVADO' : '✗ REPROVADO'}`);

  // Gerar prévia
  await jsClick(page, '[data-gerar-previa]');
  await page.waitForTimeout(3000);

  const msgPrevia = await page.evaluate(() =>
    document.querySelector('[data-importacao-mensagem]')?.textContent?.trim() ?? null
  );
  log(`\nMensagem prévia: ${msgPrevia}`);

  const previaTransacoes  = await page.evaluate(() => document.querySelector('[data-previa-transacoes]')?.textContent?.trim() ?? null);
  const previaBloqueados  = await page.evaluate(() => document.querySelector('[data-previa-bloqueados]')?.textContent?.trim() ?? null);
  const previaPagamentos  = await page.evaluate(() => document.querySelector('[data-previa-pagamentos]')?.textContent?.trim() ?? null);
  const previaMovimentos  = await page.evaluate(() => document.querySelector('[data-previa-movimentos]')?.textContent?.trim() ?? null);

  log(`  Transações previstas: ${previaTransacoes}`);
  log(`  Bloqueadas:           ${previaBloqueados}`);
  log(`  Pagamentos previstos: ${previaPagamentos}`);
  log(`  Movimentos previstos: ${previaMovimentos}`);

  const transacoesFinanceiras = await readStore(page, 'transacoesFinanceiras');
  log(`\ntransacoesFinanceiras (antes de confirmar): ${transacoesFinanceiras.length}`);

  // ── Resultado final ──
  log('\n=== RESULTADO ===');
  const conc0 = msgAposConciliar && msgAposConciliar.includes('0 pagamentos');
  const semAutoLink = ids701 === 0 && ids702 === 0 && ids703 === 0;
  const bloqueou701e702 = Number(previaBloqueados) >= 2;
  const semOficial = transacoesFinanceiras.length === 0;

  log(`CT-CON-04 (divergência de valor):`);
  log(`  Financeiro #701 (90) não vinculado automaticamente a txn 701 (100): ${ids701 === 0 ? '✓' : '✗'}`);
  log(`  Txn 701 bloqueada na prévia: ${bloqueou701e702 ? '✓' : '✗'}`);
  log(`  Status: ${ids701 === 0 && bloqueou701e702 ? 'APROVADO' : 'REPROVADO'}`);

  log(`CT-CON-05 (divergência de perfil):`);
  log(`  Financeiro #702 Guilherme não vinculado automaticamente a txn 702 Ricardo: ${ids702 === 0 ? '✓' : '✗'}`);
  log(`  Status: ${ids702 === 0 ? 'APROVADO' : 'REPROVADO'}`);

  log(`CT-CON-06 (pagamento posterior provável):`);
  log(`  Credito Guilherme não vinculado automaticamente a txn 703: ${ids703 === 0 ? '✓' : '✗'}`);
  log(`  Nenhum registro oficial criado automaticamente: ${semOficial ? '✓' : '✗'}`);
  log(`  Status: ${ids703 === 0 && semOficial ? 'APROVADO' : 'REPROVADO'}`);

  if (errors.length > 0) log('Erros: ' + errors.join(' | '));

  await browser.close();
  log('=== FIM ===');
}

run().catch(e => { console.error('FATAL:', e); process.exit(1); });
