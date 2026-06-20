const fs=require('fs');
function assert(c,m){if(!c)throw new Error(m)}
const ac=fs.readFileSync('src/runtime/AccessCoordinator.ts','utf8');
const usecase=fs.readFileSync('src/application/auth/AlterarCredencialUseCase.ts','utf8');
const app=fs.readFileSync('src/app/createKzeraAuthenticatedApp.ts','utf8');
const webauthn=fs.readFileSync('src/infrastructure/auth/BrowserFaceIdGateway.ts','utf8');
assert(ac.includes('rotateMasterPassword'), 'AccessCoordinator deve trocar credencial');
assert(usecase.includes('AlterarCredencialUseCase'), 'UseCase de alteração deve existir');
assert(!app.includes('change-credential-form'), 'UI não deve ter alteração de senha');
assert(app.includes('attention-form'), 'UI deve ter tela de timeout/atenção');
assert(app.includes('ConfirmarFaceIdUseCase'), 'UI deve conectar revalidação de atenção');
assert(webauthn.includes('PublicKeyCredential'), 'Gateway deve tentar WebAuthn');
console.log('auth-complete-1920.test.cjs OK');
