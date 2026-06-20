const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert');

const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const appVersion = read('src/app/appVersion.ts');
const pkg = JSON.parse(read('package.json'));
assert.strictEqual(pkg.version, '1.19.5');
assert(appVersion.includes("APP_VERSION = '1.19.5'"), 'versão deve ser 1.19.3');

const screenMatrix = [
  ['Login', 'src/app/createKzeraAuthenticatedApp.ts', ['Digite a senha. Sem pressa.', 'Entrar']],
  ['Primeiro acesso', 'src/app/createKzeraAuthenticatedApp.ts', ['Criar senha', 'Escolha uma senha que você consiga digitar mesmo no fim do dia']],
  ['Face ID / bloqueio', 'src/app/createKzeraAuthenticatedApp.ts', ['Confirme que é você', 'Vou tentar o Face ID automaticamente.', 'use a senha abaixo sem ficar presa aqui']],
  ['Início', 'src/app/createKzeraAuthenticatedApp.ts', ['Hoje no app', '+ Perfil', '+ Item']],
  ['Menu', 'src/app/createKzeraAuthenticatedApp.ts', ['Perfis', 'Itens', 'Dinheiro', 'Configurações', 'Sair']],
  ['Código do Perfil', 'src/app/createKzeraAuthenticatedApp.ts', ['Código do Perfil', 'Exemplo', 'Configure pelo menos 3 campos']],
  ['Dinheiro / histórico', 'src/app/createKzeraAuthenticatedApp.ts', ['Resumo do dinheiro', 'O histórico importado entra no resumo do dinheiro. Ele não muda o estoque.', 'Ver números do período']],
  ['Cópia de segurança', 'src/app/createKzeraAuthenticatedApp.ts', ['Salvar cópia de segurança', 'É para proteger seu trabalho, não para te culpar.', 'Salvar cópia']],
  ['Perfis lista', 'src/presentation/perfil/templates/PerfilTemplate.ts', ['Sem pressa: busque ou crie um perfil.', 'Procure primeiro. Cadastre só se não encontrar.', 'Mostrando 80 perfis para proteger o iPhone.']],
  ['Perfil cadastro', 'src/presentation/perfil/templates/PerfilTemplate.ts', ['Novo perfil', 'Nome obrigatório', 'Conheço pessoalmente']],
  ['Perfil resumo/histórico/duplicidades', 'src/presentation/perfil/templates/PerfilTemplate.ts', ['Resumo dos perfis', 'Histórico', 'Duplicidades']],
  ['Itens lista', 'src/presentation/item/templates/ItemCatalogoTemplate.ts', ['Procure primeiro. Cadastre só se não encontrar.', 'Mostrando 80 itens para proteger o iPhone.', 'Salvar lista']],
  ['Item cadastro', 'src/presentation/item/templates/ItemCatalogoTemplate.ts', ['Novo item', 'Variações e estoque', 'Unidade + estoque']],
  ['Item importação', 'src/presentation/item/templates/ItemImportacaoTemplate.ts', ['Importar itens', 'CSV']],
  ['Estoque / entrada', 'src/presentation/item/renderers/LoteOperacionalRenderer.ts', ['Controle de estoque', 'Estoque físico', 'Cada botão de peso salva na hora']],
  ['Separações', 'src/presentation/item/renderers/LoteOperacionalRenderer.ts', ['Separações', 'Criar unidades']],
  ['Pesagem', 'src/presentation/item/renderers/LoteOperacionalRenderer.ts', ['Pesagem', 'Nenhum peso foi perdido', 'Continuar']],
  ['Balanças / configurações', 'src/presentation/configuracoes/ConfiguracoesOperacionaisView.ts', ['Regra de calma', 'Balanças', 'Pronto para pesar']],
  ['Importação histórica', 'src/presentation/importacao/ImportacaoTransacoesFinanceiroView.ts', ['Importação segura', 'Nada vira registro definitivo', 'nada baixa estoque enquanto você não confirmar']],
  ['Retomada interrompida', 'src/presentation/importacao/ImportacaoTransacoesFinanceiroView.ts', ['Encontramos uma confirmação interrompida.', 'Nada foi perdido.', 'Esse botão não confirma nada sozinho']],
  ['Conferência de pagamentos', 'src/presentation/importacao/ImportacaoTransacoesFinanceiroView.ts', ['Conferência dos pagamentos', 'Conferir pagamentos', 'Desmarque só se perceber algo estranho']],
  ['Confirmação histórica', 'src/presentation/importacao/ImportacaoTransacoesFinanceiroView.ts', ['Revisar e confirmar histórico', 'Fluxo seguro: ver antes, respirar, confirmar só quando estiver pronta.', 'Estou pronta para confirmar']],
  ['Área avançada de correção', 'src/presentation/importacao/ImportacaoTransacoesFinanceiroView.ts', ['Área avançada: corrigir algo já confirmado', 'CANCELAR COM CUIDADO']],
];

const coverage = [];
for (const [screen, file, required] of screenMatrix) {
  const source = read(file);
  for (const text of required) assert(source.includes(text), `${screen} precisa conter texto/ação humana: ${text}`);
  coverage.push(`- ${screen}: PASS`);
}

const uiFiles = Array.from(new Set(screenMatrix.map(([, file]) => file))).map(read).join('\n');
const forbiddenExact = [
  '<strong>Dashboard</strong>',
  'Config.</button>',
  '<h2>Entrar com Face ID</h2>',
  'Solicitando Face ID automaticamente',
  '<h2>Exportar backup</h2>',
  'aria-label="Exportar perfis"',
  'aria-label="Exportar itens"',
  'Lote operacional',
  'Valor de transacao',
  'Transacoes cedo',
  'IndexedDB',
  'Conciliar staging',
  'Pré-visualizar e congelar pacote',
  'Lotes confirmados recuperáveis',
  'Detalhe técnico guardado',
  '>DESFAZER<',
  'Retomar com segurança'
];
for (const bad of forbiddenExact) assert(!uiFiles.includes(bad), `UI 100% não pode conter: ${bad}`);

const doc = read('docs/governanca/09_COBERTURA_USUARIA_1.19.5.md');
for (const [screen] of screenMatrix) assert(doc.includes(`| ${screen} |`), `matriz precisa registrar tela: ${screen}`);
assert(doc.includes('Cobertura simulada: 100% das telas existentes do pacote 1.19.5'), 'documento precisa declarar cobertura simulada 100%');
assert(doc.includes('Não substitui teste real no iPhone'), 'documento precisa ser honesto sobre teste real');

console.log('anti-burnout-total-1191 OK');
