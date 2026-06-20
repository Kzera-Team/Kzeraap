const fs = require('fs');
const assert = require('assert');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

const pkg = JSON.parse(read('package.json'));
const version = read('src/app/appVersion.ts');
const estado = read('docs/governanca/04_ESTADO_ATUAL_OFICIAL.md');
const licoes = read('docs/governanca/05_LICOES_APRENDIDAS.md');
const resumo = read('docs/governanca/07_LICOES_RESUMO_RAPIDO.md');
const beforeCode = read('docs/governanca/01_LEIA_ANTES_DE_ALTERAR_CODIGO.md');
const daily = read('docs/governanca/00_LEIA_TODO_DIA.md');
const doc = read('docs/TRANSACOES_IMPORTACAO_CSV_1.13.2.md');
const governance = read('src/domain/governanca/OperacaoKzera.ts');

assert.strictEqual(pkg.version, '1.19.5', 'Versão deve avançar para 1.13.2 como ajuste de governança/decisão.');
assert(version.includes("APP_VERSION = '1.19.5'"), 'APP_VERSION deve estar em 1.13.2.');

assert(licoes.includes('Não criar atalho antes da entidade principal'), 'Lições devem registrar atalho antes da entidade principal.');
assert(licoes.includes('fracionamento mínimo'), 'Lições devem registrar contorno com fracionamento mínimo.');
assert(licoes.includes('Importação de Transações não pode criar bagunça silenciosa'), 'Lições devem registrar importação segura de Transações.');

assert(resumo.includes('Não criar atalho operacional antes da entidade principal existir'), 'Resumo rápido deve bloquear atalho antes da entidade principal.');
assert(resumo.includes('CSV de Transações'), 'Resumo rápido deve lembrar importação de Transações.');
assert(beforeCode.includes('Não criar “transação rápida”'), 'Antes de codar deve impedir transação rápida paralela.');
assert(beforeCode.includes('Não importar transação de CSV'), 'Antes de codar deve impedir importação sem prévia corrigível.');
assert(daily.includes('Perfil não é obrigatório em transação'), 'Leitura diária deve registrar regra de Perfil opcional.');
assert(daily.includes('nome do cliente é obrigatório'), 'Leitura diária deve registrar nome obrigatório.');

assert(estado.includes('1.13.2 — Lição aprendida'), 'Estado atual deve registrar 1.13.2.');
assert(estado.includes('1.15.1 — Importação de Transações'), 'Estado atual deve apontar Importação de Transações como próxima funcionalidade.');

assert(doc.includes('Nome do cliente é obrigatório'), 'Doc de Transações deve registrar nome obrigatório.');
assert(doc.includes('Descrição'), 'Doc deve tratar coluna Descrição.');
assert(doc.includes('múltiplos itens'), 'Doc deve registrar descrição com múltiplos itens.');
assert(doc.includes('Mapear para Item/Variação existente'), 'Doc deve prever mapeamento de item inexistente.');
assert(doc.includes('Criar Item/Variação com confirmação explícita'), 'Doc deve prever criação confirmada.');
assert(doc.includes('Ignorar aquela linha/item'), 'Doc deve prever ignorar linha/item.');

assert(governance.includes('REGRA_TRANSACAO_BASE'), 'Governança deve expor regra de Transação Base.');
assert(governance.includes('clienteNomeObrigatorio: true'), 'Transação deve exigir nome do cliente.');
assert(governance.includes('perfilObrigatorio: false'), 'Perfil não deve ser obrigatório.');
assert(governance.includes('importacaoCsvObrigatoria: true'), 'Transações deve prever importação CSV.');
assert(governance.includes('atalhoAntesDaEntidadePrincipalPermitido: false'), 'Atalho antes da entidade principal deve ser proibido.');
assert(governance.includes('ACOES_IMPORTACAO_TRANSACAO_ITEM_INEXISTENTE'), 'Governança deve listar ações para item inexistente na importação.');

assert(pkg.scripts.test.includes('licao-transacoes-importacao-1132.test.cjs'), 'npm test deve incluir 1.13.2.');
assert(pkg.scripts.check.includes('licao-transacoes-importacao-1132.test.cjs'), 'npm check deve incluir 1.13.2.');

console.log('licao-transacoes-importacao-1132.test.cjs OK');
