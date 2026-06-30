import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync } from 'fs';

// CT-REG-09 — Duplicidade dentro do lote
// Massa: vendas_qa_dup.csv — duas linhas identicas da transacao 801 (valorPago=0)
// Esperado:
//   - previa detecta duplicidade interna e bloqueia segunda linha
//   - faturamento nao e inflado (apenas 1x 25, nao 2x 25)
//   - apenas 1 transacaoFinanceira criada (nao 2)

const BASE        = 'http://localhost:4174/Kzeraap/';
const SENHA       = 'teste1234';
const CODIGO_RULE = JSON.stringify({ parts: [{ tipo: 'bairro', tamanho: 3 }] });
const CSV_DUP     = readFileSync('/tmp/vendas_qa_dup.csv');
const CSV_EMPTY_F = readFileSync('/tmp/financeiro_qa_empty.csv');

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

  // Seed: Ricardo, Escova
  await jsClick(page, '[data-nav="perfis"]');
  await page.waitForSelector('[data-action="novo-perfil"]', { timeout: 8000 });
  await jsClick(page, '[data-action="novo-perfil"]');
  await page.waitForSelector('#perfil-nome', { timeout: 6000 });
  await page.locator('#perfil-nome').fill('Ricardo');
  await jsClick(page, '[data-testid="perfil-form"] button[type="submit"]');
  await page.waitForSelector('[data-action="novo-perfil"]', { timeout: 10000 });

  await jsClick(page, '[data-nav="itens"]');
  await page.waitForSelector('[data-action="novo-item"]', { timeout: 8000 });
  await jsClick(page, '[data-action="novo-item"]');
  await page.waitForSelector('#item-nome', { timeout: 6000 });
  await page.locator('#item-nome').fill('Escova');
  await jsClick(page, '[data-testid="item-form"] button[type="submit"]');
  await page.waitForSelector('[data-action="novo-item"]', { timeout: 10000 });
  log('Seed criado: Ricardo, Escova');

  // Importar somente transacoes (2 linhas identicas de 801)
  await jsClick(page, '[data-nav="importacao-transacoes"]');
  await page.waitForTimeout(1000);
  await page.locator('[role="dialog"][aria-modal="true"]').waitFor({ state: 'attached', timeout: 10000 }).catch(() => {});

  const fileInput1 = page.locator('[data-file-upload-transacoes]');
  await fileInput1.waitFor({ state: 'attached', timeout: 15000 });
  await fileInput1.setInputFiles([{ name: 'vendas_qa_dup.csv', mimeType: 'text/csv', buffer: CSV_DUP }]);
  await page.waitForTimeout(1000);

  const fileInput2 = page.locator('[data-file-upload-financeiro]');
  await fileInput2.waitFor({ state: 'attached', timeout: 10000 });
  await fileInput2.setInputFiles([{ name: 'financeiro_qa_empty.csv', mimeType: 'text/csv', buffer: CSV_EMPTY_F }]);
  await page.waitForTimeout(1000);

  await jsClick(page, '[data-preparar-importacao]');
  await page.waitForSelector('[data-conciliar-importacao]', { timeout: 15000 });
  await page.waitForTimeout(1000);

  const txnsPrep = await readStore(page, 'registrosImportacaoTransacoes');
  log(`Staging apos preparar: ${txnsPrep.length} transacoes (esperado 2)`);

  // Conciliar e gerar previa
  await jsClick(page, '[data-conciliar-importacao]');
  await page.waitForTimeout(2000);

  await jsClick(page, '[data-gerar-previa]');
  await page.waitForTimeout(3000);

  const msgPrevia = await page.evaluate(() =>
    document.querySelector('[data-importacao-mensagem]')?.textContent?.trim() ?? null
  );
  const previaTransacoes = await page.evaluate(() => document.querySelector('[data-previa-transacoes]')?.textContent?.trim() ?? null);
  const previaBloqueados = await page.evaluate(() => document.querySelector('[data-previa-bloqueados]')?.textContent?.trim() ?? null);
  const previaFaturamento = await page.evaluate(() => document.querySelector('[data-previa-faturamento]')?.textContent?.trim() ?? null);

  log(`Mensagem previa: ${msgPrevia}`);
  log(`Transacoes previstas: ${previaTransacoes} (esperado 1)`);
  log(`Bloqueadas: ${previaBloqueados} (esperado 1 — duplicidade interna)`);
  log(`Faturamento previsto: ${previaFaturamento} (esperado 25, nao 50)`);

  // Confirmar e verificar oficiais
  await jsClick(page, '[data-abrir-confirmacao]');
  await page.waitForTimeout(1000);
  const hasConfBtn = await page.waitForSelector('[data-confirmar-importacao]', { timeout: 8000 }).then(() => true).catch(() => false);

  if (hasConfBtn) {
    await jsClick(page, '[data-confirmar-importacao]');
    await page.waitForTimeout(5000);
  }

  const msgConfirmar = await page.evaluate(() =>
    document.querySelector('[data-importacao-mensagem]')?.textContent?.trim() ?? null
  );
  log(`Mensagem apos confirmar: ${msgConfirmar}`);

  const transacoesFinanceiras = await readStore(page, 'transacoesFinanceiras');
  log(`transacoesFinanceiras criadas: ${transacoesFinanceiras.length} (esperado 1)`);

  // Resultado
  log('\n=== RESULTADO CT-REG-09 ===');
  const duasLinhasEntram = txnsPrep.length === 2;
  const apenasUmaNaPrevia = Number(previaTransacoes) === 1;
  const umaFoiBloqueada = Number(previaBloqueados) >= 1;
  const faturamentoCorreto = previaFaturamento && !previaFaturamento.includes('50');
  const apenasUmOficial = transacoesFinanceiras.length === 1;

  log(`Staging recebeu 2 linhas do CSV: ${duasLinhasEntram ? '✓' : '✗'}`);
  log(`Previa com apenas 1 transacao (duplicata bloqueada): ${apenasUmaNaPrevia ? '✓' : '✗'}`);
  log(`1 registro bloqueado por duplicidade: ${umaFoiBloqueada ? '✓' : '✗'}`);
  log(`Faturamento nao foi inflado (nao 50): ${faturamentoCorreto ? '✓' : '?'}`);
  log(`Apenas 1 transacaoFinanceira criada: ${apenasUmOficial ? '✓' : '✗'}`);

  const aprovado = duasLinhasEntram && apenasUmaNaPrevia && umaFoiBloqueada && apenasUmOficial;
  log(`Status: ${aprovado ? 'APROVADO' : 'REPROVADO'}`);

  if (errors.length > 0) log('Erros: ' + errors.join(' | '));

  await browser.close();
  log('=== FIM ===');
}

run().catch(e => { console.error('FATAL:', e); process.exit(1); });
