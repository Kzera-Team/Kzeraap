const fs=require('fs');
function assert(c,m){if(!c)throw new Error(m)}
const app=fs.readFileSync('src/app/createKzeraAuthenticatedApp.ts','utf8');
const perfilApp=fs.readFileSync('src/app/createPerfilUiApp.ts','utf8');
const css=fs.readFileSync('public/styles.css','utf8');

assert(app.includes('codigo-perfil-config'), 'Após senha deve existir tela de configuração do Código do Perfil');
assert(app.includes("currentScreen = 'codigo'"), 'Primeiro acesso deve direcionar para configuração do código');
assert(app.includes('CODE_RULE_STORAGE_KEY'), 'Configuração do código deve ser persistida');
assert(app.includes('readDraftRuleFromDom') && app.includes('validateIdentityRule') && app.includes('previewIdentityRule'), 'Tela deve gerar e validar regra real de identidade por blocos');
assert(perfilApp.includes('getIdentityRule') && perfilApp.includes('module.definirCodigo.execute(perfilId, getIdentityRule())'), 'Perfis devem usar regra configurada para gerar código');
assert(!app.includes('Alterar senha') && !app.includes('change-credential-form'), 'Alteração de senha não deve estar na UI');
assert(!app.includes('Esqueci') && !app.toLowerCase().includes('recuperar'), 'Esqueci/recuperar senha não deve existir na UI');
assert(app.includes('data-toggle-password'), 'Criação e login devem ter olho de senha');
assert(css.includes('Code rule setup 1.9.24'), 'CSS da configuração do código deve existir');
console.log('codigo-perfil-primeiro-acesso-1924.test.cjs OK');
