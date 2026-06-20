const fs=require('fs');
function assert(c,m){if(!c)throw new Error(m)}
const gateway=fs.readFileSync('src/infrastructure/auth/BrowserFaceIdGateway.ts','utf8');
const app=fs.readFileSync('src/app/createKzeraAuthenticatedApp.ts','utf8');
const usecase=fs.readFileSync('src/application/auth/ConfirmarFaceIdUseCase.ts','utf8');

assert(gateway.includes('isSupported()'), 'Gateway deve expor suporte a WebAuthn/Face ID');
assert(gateway.includes('isConfigured()'), 'Gateway deve expor passkey configurada');
assert(gateway.includes('configure()'), 'Gateway deve configurar passkey automaticamente');
assert(gateway.includes('navigator.credentials.create'), 'Configuração deve registrar passkey');
assert(gateway.includes('navigator.credentials.get'), 'Autenticação deve usar passkey');
assert(app.includes('configureFaceIdAutomatically'), 'App deve configurar Face ID automaticamente');
assert(app.includes('await configureFaceIdAutomatically()'), 'Configuração inicial deve chamar Face ID automaticamente');
assert(app.includes('confirmAttentionAutomatically'), 'App deve solicitar Face ID automaticamente em atenção');
assert(app.includes('Vou tentar o Face ID automaticamente'), 'UI deve explicar solicitação automática sem assustar.');
assert(!usecase.includes('Kzera'), 'UseCase não pode manter nome antigo');
console.log('faceid-auto-1926.test.cjs OK');
