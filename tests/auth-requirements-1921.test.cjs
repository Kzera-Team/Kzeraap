const fs=require('fs');
function assert(c,m){if(!c)throw new Error(m)}
const gateway=fs.readFileSync('src/infrastructure/auth/BrowserFaceIdGateway.ts','utf8');
const reset=fs.readFileSync('src/application/auth/ResetarAcessoLocalUseCase.ts','utf8');
const runtime=fs.readFileSync('src/runtime/RuntimeMetadata.ts','utf8');
const store=fs.readFileSync('src/infrastructure/storage/RuntimeMetadataKeyValueStore.ts','utf8');
const app=fs.readFileSync('src/app/createKzeraAuthenticatedApp.ts','utf8');

assert(gateway.includes('navigator.credentials.create'), 'Face ID/WebAuthn deve registrar credencial local');
assert(gateway.includes('allowCredentials'), 'Face ID/WebAuthn deve reutilizar credencial registrada');
assert(reset.includes('RESETAR'), 'Recuperação local deve exigir confirmação explícita');
assert(runtime.includes('clear(): Promise<void>'), 'RuntimeMetadataStore deve suportar reset');
assert(store.includes('this.store.remove'), 'Store persistente deve limpar metadados');
assert(!app.includes('reset-access-form') && !app.includes('Esqueci'), 'UI não deve expor esqueci senha/reset local');
assert(!app.includes('change-credential-form'), 'UI não deve manter alteração de senha');
assert(app.includes('attention-form'), 'UI deve manter timeout visual');
console.log('auth-requirements-1921.test.cjs OK');
