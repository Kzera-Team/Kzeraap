const fs=require('fs');
function assert(c,m){if(!c)throw new Error(m)}
const app=fs.readFileSync('src/app/createKzeraAuthenticatedApp.ts','utf8');
const css=fs.readFileSync('public/styles.css','utf8');
const perfil=fs.readFileSync('src/presentation/perfil/templates/PerfilTemplate.ts','utf8');
const item=fs.readFileSync('src/presentation/item/templates/ItemCatalogoTemplate.ts','utf8');

assert(app.includes('kzera-mobile-shell'), 'Dashboard real deve usar shell visual Kzera');
assert(app.includes('data-nav="perfis"') && app.includes('data-nav="itens"'), 'Dashboard deve navegar para módulos reais');
assert(app.includes('data-toggle-password'), 'Campos de senha devem ter olho para visualizar');
assert(app.includes('codigo-perfil-config'), 'Configuração de Código do Perfil deve existir');
assert(!app.includes('Esqueci') && !app.includes('reset-access'), 'Login não deve exibir esqueci senha/reset');
assert(!app.includes('Confirmar credencial') && !app.includes('Credencial inválida') && !app.includes('Informe sua credencial'), 'UI de autenticação não deve usar palavra credencial');
assert(css.includes('Kzera premium UX 1.9.23'), 'CSS premium deve estar aplicado');
assert(perfil.includes('Perfis'), 'Tela de perfis deve estar renomeada');
assert(item.includes('Itens'), 'Tela de itens deve estar renomeada');
console.log('ux-real-1923.test.cjs OK');
