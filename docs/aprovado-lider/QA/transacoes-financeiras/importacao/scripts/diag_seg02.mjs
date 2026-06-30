import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync } from 'fs';

// CT-SEG-02 — Limpeza ao bloquear sessao ou sair
//
// Fluxo:
//   1. Importar, preparar, conciliar, gerar previa
//   2. Verificar que previa esta visivel na UI
//   3. Clicar no botao de sair/bloquear sessao ([data-testid="logout-button"])
//   4. Fazer login novamente
//   5. Navegar para importacao
//   6. Verificar que dados sensiveis em memoria foram zerados (previa=null, mensagem vazia)
//   7. Confirmar que staging persiste no IDB (dados em IDB nao sao apagados — apenas memoria)

const BASE        = 'http://localhost:4174/Kzeraap/';
const SENHA       = 'teste1234';
const CODIGO_RULE = JSON.stringify({ parts: [{ tipo: 'bairro', tamanho: 3 }] });
const CSV_V3      = readFileSync('/tmp/vendas_qa_v3.csv');
const CSV_FIN_V3  = readFileSync('/tmp/financeiro_qa_v3.csv');

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

  // Seed: perfis e itens
  await jsClick(page, '[data-nav="perfis"]');
  await page.waitForSelector('[data-action="novo-perfil"]', { timeout: 8000 });
  for (const nome of ['Ricardo', 'Guilherme', 'Paulo', 'Marcelo', 'Joanderson']) {
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

  // Importar, preparar, conciliar, gerar previa
  await jsClick(page, '[data-nav="importacao-transacoes"]');
  await page.waitForTimeout(1000);
  await page.locator('[role="dialog"][aria-modal="true"]').waitFor({ state: 'attached', timeout: 10000 }).catch(() => {});

  const fileInput1 = page.locator('[data-file-upload-transacoes]');
  await fileInput1.waitFor({ state: 'attached', timeout: 15000 });
  await fileInput1.setInputFiles([{ name: 'vendas_qa_v3.csv', mimeType: 'text/csv', buffer: CSV_V3 }]);
  await page.waitForTimeout(1000);

  const fileInput2 = page.locator('[data-file-upload-financeiro]');
  await fileInput2.waitFor({ state: 'attached', timeout: 10000 });
  await fileInput2.setInputFiles([{ name: 'financeiro_qa_v3.csv', mimeType: 'text/csv', buffer: CSV_FIN_V3 }]);
  await page.waitForTimeout(1000);

  await jsClick(page, '[data-preparar-importacao]');
  await page.waitForSelector('[data-conciliar-importacao]', { timeout: 15000 });
  await page.waitForTimeout(1000);
  await jsClick(page, '[data-conciliar-importacao]');
  await page.waitForTimeout(2000);
  await jsClick(page, '[data-gerar-previa]');
  await page.waitForSelector('[data-abrir-confirmacao]', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500);

  // ── VERIFICAR PREVIA ANTES DO BLOQUEIO ──
  log('\n=== Estado ANTES de bloquear sessao ===');
  const previaAntes = await page.evaluate(() => document.querySelector('[data-previa-transacoes]')?.textContent?.trim() ?? null);
  const msgAntes = await page.evaluate(() => document.querySelector('[data-importacao-mensagem]')?.textContent?.trim() ?? null);
  const abrirConfAntes = await page.locator('[data-abrir-confirmacao]').isVisible().catch(() => false);
  log(`[data-previa-transacoes]: ${previaAntes}`);
  log(`[data-importacao-mensagem]: ${msgAntes}`);
  log(`[data-abrir-confirmacao] visivel: ${abrirConfAntes}`);

  const stagingAntes = await readStore(page, 'registrosImportacaoTransacoes');
  log(`Staging IDB antes: ${stagingAntes.length} registros`);

  // ── BLOQUEAR SESSAO ──
  log('\n=== Bloqueando sessao via [data-testid="logout-button"] ===');
  const logoutClicou = await jsClick(page, '[data-testid="logout-button"]');
  log(`Botao logout clicou: ${logoutClicou}`);
  await page.waitForTimeout(2000);

  // Verificar se a tela de login apareceu
  const isLoginTela = await page.locator('input[type="password"]').count().then(n => n > 0).catch(() => false);
  log(`Tela de login apareceu: ${isLoginTela}`);

  // ── RECONECTAR ──
  log('\n=== Fazendo login novamente ===');
  await login(page);
  await page.waitForTimeout(500);

  // Navegar de volta para importacao
  await jsClick(page, '[data-nav="importacao-transacoes"]');
  await page.waitForTimeout(2000);

  // ── VERIFICAR ESTADO APOS BLOQUEIO ──
  log('\n=== Estado APOS bloquear e reconectar ===');
  const previaDepois = await page.evaluate(() => document.querySelector('[data-previa-transacoes]')?.textContent?.trim() ?? null);
  const msgDepois = await page.evaluate(() => document.querySelector('[data-importacao-mensagem]')?.textContent?.trim() ?? null);
  const abrirConfDepois = await page.locator('[data-abrir-confirmacao]').isVisible().catch(() => false);
  log(`[data-previa-transacoes]: ${previaDepois}`);
  log(`[data-importacao-mensagem]: ${msgDepois}`);
  log(`[data-abrir-confirmacao] visivel: ${abrirConfDepois}`);

  const stagingDepois = await readStore(page, 'registrosImportacaoTransacoes');
  log(`Staging IDB depois: ${stagingDepois.length} registros (deve persistir)`);

  // ── RESULTADO ──
  log('\n=== RESULTADO CT-SEG-02 ===');

  const previaAntesOk = previaAntes !== null && previaAntes !== '0';
  const previaLimpa = previaDepois === null || previaDepois === '0' || previaDepois === '';
  const confirmacaoLimpa = !abrirConfDepois;
  const msgLimpa = !msgDepois || !msgDepois.includes('Prévia');
  const stagingPersistiu = stagingDepois.length >= stagingAntes.length;

  log(`Previa tinha dados antes do bloqueio: ${previaAntesOk ? '✓' : '✗'} (${previaAntes})`);
  log(`Previa limpa apos bloqueio: ${previaLimpa ? '✓' : '✗'} (${previaDepois})`);
  log(`Botao confirmar nao exposto apos bloqueio: ${confirmacaoLimpa ? '✓' : '✗'}`);
  log(`Mensagem de previa nao persiste: ${msgLimpa ? '✓' : '✗'}`);
  log(`Staging IDB persistiu (dados nao apagados): ${stagingPersistiu ? '✓' : '✗'}`);

  const aprovado = previaAntesOk && previaLimpa && confirmacaoLimpa && stagingPersistiu;
  log(`Status: ${aprovado ? 'APROVADO' : 'REPROVADO'}`);

  if (errors.length > 0) log('Erros: ' + errors.join(' | '));

  await browser.close();
  log('=== FIM ===');
}

run().catch(e => { console.error('FATAL:', e); process.exit(1); });
