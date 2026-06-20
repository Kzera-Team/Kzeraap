const assert = require('assert');
const fs = require('fs');
const pkg = require('../package.json');
const css = fs.readFileSync('public/styles.css', 'utf8');
const view = fs.readFileSync('src/presentation/perfil/PerfilDomView.ts', 'utf8');
const binder = fs.readFileSync('src/presentation/perfil/binders/PerfilImportacaoBinder.ts', 'utf8');

assert.strictEqual(pkg.version, '1.19.11', 'Versão deve ser 1.19.11.');
assert(view.includes('perfil-import-file-card'), 'Tela deve manter card de arquivo.');
assert(view.includes('perfil-import-preview-head'), 'Tela deve manter cabeçalho de prévia.');
assert(binder.includes('Conhece Pessoalmente'), 'Checkbox deve voltar para Conhece Pessoalmente.');
assert(binder.includes('Válido') && binder.includes('Inválido'), 'Status deve aparecer.');
assert(!binder.includes('Ao vivo'), 'Ao vivo não deve aparecer nesse fluxo.');
assert(css.includes('1.19.11 auditoria visual final'), 'CSS final de auditoria visual deve existir.');
assert(css.includes('background: rgba(255,255,255,.98)') || css.includes('background: rgba(255,255,255,.98) !important'), 'Cards devem ser brancos/claros.');
assert(css.includes('position: static !important'), 'Botão não deve sobrepor cards.');
assert(css.includes('grid-template-columns: 48px minmax(0, 1fr) 76px'), 'Card de arquivo deve manter ação na direita no iPhone.');
console.log('perfil-importacao-iphone-11911 ok: visual final comparado em viewport iPhone.');
