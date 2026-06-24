const fs=require('fs');
function read(f){return fs.readFileSync(f,'utf8')}
function assert(c,m){if(!c)throw new Error(m)}
const perfil=read('src/presentation/perfil/templates/PerfilTemplate.html');
const item=read('src/presentation/item/templates/ItemCatalogoTemplate.ts');
const perfilCard=read('src/presentation/perfil/renderers/PerfilCardRenderer.ts');
const itemEdit=read('src/presentation/item/renderers/ItemEditCardRenderer.ts');
const app=read('src/app/createKzeraAuthenticatedApp.ts');
const css=read('public/styles.css');
assert(perfil.includes('operational-search-card') && !perfil.includes('kzera-card search-card'), 'Perfis deve usar busca operacional compacta, sem card grande de busca.');
assert(item.includes('operational-search-card') && !item.includes('kzera-card search-card'), 'Itens deve usar busca operacional compacta, sem card grande de busca.');
assert(perfil.indexOf('data-testid="perfil-lista"') < perfil.indexOf('data-testid="perfil-dashboard"'), 'Resumo de Perfis deve ficar depois da lista, não ocupando topo.');
assert(item.indexOf('data-testid="item-lista"') < item.indexOf('data-testid="item-dashboard"'), 'Resumo de Itens deve ficar depois da lista, não ocupando topo.');
assert(perfil.includes('data-perfil-view-tab="resumo"'), 'Resumo de Perfis deve ser acessível por aba.');
assert(item.includes('data-item-view-tab="resumo"'), 'Resumo de Itens deve ser acessível por aba.');
assert(perfilCard.includes('aria-label="Definir código"') && !perfilCard.includes('>Definir código<'), 'Ações frequentes de Perfil devem usar ícones com aria-label.');
assert(perfilCard.includes('aria-label="Arquivar perfil"') && !perfilCard.includes('>Arquivar<'), 'Arquivar Perfil deve ser ícone acessível.');
assert(item.includes('data-item-form-tab="variacoes" aria-label="Variações e estoque"') && !item.includes('data-item-form-tab="variacoes">Variações</button>'), 'Abas de Item devem usar ícones acessíveis quando inequívocas.');
assert(itemEdit.includes('item-lote-row') && itemEdit.includes('variation-stock-summary'), 'Lotes em edição devem ser linhas compactas com resumo de estoque.');
assert(app.includes('kzera-home-actions') && !app.includes('kzera-module-grid'), 'Home deve usar ações compactas, não cards grandes de módulo.');
assert(css.includes('1.9.40 global UX hardening'), 'CSS deve ter hardening global 1.9.40.');
console.log('global-ux-hardening-1940.test.cjs OK');
