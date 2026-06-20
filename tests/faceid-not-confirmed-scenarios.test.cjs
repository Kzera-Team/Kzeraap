const fs = require('fs');
function assert(condition, message) { if (!condition) throw new Error(message); }
const app = fs.readFileSync('src/app/createKzeraAuthenticatedApp.ts', 'utf8');
const gateway = fs.readFileSync('src/infrastructure/auth/BrowserFaceIdGateway.ts', 'utf8');
const usecase = fs.readFileSync('src/application/auth/ConfirmarFaceIdUseCase.ts', 'utf8');

assert(!app.includes('Confirmar presença'), 'Tela de Face ID não pode usar texto de presença. Use acesso/autenticação.');
assert(app.includes('Confirme que é você'), 'Tela de Face ID deve usar chamada humana de acesso.');
assert(!app.includes('Acesso protegido'), 'Auth shell não deve reaproveitar subtítulo genérico de sessão protegida.');
assert(gateway.includes('getLastFailureReason'), 'Gateway deve expor motivo seguro para falhas de Face ID.');
assert(gateway.includes('Face ID não disponível'), 'Cenário sem WebAuthn/suporte precisa de mensagem própria.');
assert(gateway.includes('Face ID ainda não foi configurado'), 'Cenário sem passkey salva precisa de mensagem própria.');
assert(gateway.includes('NotAllowedError'), 'Cancelamento/timeout/negação do usuário precisa ser tratado.');
assert(gateway.includes('SecurityError'), 'Bloqueio por origem/HTTPS precisa ser tratado.');
assert(gateway.includes('AbortError'), 'Interrupção precisa ser tratada.');
assert(usecase.includes('getLastFailureReason'), 'UseCase deve mostrar mensagem específica do gateway.');
console.log('faceid-not-confirmed-scenarios.test.cjs OK');
