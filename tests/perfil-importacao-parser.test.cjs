const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const template = fs.readFileSync('src/domain/perfil/PerfilImportacaoTemplate.ts', 'utf8');
const parser = fs.readFileSync('src/domain/perfil/PerfilImportacaoParser.ts', 'utf8');
const usecase = fs.readFileSync('src/application/perfil/ParseImportacaoPerfisUseCase.ts', 'utf8');
const factory = fs.readFileSync('src/app/createPerfilModule.ts', 'utf8');
const docs = fs.readFileSync('docs/CLIENTE_IMPORTACAO_PARSER_1.0.2.md', 'utf8');

assert(template.includes('CLIENTE_IMPORTACAO_TEMPLATE'), 'Template de importação obrigatório.');
assert(template.includes("'nome'"), 'Template precisa mapear nome.');
assert(template.includes('Nome'), 'Colunas recomendadas precisam incluir Nome.');
assert(parser.includes('detectDelimiter'), 'Parser precisa detectar delimitador.');
assert(parser.includes('parseDelimitedLine'), 'Parser precisa suportar aspas.');
assert(parser.includes('colunasIgnoradas'), 'Parser precisa reportar colunas ignoradas.');
assert(usecase.includes('ParseImportacaoPerfisUseCase'), 'Use case de parse obrigatório.');
assert(factory.includes('parseImportacao'), 'Módulo Perfil precisa expor parseImportacao.');
assert(docs.includes('XLS/XLSX passam a ser aceitos'), 'Docs precisam registrar regra atual de XLS/XLSX.');

console.log('perfil-importacao-parser.test.cjs OK');
