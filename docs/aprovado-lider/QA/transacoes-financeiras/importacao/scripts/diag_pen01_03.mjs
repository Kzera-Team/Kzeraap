import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync } from 'fs';

// CT-PEN-01 — Vincular pagamento posterior provavel
// CT-PEN-02 — Marcar para revisao manual
// CT-PEN-03 — Ignorar registro
//
// Massa: vendas_qa_con.csv + financeiro_qa_con.csv
//   txn 701: Ricardo, Escova, total=100, valorPago=100 / fin #701: 90 (divergencia_valor)
//   txn 702: Ricardo, Escova, total=25, valorPago=25  / fin #702: 25, Guilherme (divergencia_perfil)
//   txn 703: Guilherme, Shampoo, total=45, valorPago=0 / fin sem ref: 45, Guilherme, 15/06 (pagamento_posterior_provavel)
//
// CT-PEN-03: ignorar a txn 701 (transacao) — espera status=ignorado no IDB
// CT-PEN-02: marcar revisao na txn 702 (transacao) — espera status=erro + pendencia revisao_manual
// CT-PEN-01: vincular financeiro sem ref a txn 703 — espera financeiroStagingIdsResolvidos.length > 0

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

  // Importar e preparar
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

  // Agora estamos na tela de pendencias com os novos botoes
  // Capturar IDs de staging para usar nos testes
  const txns = await readStore(page, 'registrosImportacaoTransacoes');
  const fins = await readStore(page, 'registrosImportacaoFinanceira');
  log(`Staging: ${txns.length} transacoes, ${fins.length} financeiros`);

  const txn701 = txns.find(t => t.numeroOriginal === '701');
  const txn702 = txns.find(t => t.numeroOriginal === '702');
  const txn703 = txns.find(t => t.numeroOriginal === '703');
  const fin703 = fins.find(f => !f.numeroTransacaoReferenciado);

  if (!txn701 || !txn702 || !txn703 || !fin703) {
    log('ERRO: registros de staging nao encontrados');
    log(`txn701: ${txn701?.id ?? 'NULL'}`);
    log(`txn702: ${txn702?.id ?? 'NULL'}`);
    log(`txn703: ${txn703?.id ?? 'NULL'}`);
    log(`fin703 (sem ref): ${fin703?.id ?? 'NULL'}`);
    await browser.close();
    return;
  }

  log(`\ntxn701 id: ${txn701.id} status: ${txn701.status}`);
  log(`txn702 id: ${txn702.id} status: ${txn702.status}`);
  log(`txn703 id: ${txn703.id} status: ${txn703.status}`);
  log(`fin703 id: ${fin703.id} status: ${fin703.status}`);

  // ── CT-PEN-03: Ignorar transacao 701 ──
  log('\n=== CT-PEN-03: Ignorar txn 701 ===');
  // Aguardar tela de pendencias e o botao de ignorar
  await page.waitForSelector('[data-lista-registros-pendentes]', { timeout: 10000 });
  await page.waitForTimeout(500);

  const ignorarBtn = page.locator(`[data-ignorar-registro][data-registro-id="${txn701.id}"][data-tipo="transacao"]`);
  const ignorarExists = await ignorarBtn.count() > 0;
  log(`Botao ignorar txn701 encontrado: ${ignorarExists}`);

  if (ignorarExists) {
    await ignorarBtn.click();
    await page.waitForTimeout(2000); // aguardar re-render
  }

  const txnsAposIgnorar = await readStore(page, 'registrosImportacaoTransacoes');
  const txn701Apos = txnsAposIgnorar.find(t => t.id === txn701.id);
  const ignorarOk = txn701Apos?.status === 'ignorado';
  log(`txn701 status apos ignorar: ${txn701Apos?.status} → ${ignorarOk ? '✓ APROVADO' : '✗ REPROVADO'}`);
  log(`nenhuma transacaoFinanceira criada: ${(await readStore(page, 'transacoesFinanceiras')).length === 0 ? '✓' : '✗'}`);

  // ── CT-PEN-02: Marcar revisao txn 702 ──
  log('\n=== CT-PEN-02: Marcar revisao txn 702 ===');
  await page.waitForSelector('[data-lista-registros-pendentes]', { timeout: 10000 });
  await page.waitForTimeout(500);

  const revisaoBtn = page.locator(`[data-marcar-revisao-registro][data-registro-id="${txn702.id}"][data-tipo="transacao"]`);
  const revisaoExists = await revisaoBtn.count() > 0;
  log(`Botao revisao txn702 encontrado: ${revisaoExists}`);

  if (revisaoExists) {
    await revisaoBtn.click();
    await page.waitForTimeout(2000);
  }

  const txnsAposRevisao = await readStore(page, 'registrosImportacaoTransacoes');
  const txn702Apos = txnsAposRevisao.find(t => t.id === txn702.id);
  const revisaoOk = txn702Apos?.status === 'erro' && txn702Apos?.tiposPendencia?.includes('revisao_manual');
  log(`txn702 status apos revisao: ${txn702Apos?.status}`);
  log(`tiposPendencia inclui revisao_manual: ${txn702Apos?.tiposPendencia?.includes?.('revisao_manual') ? '✓' : '✗'}`);
  log(`CT-PEN-02: ${revisaoOk ? '✓ APROVADO' : '✗ REPROVADO'}`);

  // ── CT-PEN-01: Vincular financeiro sem ref a txn 703 ──
  log('\n=== CT-PEN-01: Vincular fin703 a txn703 ===');
  await page.waitForSelector('[data-lista-registros-pendentes]', { timeout: 10000 });
  await page.waitForTimeout(500);

  // Preencher o input de ID da transacao no row do financeiro
  const finRow = page.locator(`[data-registro-row][data-registro-id="${fin703.id}"]`);
  const inputTxn = finRow.locator('[data-input-vincular-txn]');
  const inputExists = await inputTxn.count() > 0;
  log(`Input vincular-txn no row de fin703: ${inputExists}`);

  if (inputExists) {
    await inputTxn.fill(txn703.id);
    await page.waitForTimeout(300);
    const vincularBtn = finRow.locator('[data-vincular-financeiro-registro]');
    await vincularBtn.click();
    await page.waitForTimeout(2000);
  }

  const txnsAposVincular = await readStore(page, 'registrosImportacaoTransacoes');
  const finsAposVincular = await readStore(page, 'registrosImportacaoFinanceira');
  const txn703Apos = txnsAposVincular.find(t => t.id === txn703.id);
  const fin703Apos = finsAposVincular.find(f => f.id === fin703.id);

  const txn703Vinculado = (txn703Apos?.financeiroStagingIdsResolvidos?.length ?? 0) > 0;
  const fin703Vinculado = fin703Apos?.transacaoStagingIdResolvida === txn703.id;
  const resolucaoManual = txn703Apos?.resolucaoConciliacao === 'manual' && fin703Apos?.resolucaoConciliacao === 'manual';
  const vincularOk = txn703Vinculado && fin703Vinculado && resolucaoManual;

  log(`txn703 financeiroStagingIdsResolvidos: ${JSON.stringify(txn703Apos?.financeiroStagingIdsResolvidos)}`);
  log(`fin703 transacaoStagingIdResolvida: ${fin703Apos?.transacaoStagingIdResolvida}`);
  log(`resolucaoConciliacao txn703: ${txn703Apos?.resolucaoConciliacao}`);
  log(`resolucaoConciliacao fin703: ${fin703Apos?.resolucaoConciliacao}`);
  log(`CT-PEN-01: ${vincularOk ? '✓ APROVADO' : '✗ REPROVADO'}`);
  log(`nenhuma transacaoFinanceira oficial criada: ${(await readStore(page, 'transacoesFinanceiras')).length === 0 ? '✓' : '✗'}`);

  // ── RESULTADO FINAL ──
  log('\n=== RESULTADO FINAL ===');
  log(`CT-PEN-03 (Ignorar): ${ignorarOk ? 'APROVADO' : 'REPROVADO'}`);
  log(`CT-PEN-02 (Marcar revisao): ${revisaoOk ? 'APROVADO' : 'REPROVADO'}`);
  log(`CT-PEN-01 (Vincular financeiro): ${vincularOk ? 'APROVADO' : 'REPROVADO'}`);

  if (errors.length > 0) log('Erros: ' + errors.join(' | '));

  await browser.close();
  log('=== FIM ===');
}

run().catch(e => { console.error('FATAL:', e); process.exit(1); });
