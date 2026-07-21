import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync } from 'fs';

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

async function updateStoreRecord(page, storeName, id, updates) {
  return page.evaluate(({ storeName, id, updates }) => new Promise(resolve => {
    const req = indexedDB.open('kzera_operacional_1102');
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const record = getReq.result;
        if (!record) { db.close(); resolve(false); return; }
        Object.assign(record, updates);
        store.put(record).onsuccess = () => { db.close(); resolve(true); };
      };
      getReq.onerror = () => { db.close(); resolve(false); };
    };
    req.onerror = () => resolve(false);
  }), { storeName, id, updates });
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
  log('Perfis criados');

  await jsClick(page, '[data-nav="itens"]');
  await page.waitForSelector('[data-action="novo-item"]', { timeout: 8000 });
  for (const item of [
    { nome: 'Escova', valor: '25', custo: '10' },
    { nome: 'Shampoo', valor: '45', custo: '15' },
  ]) {
    await jsClick(page, '[data-action="novo-item"]');
    await page.waitForSelector('#item-nome', { timeout: 6000 });
    await page.locator('#item-nome').fill(item.nome);
    await jsClick(page, '[data-testid="item-form"] button[type="submit"]');
    await page.waitForSelector('[data-action="novo-item"]', { timeout: 10000 });
    await page.waitForTimeout(300);
  }
  log('Itens criados');

  // Importação
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

  log('Conciliação concluída');

  // Gerar prévia
  await jsClick(page, '[data-gerar-previa]');
  await page.waitForSelector('[data-abrir-confirmacao]', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500);

  const pacotes = await readStore(page, 'pacotesConfirmacaoHistorica');
  log(`Pacotes após prévia: ${pacotes.length}`);
  if (pacotes.length === 0) {
    log('ERRO: nenhum pacote gerado — não é possível testar CT-REG-08');
    await browser.close();
    return;
  }

  // Encontrar registro que está no plano (tem confirmacaoPreviaId)
  const stagingPosPrevia = await readStore(page, 'registrosImportacaoTransacoes');
  const registroNoPlano = stagingPosPrevia.find(r => r.confirmacaoPreviaId);
  if (!registroNoPlano) {
    log('ERRO: nenhum registro no plano — prévia vazia');
    await browser.close();
    return;
  }
  log(`Registro no plano: id=${registroNoPlano.id} linha=${registroNoPlano.linha} status=${registroNoPlano.status}`);

  // ── CT-REG-08: modificar status do registro DEPOIS da prévia ──
  log('\n=== CT-REG-08 — Mudança no staging depois da prévia bloqueia confirmação ===');
  log(`Alterando status do registro linha=${registroNoPlano.linha} de '${registroNoPlano.status}' para 'pendente_perfil'`);

  const ok = await updateStoreRecord(page, 'registrosImportacaoTransacoes', registroNoPlano.id, {
    status: 'pendente_perfil',
    tiposPendencia: ['perfil_nao_encontrado']
  });
  log(`Modificação no IndexedDB: ${ok ? 'OK' : 'FALHOU'}`);

  // Tentar confirmar com o pacote antigo
  await jsClick(page, '[data-abrir-confirmacao]');
  await page.waitForTimeout(1000);
  const hasConfBtn = await page.waitForSelector('[data-confirmar-importacao]', { timeout: 8000 }).then(() => true).catch(() => false);

  if (!hasConfBtn) {
    log('CT-REG-08: botão confirmar não apareceu após modificação — sistema pode ter bloqueado na UI');
    const msg = await page.evaluate(() => document.querySelector('[data-importacao-mensagem]')?.textContent?.trim() ?? null);
    log('Mensagem na tela: ' + msg);
    await browser.close();
    return;
  }

  const errsBefore = errors.length;
  await jsClick(page, '[data-confirmar-importacao]');
  await page.waitForTimeout(4000);

  const newErrs = errors.slice(errsBefore);
  const msgPos = await page.evaluate(() => document.querySelector('[data-importacao-mensagem]')?.textContent?.trim() ?? null);

  log('Erros pageerror: ' + (newErrs.length > 0 ? newErrs.join(' | ') : 'nenhum'));
  log('Mensagem pós-confirmar: ' + msgPos);

  const transacoesCriadas = await page.evaluate(() => new Promise(resolve => {
    const req = indexedDB.open('kzera_operacional_1102');
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction('transacoesFinanceiras', 'readonly');
      const all = tx.objectStore('transacoesFinanceiras').getAll();
      all.onsuccess = () => { db.close(); resolve(all.result.length); };
    };
    req.onerror = () => resolve(-1);
  }));
  log(`transacoesFinanceiras criadas: ${transacoesCriadas}`);

  const bloqueouCorretamente = (
    transacoesCriadas === 0 &&
    (newErrs.some(e => /bloqueado|congelado|alterado|prévia/i.test(e)) ||
     (msgPos && /bloqueado|congelado|alterado|prévia/i.test(msgPos)))
  );

  if (bloqueouCorretamente) {
    log('\nRESULTADO CT-REG-08: ✓ APROVADO — confirmação foi bloqueada após mudança no staging');
  } else {
    log('\nRESULTADO CT-REG-08: ✗ REPROVADO — confirmação deveria ter sido bloqueada mas não foi');
    log('  transacoesCriadas=' + transacoesCriadas);
    log('  erros: ' + newErrs.join(' | '));
    log('  mensagem: ' + msgPos);
  }

  await browser.close();
  log('=== FIM ===');
}

run().catch(e => { console.error('FATAL:', e); process.exit(1); });
