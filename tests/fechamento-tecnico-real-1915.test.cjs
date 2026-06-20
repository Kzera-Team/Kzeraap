const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const perfilList = fs.readFileSync('src/presentation/perfil/binders/PerfilListBinder.ts', 'utf8');
const perfilTimeline = fs.readFileSync('src/presentation/perfil/renderers/PerfilTimelineRenderer.ts', 'utf8');
const itemList = fs.readFileSync('src/presentation/item/binders/ItemListBinder.ts', 'utf8');
const feedback = fs.readFileSync('src/presentation/shared/ui/FeedbackBinder.ts', 'utf8');
const perfilExport = fs.readFileSync('src/application/perfil/ExportarPerfisUseCase.ts', 'utf8');
const itemExport = fs.readFileSync('src/application/item/ExportarCatalogoItensUseCase.ts', 'utf8');
const perfilApp = fs.readFileSync('src/app/createPerfilUiApp.ts', 'utf8');
const itemApp = fs.readFileSync('src/app/createItemCatalogoUiApp.ts', 'utf8');
const css = fs.readFileSync('public/styles.css', 'utf8');

assert(perfilList.includes('emptyState('), 'PerfilListBinder deve usar EmptyState compartilhado.');
assert(perfilTimeline.includes('emptyState('), 'PerfilTimelineRenderer deve usar EmptyState compartilhado.');
assert(itemList.includes('emptyState('), 'ItemListBinder deve usar EmptyState compartilhado.');
assert(feedback.includes('toast-success') && feedback.includes('toast-error'), 'FeedbackBinder deve aplicar Toast compartilhado.');
assert(perfilExport.includes('releaseObject(linhas)'), 'Exportação de perfis deve limpar linhas temporárias.');
assert(!itemExport.includes('releaseObject(items)'), 'Exportação de itens não deve mutar coleção do repositório.');
assert(perfilApp.includes('releaseTransferPayload(csv)'), 'UI de perfis deve liberar payload de exportação.');
assert(itemApp.includes('releaseTransferPayload(preview)'), 'UI de itens deve liberar preview pós-importação.');
assert(css.includes('Shared UI Design System 1.9.15'), 'CSS público deve incluir design system compartilhado.');

console.log('fechamento-tecnico-real-1915.test.cjs OK');
