const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const view = fs.readFileSync('src/presentation/perfil/PerfilDomView.ts', 'utf8');
const app = fs.readFileSync('src/app/createPerfilUiApp.ts', 'utf8');
const main = fs.readFileSync('src/app/browserMain.ts', 'utf8');

assert(view.includes('PerfilDomView'), 'Precisa view DOM de perfis.');
assert(view.includes('data-testid'), 'UI precisa ter pontos verificáveis.');
assert(view.includes('onCriarPerfil'), 'UI precisa criar perfil.');
assert(view.includes('onSelecionarArquivo'), 'UI precisa importar arquivo.');
assert(view.includes('onConfirmarImportacao'), 'UI precisa confirmar importação.');
assert(view.includes('onDefinirCodigo'), 'UI precisa definir código.');
assert(view.includes('onExportar'), 'UI precisa exportar.');
assert(app.includes('DEFAULT_IDENTITY_RULE'), 'App precisa regra padrão para código.');
assert(app.includes('module.fluxoImportacao'), 'App precisa conectar fluxo de importação.');
assert(main.includes('createKzeraAuthenticatedApp'), 'Browser main precisa montar app autenticado.');

console.log('perfil-ui-functional.test.cjs OK');
