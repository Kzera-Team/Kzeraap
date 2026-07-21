import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync } from 'fs';

// CT-REG-04 / CT-REGRAS-FINANCEIRAS CT-REG-07
// Objetivo: confirmar que o sistema bloqueia confirmacao quando nao existe previa gerada.

const BASE        = 'http://localhost:4174/Kzeraap/';
const SENHA       = 'teste1234';
const CODIGO_RULE = JSON.stringify({ parts: [{ tipo: 'bairro', tamanho: 3 }] });
const CSV_V3      = readFileSync('/tmp/vendas_qa_v3.csv');
const CSV_FIN_V3  = readFileSync('/tmp/financeiro_qa_v3.csv');

function log(m) { console.log(`[${new Date().toISOString().slice(11,19)}] ${m}`); }

async function jsClick(page, sel) {
  return page.evaluate(s => { const el = document.querySelector(s); if(el){el.click();return true;} return false; }, sel);
}

async function login(page) {
  const pwdInputs = await page.locator('input[type="password"]').count();
  if (pwdInputs === 0) { log('Já logado'); return; }
  await page.locator('input[type="password"]').first().fill(SENHA);
  if (pwdInputs >= 2) await page.locator('input[type="password"]').nth(1).fill(SENHA);
  const btn = page.locator('button').filter({ hasText: /criar|confirmar|entrar/i }).first();
  await btn.click();
  await page.waitForSelector('[data-nav]', { timeout: 30000 });
  await page.waitForTimeout(1000);
}

async function clearStore(page, storeName) {
  return page.evaluate(name => new Promise(resolve => {
    const req = indexedDB.open('kzera_operacional_1102');
    req.onsuccess = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(name)) { db.close(); resolve(true); return; }
      const tx = db.transaction(name, 'readwrite');
      tx.objectStore(name).clear().onsuccess = () => { db.close(); resolve(true); };
    };
    req.onerror = () => resolve(false);
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

  // Importação + conciliação (sem gerar prévia)
  await jsClick(page, '[data-nav="importacao-transacoes"]');
  await page.waitForTimeout(1000);
  const modal = page.locator('[role="dialog"][aria-modal="true"]');
  await modal.waitFor({ state: 'attached', timeout: 10000 }).catch(() => {});

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
  log('Conciliação concluída (sem gerar prévia)');

  // ── CENÁRIO 1: UI não mostra botão confirmar antes da prévia ──
  log('\n=== CT-REG-04 Cenário 1: UI não expõe confirmação sem prévia ===');
  const abrirConfirmacaoVisivel = await page.locator('[data-abrir-confirmacao]').isVisible().catch(() => false);
  const confirmarVisivel = await page.locator('[data-confirmar-importacao]').isVisible().catch(() => false);
  log(`[data-abrir-confirmacao] visível: ${abrirConfirmacaoVisivel}`);
  log(`[data-confirmar-importacao] visível: ${confirmarVisivel}`);

  // ── CENÁRIO 2: gerar prévia, depois limpar pacote do IDB e tentar confirmar ──
  log('\n=== CT-REG-04 Cenário 2: pacote apagado do IDB após prévia ===');
  await jsClick(page, '[data-gerar-previa]');
  await page.waitForSelector('[data-abrir-confirmacao]', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500);

  // Apagar o pacote congelado do IndexedDB
  await clearStore(page, 'pacotesConfirmacaoHistorica');
  log('Pacote apagado do IndexedDB');

  await jsClick(page, '[data-abrir-confirmacao]');
  await page.waitForTimeout(1000);
  const hasConfBtn = await page.waitForSelector('[data-confirmar-importacao]', { timeout: 8000 }).then(() => true).catch(() => false);

  if (hasConfBtn) {
    const errsBefore = errors.length;
    await jsClick(page, '[data-confirmar-importacao]');
    await page.waitForTimeout(4000);
    const newErrs = errors.slice(errsBefore);
    const msg = await page.evaluate(() => document.querySelector('[data-importacao-mensagem]')?.textContent?.trim() ?? null);
    log('Erros: ' + (newErrs.length > 0 ? newErrs.join(' | ') : 'nenhum'));
    log('Mensagem: ' + msg);

    const bloqueouSemPacote = newErrs.some(e => /pr[eé]via|pacote.*n[aã]o.*encontrado|n[aã]o.*encontrado/i.test(e)) ||
      (msg && /pr[eé]via|pacote.*n[aã]o.*encontrado|n[aã]o.*encontrado/i.test(msg));
    log('Bloqueou sem pacote: ' + bloqueouSemPacote);
  } else {
    log('Botão confirmar não apareceu — sistema pode exigir nova prévia via UI');
  }

  // Resultado consolidado
  log('\n=== RESULTADO CT-REG-04 ===');
  if (!abrirConfirmacaoVisivel && !confirmarVisivel) {
    log('Cenário 1: ✓ UI não expõe confirmação antes da prévia');
  } else {
    log('Cenário 1: ✗ Botão de confirmação apareceu sem prévia');
  }

  await browser.close();
  log('=== FIM ===');
}

run().catch(e => { console.error('FATAL:', e); process.exit(1); });
