const fs = require('fs');
const assert = require('assert');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

const pkg = JSON.parse(read('package.json'));
const appVersion = read('src/app/appVersion.ts');
const daily = read('docs/governanca/00_LEIA_TODO_DIA.md');
const beforeCode = read('docs/governanca/01_LEIA_ANTES_DE_ALTERAR_CODIGO.md');
const estado = read('docs/governanca/04_ESTADO_ATUAL_OFICIAL.md');
const licoes = read('docs/governanca/05_LICOES_APRENDIDAS.md');
const resumo = read('docs/governanca/07_LICOES_RESUMO_RAPIDO.md');
const governance = read('src/domain/governanca/OperacaoKzera.ts');

assert.strictEqual(pkg.version, '1.19.5', 'package.json deve avançar para 1.12.0.');
assert(appVersion.includes("APP_VERSION = '1.19.5'"), 'APP_VERSION deve estar em 1.12.0.');

assert(daily.includes('Ler o resumo rápido de Lições Aprendidas'), 'Leitura diária deve exigir lições aprendidas.');
assert(beforeCode.includes('Lições aprendidas obrigatórias'), 'Antes de codar deve exigir lições aprendidas.');
assert(beforeCode.includes('Isso passou só no build ou passou na vida real da Usuária?'), 'Antes de codar deve bloquear feito falso.');

assert(estado.includes('1.13.1 — Recuperação de pesagem interrompida'), 'Estado atual deve registrar a versão funcional atual 1.12.0.');
assert(estado.includes('1.13.1 — Recuperação de pesagem interrompida'), 'Estado atual deve preservar cadastro de balanças como etapa funcional.');

const regrasCriticas = [
  'Não tratar o líder como fiscal',
  'Tela bonita não basta',
  'Rolagem não é arquitetura',
  'Build passando não significa pronto',
  'Pendência não é Backlog',
  'Unidade de medida não é detalhe textual',
  'Lote precisa de tela própria',
  'Interrupção é cenário obrigatório',
  'Aprendizado precisa virar regra',
  'O erro raiz é não simular antes de executar',
  'Não entregar “feito” porque compilou',
];
for (const regra of regrasCriticas) {
  assert(licoes.includes(regra), `Lições aprendidas deve conter: ${regra}`);
}

assert(resumo.includes('Não transformar o líder em fiscal'), 'Resumo rápido deve preservar erro de fiscal.');
assert(resumo.includes('Não chamar de pronto só porque o build passou'), 'Resumo rápido deve preservar feito falso.');
assert(resumo.includes('mg` interno e `g`'), 'Resumo rápido deve preservar regra de unidade.');
assert(resumo.includes('vida real da Usuária'), 'Resumo rápido deve fechar com teste da Usuária.');

assert(governance.includes('docs/governanca/07_LICOES_RESUMO_RAPIDO.md'), 'Governança deve referenciar resumo rápido de lições.');
assert(governance.includes('LICOES_RESUMO_RAPIDO_OBRIGATORIAS'), 'Código deve expor resumo rápido de lições.');

assert(pkg.scripts.test.includes('governanca-licoes-1951.test.cjs'), 'npm test deve incluir lições aprendidas 1.10.0.');
assert(pkg.scripts.check.includes('governanca-licoes-1951.test.cjs'), 'npm check deve incluir lições aprendidas 1.10.0.');

console.log('governanca licoes aprendidas 1.10.0 ok');
