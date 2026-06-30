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

async function waitDbReady(page) {
  for (let i = 0; i < 10; i++) {
    const r = await page.evaluate(() => new Promise(resolve => {
      const req = indexedDB.open('kzera_operacional_1102');
      req.onupgradeneeded = () => { req.result.close(); resolve({ notReady: true }); };
      req.onerror  = () => resolve({ error: true });
      req.onsuccess = () => { req.result.close(); resolve({ ok: true }); };
    }));
    if (r?.ok) return true;
    await page.waitForTimeout(1500);
  }
  return false;
}

// Lê todos os registros de um store
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

// Limpa stores de staging
async function clearStagingStores(page) {
  return page.evaluate(() => new Promise(resolve => {
    const req = indexedDB.open('kzera_operacional_1102');
    req.onsuccess = () => {
      const db = req.result;
      const names = ['registrosImportacaoTransacoes','registrosImportacaoFinanceira','lotesImportacaoTransacoes','lotesImportacaoFinanceira'];
      let done = 0;
      const finish = () => { if (++done === names.length) { db.close(); resolve(true); } };
      for (const n of names) {
        if (!db.objectStoreNames.contains(n)) { finish(); continue; }
        const tx = db.transaction(n,'readwrite');
        tx.objectStore(n).clear().onsuccess = () => finish();
        tx.onerror = () => finish();
      }
    };
  }));
}

// Inspeciona propriedades com valor undefined (own keys)
function findUndefinedKeys(obj, path = '') {
  const issues = [];
  if (!obj || typeof obj !== 'object') return issues;
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const fullPath = path ? `${path}.${key}` : key;
    if (val === undefined) {
      issues.push(fullPath);
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      issues.push(...findUndefinedKeys(val, fullPath));
    }
  }
  return issues;
}

// Reimplementação de stableStringify (mesma lógica do app)
function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const obj = value;
  return `{${Object.keys(obj).sort().map(key => `${JSON.stringify(key)}:${stableStringify(obj[key])}`).join(',')}}`;
}

function hashCurto(texto) {
  let hash = 0;
  for (let i = 0; i < texto.length; i++) hash = ((hash << 5) - hash + texto.charCodeAt(i)) | 0;
  return Math.abs(hash).toString(36);
}

function assinaturaPacoteDeItens(itens) {
  return hashCurto(stableStringify(itens.map(item => ({
    registroTransacaoId: item.registroTransacaoId,
    linha: item.linha,
    assinatura: item.assinatura,
    stagingSnapshot: item.stagingSnapshot,
    financeirosSnapshot: item.financeirosSnapshot
  })).sort((a, b) => `${a.registroTransacaoId}:${a.linha}`.localeCompare(`${b.registroTransacaoId}:${b.linha}`))));
}

// Compute what assinaturaPacote would be from the staging records + financial records
// (mimics congelarPacote's itensPacote build)
async function computeExpectedSignature(page, stagingTxns, stagingFins) {
  // The "planejadas" only include 'validado' staging records
  // For each validado txn, find its financeiroStagingIdsResolvidos
  const finsPorId = Object.fromEntries(stagingFins.map(f => [f.id, f]));
  const itens = stagingTxns
    .filter(t => t.status === 'validado')
    .map(t => ({
      registroTransacaoId: t.id,
      linha: t.linha,
      assinatura: t.assinatura || '',
      stagingSnapshot: t,
      financeirosSnapshot: (t.financeiroStagingIdsResolvidos || []).map(id => finsPorId[id]).filter(Boolean)
    }));

  const sig = assinaturaPacoteDeItens(itens);
  return { sig, count: itens.length, itens };
}

