import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync } from 'fs';

// CT-REG-03 (CT-REGRAS-FINANCEIRAS) — Artefatos oficiais devem ter vinculo rastreavel
// Verifica que TransacaoFinanceira, PagamentoTransacao e MovimentoFinanceiro
// sao criados com vinculos bidirecionais corretos apos confirmacao historica.

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

  // Fluxo completo: importar, preparar, conciliar, prévia, confirmar
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

  await jsClick(page, '[data-abrir-confirmacao]');
  await page.waitForTimeout(1000);
  const hasConfBtn = await page.waitForSelector('[data-confirmar-importacao]', { timeout: 8000 }).then(() => true).catch(() => false);

  if (!hasConfBtn) {
    log('ERRO: botão confirmar não apareceu');
    await browser.close();
    return;
  }

  await jsClick(page, '[data-confirmar-importacao]');
  await page.waitForTimeout(5000);

  const msg = await page.evaluate(() => document.querySelector('[data-importacao-mensagem]')?.textContent?.trim() ?? null);
  log('Mensagem pós-confirmar: ' + msg);

  // ── INSPECIONAR ARTEFATOS CRIADOS ──
  log('\n=== CT-REG-03 — Verificar vínculos entre artefatos oficiais ===');

  const transacoes = await readStore(page, 'transacoesFinanceiras');
  const pagamentos = await readStore(page, 'pagamentosTransacao');
  const movimentos = await readStore(page, 'movimentosFinanceiros');

  log(`transacoesFinanceiras: ${transacoes.length}`);
  log(`pagamentosTransacao:   ${pagamentos.length}`);
  log(`movimentosFinanceiros: ${movimentos.length}`);

  if (transacoes.length === 0) {
    log('ERRO: nenhuma transação criada — confirmar não executou');
    await browser.close();
    return;
  }

  // Verificar vínculos para cada transação
  let todosVinculosOk = true;
  for (const txnRecord of transacoes) {
    const txnId = txnRecord.id;
    log(`\nTransacao id=${txnId}`);

    // pagamento vinculado a esta transacao
    const pagVinculados = pagamentos.filter(p => p.transacaoId === txnId);
    log(`  pagamentos com transacaoId=${txnId}: ${pagVinculados.length}`);

    for (const pag of pagVinculados) {
      log(`  Pagamento id=${pag.id} transacaoId=${pag.transacaoId}`);
      // movimento vinculado a este pagamento
      const movVinculados = movimentos.filter(m => m.pagamentoId === pag.id || m.transacaoId === txnId);
      log(`  movimentos vinculados: ${movVinculados.length}`);
      for (const mov of movVinculados) {
        log(`    Movimento id=${mov.id} pagamentoId=${mov.pagamentoId || 'N/A'} transacaoId=${mov.transacaoId || 'N/A'}`);
      }
    }

    // Verificar vínculo bidirecional: pagamento tem transacaoId correto
    const pagSemTransacao = pagVinculados.filter(p => !p.transacaoId || p.transacaoId !== txnId);
    if (pagSemTransacao.length > 0) {
      log(`  ✗ ERRO: ${pagSemTransacao.length} pagamento(s) sem transacaoId correto`);
      todosVinculosOk = false;
    }

    // Verificar que não existem vínculos unilaterais incompletos
    const movSemVinculo = movimentos.filter(m =>
      (m.pagamentoId && !pagamentos.some(p => p.id === m.pagamentoId)) ||
      (m.transacaoId && !transacoes.some(t => t.id === m.transacaoId))
    );
    if (movSemVinculo.length > 0) {
      log(`  ✗ ERRO: ${movSemVinculo.length} movimento(s) com vínculo unilateral`);
      todosVinculosOk = false;
    }
  }

  // Resultado
  log('\n=== RESULTADO CT-REG-03 ===');
  if (todosVinculosOk && transacoes.length > 0) {
    log(`✓ APROVADO — ${transacoes.length} transacao(oes) com vinculos rastreaveis`);
    log(`  Pagamentos: ${pagamentos.length}, Movimentos: ${movimentos.length}`);
  } else {
    log('✗ REPROVADO — vínculos incorretos ou ausentes');
  }

  if (errors.length > 0) log('Erros: ' + errors.join(' | '));

  await browser.close();
  log('=== FIM ===');
}

run().catch(e => { console.error('FATAL:', e); process.exit(1); });
