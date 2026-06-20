const assert = require('node:assert');
const fs = require('node:fs');

const binder = fs.readFileSync('src/presentation/perfil/binders/PerfilImportacaoBinder.ts', 'utf8');
const view = fs.readFileSync('src/presentation/perfil/PerfilDomView.ts', 'utf8');
const css = fs.readFileSync('public/styles.css', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

assert.strictEqual(pkg.version, '1.19.11', 'Versão deve ser 1.19.11.');
assert(view.includes('perfil-import-hero'), 'Tela deve ter header premium da importação.');
assert(view.includes('perfil-import-file-card') && view.includes('data-file-name') && view.includes('perfil-import-file-action'), 'Tela deve ter card de arquivo parecido com o desenho.');
assert(view.includes('perfil-import-preview-head'), 'Tela deve ter seção de pré-visualização.');
assert(binder.includes('Conhece Pessoalmente'), 'Checkbox deve exibir Conhece Pessoalmente.');
assert(!binder.includes('Ao vivo'), 'Importação não deve exibir Ao vivo.');
assert(binder.includes('Válido') && binder.includes('Inválido'), 'Badges Válido/Inválido devem existir.');
assert(!binder.includes('data-preview-field="cidade"'), 'Município/cidade não deve aparecer no preview.');
assert(binder.includes('Corrija os inválidos'), 'Botão deve bloquear inválidos.');
assert(binder.includes('Importe um arquivo primeiro'), 'Botão deve bloquear sem arquivo.');
assert(css.includes('max-width: 430px'), 'Tela deve ser iPhone-first.');
assert(css.includes('background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)'), 'Fundo deve ficar próximo ao desenho.');
assert(css.includes('border-radius: 22px') && css.includes('box-shadow: 0 12px 28px'), 'Cards devem ter aparência premium.');
assert(css.includes('grid-template-columns: minmax(0, 1fr) auto'), 'Checkbox e status devem ficar no mesmo footer interno.');
assert(css.includes('overflow: hidden') && css.includes('text-overflow: ellipsis'), 'Label comprida não pode sair do card no iPhone.');
assert(css.includes('@media (max-width: 389px)'), 'Deve ter ajuste para iPhone menor.');
assert(css.includes('.perfil-import-status.status-ok') && css.includes('.perfil-import-status.status-error'), 'Status deve ser visível e colorido.');
assert(css.includes('.perfil-import-primary-button'), 'Botão final deve ter estilo próprio.');

console.log('perfil-importacao-iphone-1199 ok: Senhora Cansada deve bater o olho e reconhecer a mesma tela do desenho.');
