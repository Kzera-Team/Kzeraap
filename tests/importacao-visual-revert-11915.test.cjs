const fs = require('fs');
const assert = require('assert');

const perfilView = fs.readFileSync('src/presentation/perfil/PerfilDomView.ts', 'utf8');
const transacoesView = fs.readFileSync('src/presentation/importacao/ImportacaoTransacoesFinanceiroView.ts', 'utf8');
const tabs = fs.readFileSync('src/presentation/importacao/components/ImportacaoTabs.ts', 'utf8');
const css = fs.readFileSync('public/styles.css', 'utf8');

assert(perfilView.includes("renderImportacaoTabs('perfis')"), 'Perfis deve usar tabs compartilhadas');
assert(transacoesView.includes("renderImportacaoTabs('transacoes')"), 'Transações deve usar tabs compartilhadas');
assert(tabs.includes('renderImportacaoTabs'), 'Tabs devem estar em componente compartilhado');
assert(!perfilView.includes('KZERA vevelt'), 'Logo não deve voltar no topo da importação');
assert(!perfilView.includes('Importar perfis</h1>'), 'Título redundante não deve voltar');
assert(css.includes('1.19.15 — correção'), 'CSS de correção 1.19.15 deve existir');
assert(css.includes('grid-template-columns: .86fr .74fr 1.40fr'), 'Abas devem manter proporção para caber no iPhone');
assert(css.includes('font-size: 13px !important;'), 'Label Conhece Pessoalmente deve caber sem cortar');
assert(css.includes('font-size: 13.5px !important;'), 'Telefone deve caber no campo no iPhone');
console.log('importacao-visual-revert-11915.test.cjs passou');
