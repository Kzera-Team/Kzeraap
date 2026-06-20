const fs=require('fs');
function assert(cond,msg){if(!cond)throw new Error(msg)}
const main=fs.readFileSync('src/app/browserMain.ts','utf8');
const auth=fs.readFileSync('src/app/createKzeraAuthenticatedApp.ts','utf8');
const css=fs.readFileSync('public/styles.css','utf8');
assert(main.includes('createKzeraAuthenticatedApp'), 'entrada deve carregar app autenticado');
assert(auth.includes('setup-form'), 'primeiro acesso deve renderizar tela de configuração');
assert(auth.includes('login-form'), 'login deve renderizar tela de entrada');
assert(auth.includes('logout-button'), 'app deve permitir sair');
assert(auth.includes('PrimeiroAcessoUseCase') && auth.includes('LoginUseCase'), 'UI deve conectar use cases reais');
assert(css.includes('auth-shell') && css.includes('auth-card'), 'CSS deve conter layout de autenticação');
console.log('auth-ui-visible-1919.test.cjs OK');
