const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const pkg = JSON.parse(read('package.json'));
const version = read('src/app/appVersion.ts');
if (pkg.version !== '1.19.5') throw new Error('package.json deve estar em 1.15.1.');
if (!version.includes("APP_VERSION = '1.19.5'")) throw new Error('APP_VERSION deve estar em 1.15.1.');

const docPath = 'docs/SEGURANCA_DOCUMENTACAO_E_DADOS_1.15.1.md';
if (!fs.existsSync(path.join(root, docPath))) throw new Error('Documento de segurança de documentação/dados deve existir.');

const doc = read(docPath);
[
  'Não criptografar toda a documentação',
  'Documentação operacional deve ser legível',
  'Dados reais e segredos devem ser protegidos',
  'CSV real não é documentação',
  'Backup deve permanecer criptografado',
  'Nunca colocar no repositório'
].forEach(term => {
  if (!doc.includes(term)) throw new Error(`Política incompleta: ${term}`);
});

const governanca = read('src/domain/governanca/OperacaoKzera.ts');
[
  'POLITICA_DOCUMENTACAO_DADOS',
  'criptografarTodaDocumentacao: false',
  'documentacaoGovernancaLegivel: true',
  'dadosReaisProtegidos: true',
  'csvRealNaoVersionarComoDocumento: true',
  'segredosNuncaNoRepositorio: true',
  'DOCUMENTOS_SEGURANCA_DADOS_OBRIGATORIOS'
].forEach(term => {
  if (!governanca.includes(term)) throw new Error(`Governança sem política de documentação/dados: ${term}`);
});

const leitura = read('docs/governanca/01_LEIA_ANTES_DE_ALTERAR_CODIGO.md') + read('docs/governanca/07_LICOES_RESUMO_RAPIDO.md');
[
  'cliente real',
  'carteira real',
  'backup descriptografado',
  'dado real e segredo'
].forEach(term => {
  if (!leitura.includes(term)) throw new Error(`Leitura obrigatória não reforça segurança de dados: ${term}`);
});

console.log('seguranca-documentacao-dados-1141 ok');
