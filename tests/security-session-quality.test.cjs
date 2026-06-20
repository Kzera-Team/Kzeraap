const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const session = fs.readFileSync('src/runtime/SessionContext.ts', 'utf8');
const manager = fs.readFileSync('src/runtime/AccessCoordinator.ts', 'utf8');
const foundation = fs.readFileSync('src/app/createFoundationSecurity.ts', 'utf8');
const faceId = fs.readFileSync('src/application/auth/ConfirmarFaceIdUseCase.ts', 'utf8');

assert(session.includes("import type { Clock }"), 'SessionContext precisa injetar Clock.');
assert(session.includes('private readonly clock: Clock'), 'SessionContext precisa receber Clock no construtor.');
assert(!session.includes('Date.now()'), 'SessionContext não deve usar Date.now() hardcoded.');
assert(session.includes('const state = this.state(now);'), 'requiresContext deve calcular state uma vez.');
assert(session.includes('DomainError'), 'SessionContext deve lançar DomainError.');
assert(manager.includes('implements Releasable'), 'AccessCoordinator precisa ser Releasable.');
assert(manager.includes('InvalidMasterPasswordError extends DomainError'), 'Senha inválida deve usar DomainError.');
assert(foundation.includes('resourceScope.register(session)'), 'ResourceScope precisa registrar session.');
assert(foundation.includes('resourceScope.register(accessCoordinator)'), 'ResourceScope precisa registrar AccessCoordinator.');
assert(faceId.includes('DomainError'), 'Face ID deve usar DomainError.');

console.log('security-session-quality.test.cjs OK');
