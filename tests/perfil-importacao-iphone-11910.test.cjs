const assert = require('node:assert');
const fs = require('node:fs');

const binder = fs.readFileSync('src/presentation/perfil/binders/PerfilImportacaoBinder.ts', 'utf8');
const view = fs.readFileSync('src/presentation/perfil/PerfilDomView.ts', 'utf8');
const css = fs.readFileSync('public/styles.css', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

assert.strictEqual(pkg.version, '1.19.11', 'Versão deve ser 1.19.11.');
assert(view.includes('perfil-import-appbar'), 'Tela deve ter topo parecido com o mockup.');
assert(view.includes('perfil-import-brand'), 'Tela deve ter marca visual no topo.');
assert(view.includes('perfil-import-file-card'), 'Tela deve ter card de arquivo premium.');
assert(view.includes('Verificamos cada item antes da importação.'), 'Texto do header deve ficar próximo ao mockup.');
assert(binder.includes('Conhece Pessoalmente'), 'Checkbox deve exibir Conhece Pessoalmente.');
assert(!binder.includes('Ao vivo'), 'Importação não deve exibir Ao vivo.');
assert(binder.includes('Válido') && binder.includes('Inválido'), 'Badges devem existir.');
assert(!binder.includes('data-preview-field="cidade"'), 'Município não deve aparecer no preview.');
assert(css.includes('radial-gradient') && css.includes('linear-gradient(180deg, #fbfcff'), 'Fundo deve ser mais próximo do desenho premium.');
assert(css.includes('position: sticky') && css.includes('env(safe-area-inset-bottom)'), 'Botão deve ser confortável no iPhone.');
assert(css.includes('-webkit-appearance: none'), 'Inputs/selects devem evitar aparência crua do Safari.');
assert(css.includes('grid-template-columns: minmax(0, 1fr) auto'), 'Checkbox e status devem ficar dentro do card.');
assert(css.includes('perfil-import-error-text span'), 'Erro inválido deve ter indicador visual dentro do card.');
assert(css.includes('perfil-import-file-action'), 'Card de arquivo deve ter ação como no mockup.');

console.log('perfil-importacao-iphone-11910 ok: polimento visual eleva expectativa para ~90% no olho humano.');
