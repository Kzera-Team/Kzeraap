
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert');

const root = path.resolve(__dirname, '..');
const appVersion = fs.readFileSync(path.join(root, 'src/app/appVersion.ts'), 'utf8');
assert(appVersion.includes("APP_VERSION = '1.19.5'"), 'versão deve ser 1.19.3');

const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const uiFiles = [
  'src/app/createKzeraAuthenticatedApp.ts',
  'src/presentation/perfil/templates/PerfilTemplate.ts',
  'src/presentation/perfil/PerfilDomView.ts',
  'src/presentation/perfil/renderers/PerfilCardRenderer.ts',
  'src/presentation/perfil/binders/PerfilListBinder.ts',
  'src/presentation/item/templates/ItemCatalogoTemplate.ts',
  'src/presentation/item/templates/ItemImportacaoTemplate.ts',
  'src/presentation/item/renderers/ItemCardRenderer.ts',
  'src/presentation/item/renderers/LoteOperacionalRenderer.ts',
  'src/presentation/item/binders/ItemListBinder.ts',
  'src/presentation/configuracoes/ConfiguracoesOperacionaisView.ts'
];
const joined = uiFiles.map(read).join('\n');

for (const required of [
  'Sem pressa: busque ou crie um perfil.',
  'Procure primeiro. Cadastre só se não encontrar.',
  'Mostrando 80 perfis para proteger o iPhone.',
  'Mostrando 80 itens para proteger o iPhone.',
  'Ver valores do item',
  'Vou tentar o Face ID automaticamente.',
  'Precisamos salvar uma cópia de segurança agora.',
  'Cópia de segurança salva.',
  'Regra de calma',
  'Balanças'
]) {
  assert(joined.includes(required), `UI global anti-burnout precisa conter: ${required}`);
}

for (const forbidden of [
  '<strong>Dashboard</strong>',
  'Config.</button>',
  '<h2>Entrar com Face ID</h2>',
  'Solicitando Face ID automaticamente',
  '<h2>Exportar backup</h2>',
  'Valor de transacao',
  'Lote operacional',
  'Transacoes cedo',
  'IndexedDB'
]) {
  assert(!joined.includes(forbidden), `UI principal não pode assustar com: ${forbidden}`);
}

console.log('anti-burnout-global-1190 ok');
