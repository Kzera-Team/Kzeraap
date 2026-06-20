const fs = require('fs');
const assert = require('assert');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

const pkg = JSON.parse(read('package.json'));
const appVersion = read('src/app/appVersion.ts');
const daily = read('docs/governanca/00_LEIA_TODO_DIA.md');
const beforeCode = read('docs/governanca/01_LEIA_ANTES_DE_ALTERAR_CODIGO.md');
const personalidade = read('docs/governanca/02_PROMPT_PERSONALIDADE_OFICIAL.md');
const negocio = read('docs/governanca/03_PROMPT_NEGOCIO_OFICIAL.md');
const estado = read('docs/governanca/04_ESTADO_ATUAL_OFICIAL.md');
const licoes = read('docs/governanca/05_LICOES_APRENDIDAS.md');
const checklist = read('docs/governanca/06_CHECKLIST_ENTREGA_OBRIGATORIO.md');
const governance = read('src/domain/governanca/OperacaoKzera.ts');

assert.strictEqual(pkg.version, '1.19.5', 'package.json deve estar em 1.12.0 após cadastro de balanças.');
assert(appVersion.includes("APP_VERSION = '1.19.5'"), 'APP_VERSION deve estar em 1.12.0 após cadastro de balanças.');

assert(daily.includes('Leitura diária obrigatória'), 'Deve existir leitura diária obrigatória.');
assert(daily.includes('Usuária'), 'Leitura diária deve reforçar a Usuária.');
assert(daily.includes('Transações Base é a próxima funcionalidade relevante autorizada'), 'Leitura diária deve registrar Importação de Transações como próxima funcionalidade autorizada com estoque real.');
assert(daily.includes('Item → Variação → Lote'), 'Leitura diária deve fixar modelo de estoque.');

assert(beforeCode.includes('antes de qualquer alteração de código'), 'Deve existir leitura antes de alterar código.');
assert(beforeCode.includes('Qual Pendência já decidida estou resolvendo?'), 'Antes de codar deve separar pendência/backlog.');
assert(beforeCode.includes('Essa mudança cria atalho antes da entidade principal existir?'), 'Antes de codar deve proteger contra atalho fora de ordem.');
assert(beforeCode.includes('Não salvar sessão de pesagem só no final'), 'Antes de codar deve impedir perda de sessão crítica.');

assert(personalidade.includes('equipe sênior autônoma'), 'Prompt de personalidade deve preservar a identidade da equipe.');
assert(personalidade.includes('O usuário é o líder do produto'), 'Prompt de personalidade deve preservar papel do usuário.');
assert(personalidade.includes('Você está louca, querida'), 'Prompt de personalidade deve preservar regra de mudança de regra.');
assert(personalidade.includes('Build passando não significa'), 'Prompt de personalidade deve bloquear feito falso.');

assert(negocio.includes('controle de lotes'), 'Prompt de negócio deve preservar lotes.');
assert(negocio.includes('Retirada Interna'), 'Prompt de negócio deve preservar retirada interna.');
assert(negocio.includes('Pesagem rápida'), 'Prompt de negócio deve preservar pesagem rápida.');
assert(negocio.includes('07:00, 15:00 e 23:00'), 'Prompt de negócio deve preservar janelas de backup.');
assert(negocio.includes('0,5 g = 500 mg'), 'Prompt de negócio deve preservar unidade mg/g.');
assert(negocio.includes('Transação não deve ser implementada'), 'Prompt de negócio deve bloquear transação em estoque simplificado.');

assert(estado.includes('1.10.0'), 'Estado atual deve registrar versionamento vigente.');
assert(estado.includes('1.13.2 — Lição aprendida'), 'Estado atual deve registrar funcionalidade atual.');

assert(licoes.includes('Lições aprendidas'), 'Deve existir arquivo de lições aprendidas.');
assert(licoes.includes('Prompt resumido não preserva essência completa'), 'Lições aprendidas deve registrar erro da 1.9.49.');
assert(licoes.includes('Build passando não significa pronto'), 'Lições aprendidas deve registrar feito falso.');
assert(licoes.includes('Nunca mais repetir'), 'Lições aprendidas deve transformar erro em regra preventiva.');

assert(checklist.includes('O que uma pessoa cansada xingaria nessa tela?'), 'Checklist deve exigir crítica pela Usuária.');
assert(checklist.includes('O que NÃO considerar pronto ainda'), 'Checklist deve exigir conclusão honesta.');

assert(governance.includes('DOCUMENTOS_GOVERNANCA_OBRIGATORIOS'), 'Código deve listar documentos obrigatórios de governança.');
assert(governance.includes('docs/governanca/00_LEIA_TODO_DIA.md'), 'Código deve referenciar leitura diária.');
assert(governance.includes('docs/governanca/01_LEIA_ANTES_DE_ALTERAR_CODIGO.md'), 'Código deve referenciar leitura antes de código.');
assert(governance.includes('docs/governanca/05_LICOES_APRENDIDAS.md'), 'Código deve referenciar lições aprendidas.');

assert(pkg.scripts.test.includes('governanca-oficial-1950.test.cjs'), 'npm test deve incluir governança oficial 1.9.50.');
assert(pkg.scripts.test.includes('governanca-licoes-1951.test.cjs'), 'npm test deve incluir lições aprendidas 1.10.0.');
assert(pkg.scripts.check.includes('governanca-oficial-1950.test.cjs'), 'npm check deve incluir governança oficial 1.9.50.');
assert(pkg.scripts.check.includes('governanca-licoes-1951.test.cjs'), 'npm check deve incluir lições aprendidas 1.10.0.');

console.log('governanca oficial completa 1.9.50 ok');
