const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const pkg = fs.readFileSync('package.json', 'utf8');
const arquivo = fs.readFileSync('src/domain/perfil/PerfilImportacaoArquivo.ts', 'utf8');
const gateway = fs.readFileSync('src/infrastructure/importacao/PerfilSpreadsheetImportGateway.ts', 'utf8');
const usecase = fs.readFileSync('src/application/perfil/ImportacaoPerfisArquivoUseCase.ts', 'utf8');
const factory = fs.readFileSync('src/app/createPerfilModule.ts', 'utf8');
const docs = fs.readFileSync('docs/importacao/CONFIRMACAO_HISTORICO_FINANCEIRO_1.19.3.md', 'utf8');

assert(!pkg.includes('"xlsx"'), '1.19.3 não pode depender de xlsx/codepage no build oficial.');
assert(arquivo.includes("'xls'") && arquivo.includes("'xlsx'"), 'Formatos XLS e XLSX continuam detectáveis para mensagem humana.');
assert(arquivo.includes('CLIENTE_IMPORTACAO_ACCEPT_ATTRIBUTE'), 'Accept attribute obrigatório para input no iPhone.');
assert(!gateway.includes("from 'xlsx'"), 'Gateway não pode importar xlsx no bundle oficial.');
assert(gateway.includes('temporariamente bloqueada') && gateway.includes('CSV'), 'Gateway deve orientar CSV com mensagem humana.');
assert(usecase.includes('isFormatoPlanilhaPerfil'), 'Use case precisa detectar planilha.');
assert(usecase.includes('file.text()'), 'Use case precisa manter CSV/TSV/TXT.');
assert(factory.includes('importarArquivo'), 'Módulo Perfil precisa expor importarArquivo.');
assert(docs.includes('codepage') && docs.includes('npm ci'), 'Docs precisam registrar bloqueio xlsx/codepage e build oficial.');

console.log('perfil-importacao-xlsx.test.cjs OK');
