import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync } from 'fs';

// CT-PEN-04 — Aprovacao em massa segura
//
// Objetivo: vincular_financeiro_em_massa para pares seguros via UI.
//
// Massa: vendas_qa_con.csv + financeiro_qa_con.csv
//   txn 703: Guilherme, Shampoo, total=45, valorPago=0 / fin sem ref: 45, Guilherme, 15/06 (pagamento_posterior_provavel)
//
// Para aprovacao em massa ser segura, motivoBloqueioAprovacaoMassa deve retornar undefined.
// txn 703 (valorPago=0, pendente=45) com fin sem ref (valor=45, Guilherme, pago=true, data>=txn) — tipo: pagamento_posterior
//
// Fluxo:
//   1. Importar, preparar, conciliar
//   2. Na tela de pendencias: preencher input com ID da txn703 no row do fin sem ref
//   3. Clicar [data-vincular-massa-segura]
//   4. Verificar: ambos com resolucaoConciliacao=massa_segura, financeiroStagingIdsResolvidos preenchido

const BASE        = 'http://localhost:4174/Kzeraap/';
const SENHA       = 'teste1234';
const CODIGO_RULE = JSON.stringify({ parts: [{ tipo: 'bairro', tamanho: 3 }] });
const CSV_CON     = readFileSync('/tmp/vendas_qa_con.csv');
const CSV_FIN_CON = readFileSync('/tmp/financeiro_qa_con.csv');

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

  // Seed
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
  log('Seed criado');

  // Importar, preparar, conciliar
  await jsClick(page, '[data-nav="importacao-transacoes"]');
  await page.waitForTimeout(1000);
  await page.locator('[role="dialog"][aria-modal="true"]').waitFor({ state: 'attached', timeout: 10000 }).catch(() => {});

  const fileInput1 = page.locator('[data-file-upload-transacoes]');
  await fileInput1.waitFor({ state: 'attached', timeout: 15000 });
  await fileInput1.setInputFiles([{ name: 'vendas_qa_con.csv', mimeType: 'text/csv', buffer: CSV_CON }]);
  await page.waitForTimeout(1000);

  const fileInput2 = page.locator('[data-file-upload-financeiro]');
  await fileInput2.waitFor({ state: 'attached', timeout: 10000 });
  await fileInput2.setInputFiles([{ name: 'financeiro_qa_con.csv', mimeType: 'text/csv', buffer: CSV_FIN_CON }]);
  await page.waitForTimeout(1000);

  await jsClick(page, '[data-preparar-importacao]');
  await page.waitForSelector('[data-conciliar-importacao]', { timeout: 15000 });
  await page.waitForTimeout(1000);
  await jsClick(page, '[data-conciliar-importacao]');
  await page.waitForTimeout(2000);

  // Ler IDs de staging
  const txns = await readStore(page, 'registrosImportacaoTransacoes');
  const fins = await readStore(page, 'registrosImportacaoFinanceira');
  const txn703 = txns.find(t => t.numeroOriginal === '703');
  const fin703 = fins.find(f => !f.numeroTransacaoReferenciado);

  if (!txn703 || !fin703) {
    log('ERRO: txn703 ou fin703 nao encontrados');
    await browser.close();
    return;
  }

  log(`txn703 id: ${txn703.id} status: ${txn703.status}`);
  log(`fin703  id: ${fin703.id} status: ${fin703.status}`);

  log('\n=== CT-PEN-04: Aprovacao em massa via UI ===');
  await page.waitForSelector('[data-lista-registros-pendentes]', { timeout: 10000 });
  await page.waitForTimeout(500);

  // Preencher input de vinculo no row do fin703
  const finRow = page.locator(`[data-registro-row][data-registro-id="${fin703.id}"]`);
  const inputTxn = finRow.locator('[data-input-vincular-txn]');
  const inputExists = await inputTxn.count() > 0;
  log(`Input vincular-txn no row fin703: ${inputExists}`);

  if (inputExists) {
    await inputTxn.fill(txn703.id);
    await page.waitForTimeout(300);
  }

  // Verificar que botao massa segura existe
  const massaBtn = page.locator('[data-vincular-massa-segura]');
  const massaExists = await massaBtn.count() > 0;
  log(`Botao vincular-massa-segura encontrado: ${massaExists}`);

  if (massaExists) {
    await massaBtn.click();
    await page.waitForTimeout(2000);
  }

  // Verificar resultado no IDB
  const txnsApos = await readStore(page, 'registrosImportacaoTransacoes');
  const finsApos = await readStore(page, 'registrosImportacaoFinanceira');
  const txn703Apos = txnsApos.find(t => t.id === txn703.id);
  const fin703Apos = finsApos.find(f => f.id === fin703.id);

  const txnVinculada = (txn703Apos?.financeiroStagingIdsResolvidos?.length ?? 0) > 0;
  const finVinculada = fin703Apos?.transacaoStagingIdResolvida === txn703.id;
  const massaSegura = txn703Apos?.resolucaoConciliacao === 'massa_segura' && fin703Apos?.resolucaoConciliacao === 'massa_segura';

  log(`txn703 financeiroStagingIdsResolvidos: ${JSON.stringify(txn703Apos?.financeiroStagingIdsResolvidos)}`);
  log(`fin703 transacaoStagingIdResolvida: ${fin703Apos?.transacaoStagingIdResolvida}`);
  log(`resolucaoConciliacao txn703: ${txn703Apos?.resolucaoConciliacao}`);
  log(`resolucaoConciliacao fin703: ${fin703Apos?.resolucaoConciliacao}`);

  const mensagemUI = await page.evaluate(() => document.querySelector('[data-importacao-mensagem]')?.textContent?.trim() ?? '');
  log(`Mensagem UI: ${mensagemUI}`);

  const oficiais = await readStore(page, 'transacoesFinanceiras');
  log(`transacoesFinanceiras oficiais: ${oficiais.length} (esperado 0)`);

  log('\n=== RESULTADO CT-PEN-04 ===');
  const aprovado = txnVinculada && finVinculada && massaSegura && oficiais.length === 0;
  log(`txn vinculada ao financeiro: ${txnVinculada ? '✓' : '✗'}`);
  log(`fin vinculado a transacao: ${finVinculada ? '✓' : '✗'}`);
  log(`resolucaoConciliacao=massa_segura em ambos: ${massaSegura ? '✓' : '✗'}`);
  log(`nenhum oficial criado: ${oficiais.length === 0 ? '✓' : '✗'}`);
  log(`Status: ${aprovado ? 'APROVADO' : 'REPROVADO'}`);

  if (errors.length > 0) log('Erros: ' + errors.join(' | '));

  await browser.close();
  log('=== FIM ===');
}

run().catch(e => { console.error('FATAL:', e); process.exit(1); });
