const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const badge = fs.readFileSync('src/presentation/shared/ui/Badge.ts', 'utf8');
const feedback = fs.readFileSync('src/presentation/shared/ui/FeedbackBinder.ts', 'utf8');
const perfilCard = fs.readFileSync('src/presentation/perfil/renderers/PerfilCardRenderer.ts', 'utf8');
const itemImport = fs.readFileSync('src/presentation/item/binders/ItemImportacaoBinder.ts', 'utf8');
const publicCss = fs.readFileSync('public/styles.css', 'utf8');
const indexCss = fs.readFileSync('src/presentation/shared/styles/index.css', 'utf8');

assert(badge.includes('BadgeTone'), 'Badge compartilhado precisa ter tons padronizados.');
assert(feedback.includes('toast-success') && feedback.includes('toast-error'), 'FeedbackBinder deve usar linguagem visual única.');
assert(perfilCard.includes('renderBadge('), 'PerfilCardRenderer deve usar Badge compartilhado.');
assert(itemImport.includes('badge(item.valido'), 'ItemImportacaoBinder deve usar Badge compartilhado.');
assert(indexCss.includes("@import './badge.css'"), 'Design System deve ter agregador fonte.');
assert(publicCss.includes('generated from src/presentation/shared/styles'), 'CSS público deve ser gerado a partir dos módulos compartilhados.');

console.log('feedback-designsystem-1916.test.cjs OK');
