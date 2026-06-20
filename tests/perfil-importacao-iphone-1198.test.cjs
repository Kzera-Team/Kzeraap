const assert = require('node:assert');
const fs = require('node:fs');

const binder = fs.readFileSync('src/presentation/perfil/binders/PerfilImportacaoBinder.ts', 'utf8');
const view = fs.readFileSync('src/presentation/perfil/PerfilDomView.ts', 'utf8');
const css = fs.readFileSync('public/styles.css', 'utf8');

assert(binder.includes('Conhece Pessoalmente'), 'Checkbox deve voltar para Conhece Pessoalmente.');
assert(!binder.includes('Ao vivo'), 'Importação não deve exibir Ao vivo.');
assert(binder.includes('perfil-import-status') && binder.includes('Válido') && binder.includes('Inválido'), 'Status Válido/Inválido deve existir.');
assert(binder.includes('Importe um arquivo primeiro'), 'Botão deve orientar antes de arquivo importado.');
assert(binder.includes('Corrija os inválidos'), 'Botão deve bloquear com inválidos.');
assert(!binder.includes('data-preview-field="cidade"'), 'Município/cidade não deve aparecer no preview.');
assert(view.includes('perfil-import-file-card'), 'Tela deve ter card de arquivo limpo para iPhone.');
assert(css.includes('max-width: 430px'), 'Tela deve ter limite de largura para iPhone.');
assert(css.includes('.perfil-import-card-pair') && css.includes('grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)'), 'Telefone e bairro devem caber em linha no iPhone.');
assert(css.includes('.perfil-import-card-footer'), 'Checkbox e status devem ficar dentro do card.');
assert(css.includes('background: #ffffff') && css.includes('box-shadow'), 'Cards devem ter fundo limpo e sombra suave.');

console.log('perfil-importacao-iphone-1198 ok');
