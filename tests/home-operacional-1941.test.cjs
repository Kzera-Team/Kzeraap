const fs=require('fs');
function read(f){return fs.readFileSync(f,'utf8')}
function assert(c,m){if(!c)throw new Error(m)}
const app=read('src/app/createKzeraAuthenticatedApp.ts');
const css=read('public/styles.css');
assert(app.includes('kzera-home-shell'), 'Início deve ter shell próprio e compacto.');
assert(app.includes('kzera-home-primary'), 'Início deve priorizar ações principais, não vitrine de módulos.');
assert(app.includes('home-action-card'), 'Início deve ter cards compactos com função e número real.');
assert(app.includes('data-nav="perfis"') && app.includes('data-nav="itens"'), 'Início deve dar acesso direto a Perfis e Itens.');
assert(app.includes('kzera-home-more') && app.indexOf('data-nav="importacao"') > app.indexOf('kzera-home-more'), 'Importação deve ficar escondida em Mais, não exposta como ação principal.');
assert(app.includes('data-nav="codigo"') && app.indexOf('data-nav="codigo"') > app.indexOf('kzera-home-more'), 'Código do Perfil deve ficar em Mais, não exposto como ação principal.');
assert(!app.includes('compact-home-header'), 'Início não deve usar cabeçalho antigo decorativo.');
assert(css.includes('1.9.41 home: início operacional'), 'CSS deve registrar revisão operacional do Início.');
console.log('home-operacional-1941.test.cjs OK');