// Also compute after JSON round-trip (simulating packJson/unpackJson)
function jsonRoundTrip(obj) {
  return JSON.parse(JSON.stringify(obj));
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

  // Seed mínimo: precisamos de pelo menos 1 perfil (Ricardo)
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
    { nome: 'Pasta', valor: '18', custo: '6' },
  ]) {
    await jsClick(page, '[data-action="novo-item"]');
    await page.waitForSelector('#item-nome', { timeout: 6000 });
    await page.locator('#item-nome').fill(item.nome);
    const valorInputs = await page.locator('input[type="number"]').all();
    if (valorInputs.length >= 1) await valorInputs[0].fill(item.valor);
    if (valorInputs.length >= 2) await valorInputs[1].fill(item.custo);
    await jsClick(page, '[data-testid="item-form"] button[type="submit"]');
    await page.waitForSelector('[data-action="novo-item"]', { timeout: 10000 });
    await page.waitForTimeout(300);
  }
  log('Itens criados');

  // Navegar para importação
  await jsClick(page, '[data-nav="importacao"]');
  await page.waitForTimeout(1000);

  const modal = page.locator('[role="dialog"][aria-modal="true"]');
  if (await modal.isVisible({ timeout: 800 }).catch(() => false)) await page.keyboard.press('Escape');
  const postpone = page.locator('[data-backup-postpone]');
  if (await postpone.isVisible({ timeout: 800 }).catch(() => false)) await postpone.click({ force: true });

  await waitDbReady(page);
  await clearStagingStores(page);

  // Upload CSV vendas
  const fileInput1 = page.locator('[data-file-upload-transacoes]');
  await fileInput1.setInputFiles([{ name: 'vendas_qa_v3.csv', mimeType: 'text/csv', buffer: CSV_V3 }]);
  await page.waitForTimeout(1000);

  // Upload CSV financeiro
  const fileInput2 = page.locator('[data-file-upload-financeiro]');
  await fileInput2.waitFor({ state: 'attached', timeout: 10000 });
  await fileInput2.setInputFiles([{ name: 'financeiro_qa_v3.csv', mimeType: 'text/csv', buffer: CSV_FIN_V3 }]);
  await page.waitForTimeout(1000);

  // Preparar
  await page.waitForSelector('[data-preparar-importacao]', { timeout: 10000 });
  await jsClick(page, '[data-preparar-importacao]');
  await page.waitForSelector('[data-conciliar-importacao]', { timeout: 15000 });
  await page.waitForTimeout(1000);

  // ── CAPTURAR STAGING ANTES DA CONCILIAÇÃO ──
  const stagingPreConciliar = await readStore(page, 'registrosImportacaoTransacoes');
  log(`Staging pré-conciliar: ${stagingPreConciliar.length} registros`);

  // Conciliar
  await jsClick(page, '[data-conciliar-importacao]');
  await page.waitForSelector('[data-gerar-previa]', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500);

  // ── CAPTURAR STAGING APÓS CONCILIAÇÃO, ANTES DA PRÉVIA ──
  const stagingPostConciliar = await readStore(page, 'registrosImportacaoTransacoes');
  const finPostConciliar = await readStore(page, 'registrosImportacaoFinanceira');
  log(`Staging pós-conciliar: ${stagingPostConciliar.length} registros`);

  // Verificar undefined keys
  log('\n=== DIAGNÓSTICO DE CAMPOS UNDEFINED ===');
  for (const rec of stagingPostConciliar) {
    const undef = findUndefinedKeys(rec);
    if (undef.length) log(`  txn[${rec.linha}/${rec.status}] undefined keys: ${undef.join(', ')}`);
  }

  // Computar assinatura esperada (antes de gerar prévia)
  const { sig: sigEsperada, count, itens } = await computeExpectedSignature(page, stagingPostConciliar, finPostConciliar);
  log(`\nAssinatura esperada (pre-previa): ${sigEsperada} (${count} planejadas)`);

  // Verificar diferença após JSON round-trip
  const stagingRoundTrip = jsonRoundTrip(stagingPostConciliar);
  const finRoundTrip = jsonRoundTrip(finPostConciliar);
  const { sig: sigRoundTrip } = await computeExpectedSignature(page, stagingRoundTrip, finRoundTrip);
  log(`Assinatura após JSON round-trip: ${sigRoundTrip}`);
  if (sigEsperada !== sigRoundTrip) {
    log('!!! DIFERENÇA APÓS JSON ROUND-TRIP — ISSO É O BUG !!!');
    // Encontrar qual campo difere
    for (const rec of stagingPostConciliar) {
      const rt = jsonRoundTrip(rec);
      const origStr = stableStringify(rec);
      const rtStr = stableStringify(rt);
      if (origStr !== rtStr) {
        log(`  Diferença em txn[${rec.linha}/${rec.status}]:`);
        log(`    Original keys: ${Object.keys(rec).sort().join(', ')}`);
        log(`    RoundTrip keys: ${Object.keys(rt).sort().join(', ')}`);
        // Find specific diff
        const allKeys = new Set([...Object.keys(rec), ...Object.keys(rt)]);
        for (const k of [...allKeys].sort()) {
          const v1 = rec[k];
          const v2 = rt[k];
          if (v1 !== v2 || (k in rec) !== (k in rt)) {
            log(`    KEY [${k}]: original=${JSON.stringify(v1)} → roundtrip=${JSON.stringify(v2)}`);
          }
        }
      }
    }
  } else {
    log('JSON round-trip OK — a diferença está no decrypt do pacote');
  }

  // ── GERAR PRÉVIA ──
  await jsClick(page, '[data-gerar-previa]');
  await page.waitForSelector('[data-abrir-confirmacao]', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500);

  // ── CAPTURAR PACOTE CONGELADO DO INDEXEDDB ──
  const pacotes = await readStore(page, 'pacotesConfirmacaoHistorica');
  log(`\nPacotes em IndexedDB: ${pacotes.length}`);
  for (const p of pacotes) {
    log(`  Pacote id=${p.id} status=${p.status} assinaturaPacote=${p.assinaturaPacote}`);
    log(`  previaId=${p.previaId}`);
  }

  // Comparar assinatura esperada com a armazenada
  if (pacotes.length > 0) {
    const pacoteAtual = pacotes[pacotes.length - 1];
    log(`\nComparando assinaturas:`);
    log(`  Esperada (pre-previa staging): ${sigEsperada}`);
    log(`  Armazenada no pacote:          ${pacoteAtual.assinaturaPacote}`);
    if (sigEsperada === pacoteAtual.assinaturaPacote) {
      log('  ✓ ASSINATURAS BATEM — bug é no decrypt/re-hash ao validar');
    } else {
      log('  ✗ ASSINATURAS DIVERGEM — staging pós-conciliar difere do snapshot');
    }
  }

  // ── CAPTURAR STAGING APÓS PRÉVIA (confirmacaoPreviaId agora setado) ──
  const stagingPostPrevia = await readStore(page, 'registrosImportacaoTransacoes');
  log('\nStaging pós-prévia (campos novos):');
  for (const rec of stagingPostPrevia) {
    const undef = findUndefinedKeys(rec);
    log(`  txn[${rec.linha}] status=${rec.status} confirmacaoPreviaId=${rec.confirmacaoPreviaId || 'N/A'} undefinedKeys=${undef.join('|') || 'nenhum'}`);
  }

  // ── ABRIR CONFIRMAÇÃO E CONFIRMAR ──
  await jsClick(page, '[data-abrir-confirmacao]');
  await page.waitForTimeout(1000);
  const hasConfBtn = await page.waitForSelector('[data-confirmar-importacao]', { timeout: 8000 }).then(() => true).catch(() => false);

  if (hasConfBtn) {
    log('\nClicando confirmar...');
    const errsBefore = errors.length;
    await jsClick(page, '[data-confirmar-importacao]');
    await page.waitForTimeout(4000);
    const newErrs = errors.slice(errsBefore);
    log('Erros após confirmar: ' + (newErrs.length > 0 ? newErrs.join(' | ') : 'NENHUM'));

    const msg = await page.evaluate(() => document.querySelector('[data-importacao-mensagem]')?.textContent?.trim() ?? null);
    log('Mensagem pós-confirmar: ' + msg);

    // Estado final oficial
    const oficial = await page.evaluate(() => new Promise(resolve => {
      const req = indexedDB.open('kzera_operacional_1102');
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction('transacoesFinanceiras', 'readonly');
        const all = tx.objectStore('transacoesFinanceiras').getAll();
        all.onsuccess = () => { db.close(); resolve(all.result.length); };
      };
      req.onerror = () => resolve(-1);
    }));
    log('transacoesFinanceiras após confirmar: ' + oficial);
  }

  await browser.close();
  log('=== FIM ===');
}

run().catch(e => { console.error('FATAL:', e); process.exit(1); });
