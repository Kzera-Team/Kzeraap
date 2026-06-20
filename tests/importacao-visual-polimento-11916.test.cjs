const fs = require('fs');
const assert = require('assert');

const css = fs.readFileSync('public/styles.css', 'utf8');
const tabs = fs.readFileSync('src/presentation/importacao/components/ImportacaoTabs.ts', 'utf8');
const perfil = fs.readFileSync('src/presentation/perfil/PerfilDomView.ts', 'utf8');
const binder = fs.readFileSync('src/presentation/perfil/binders/PerfilImportacaoBinder.ts', 'utf8');
const transacoes = fs.readFileSync('src/presentation/importacao/ImportacaoTransacoesFinanceiroView.ts', 'utf8');

assert(tabs.includes("label: 'Transações'"), 'A aba deve exibir Transações, sem /Financeiro.');
assert(!tabs.includes('Transações/Financeiro'), 'A aba não pode cortar Transações/Financeiro.');
assert(tabs.includes('importTabs import-tabs'), 'Abas devem usar componente compartilhado com classe visual.');

assert(perfil.includes('importPanel import-panel'), 'Painel de perfis deve usar classe compartilhada import-panel.');
assert(transacoes.includes('importPanel import-panel'), 'Painel de transações deve usar classe compartilhada import-panel.');
assert(perfil.includes('fileCard file-card'), 'Card de arquivo deve usar classe visual file-card.');
assert(binder.includes('profile-card'), 'Cards de perfil devem usar classe visual profile-card.');
assert(binder.includes('profile-footer'), 'Rodapé do card deve usar profile-footer.');
assert(binder.includes('valid-badge'), 'Status deve usar badge visual.');
assert(binder.includes('input-like'), 'Campos devem usar input-like.');

assert(css.includes('width: calc(100vw - 28px)'), 'Painel deve ocupar largura útil solicitada.');
assert(css.includes('grid-template-columns: 1fr 1fr 1.25fr'), 'Menu deve ter grid solicitado.');
assert(css.includes('grid-template-columns: 64px minmax(0, 1fr) auto'), 'Card de arquivo deve ter grid solicitado.');
assert(css.includes('grid-template-columns: auto minmax(0, 1fr) auto'), 'Rodapé deve evitar aperto entre checkbox, texto e badge.');
assert(css.includes('min-width: 92px'), 'Badge válido precisa ter largura mínima.');
assert(css.includes('#DDF8E7') && css.includes('#087A36'), 'Badge válido deve usar cores suaves solicitadas.');

console.log('importacao-visual-polimento-11916 ok');
