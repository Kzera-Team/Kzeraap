const fs = require('fs');
const assert = require('assert');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = fs.readFileSync('src/app/appVersion.ts', 'utf8');
const governance = fs.readFileSync('src/domain/governanca/OperacaoKzera.ts', 'utf8');
const doc = fs.readFileSync('docs/GOVERNANCA_OPERACIONAL_1.9.49.md', 'utf8');
const next = fs.readFileSync('docs/PROXIMA_ETAPA_ESTOQUE_1.9.49.md', 'utf8');
const testScript = pkg.scripts.test;
const checkScript = pkg.scripts.check;

assert(pkg.version === '1.19.5', 'package.json deve estar na versão atual.');
assert(version.includes("APP_VERSION = '1.19.5'"), 'APP_VERSION deve centralizar a versão atual.');
assert(governance.includes('Usuária'), 'Governança deve fixar o teste da Usuária em código.');
assert(governance.includes('TRANSACOES_BASE_AUTORIZADA_COM_ESTOQUE_REAL'), 'Transações Base deve estar autorizada apenas com estoque real rastreável.');
assert(governance.includes("TOKEN_UNIDADE_INTERNA_PRECISAO = 'UNIT_INTERNAL_PRECISION'"), 'Unidade interna deve usar token neutro.');
assert(governance.includes("TOKEN_UNIDADE_EXIBICAO_ATALHO = 'UNIT_DISPLAY_PRIMARY'"), 'Unidade de exibição deve usar token neutro.');
assert(governance.includes('avaliarSenhoraCansada'), 'Deve existir função de prontidão operacional.');
assert(governance.includes('podeIniciarTransacoes'), 'Deve existir guarda explícita para transações.');
assert(doc.includes('Build passando não significa pronto'), 'Documento deve bloquear conclusão baseada só em build.');
assert(doc.includes('Pendência') && doc.includes('Backlog'), 'Documento deve separar Pendência e Backlog.');
assert(next.includes('Lote Operacional Base'), 'Próxima etapa deve ser Lote Operacional Base.');
assert(next.includes('Não iniciar transação'), 'Próxima etapa deve bloquear transação.');
assert(testScript.includes('governanca-operacional-1949.test.cjs'), 'npm test deve incluir governança 1.9.49.');
assert(checkScript.includes('governanca-operacional-1949.test.cjs'), 'npm check deve incluir governança 1.9.49.');

console.log('governanca operacional 1.9.49 ok');
