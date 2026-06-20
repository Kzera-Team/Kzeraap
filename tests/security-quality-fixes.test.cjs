const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const session = fs.readFileSync('src/runtime/SessionContext.ts', 'utf8');
const manager = fs.readFileSync('src/runtime/AccessCoordinator.ts', 'utf8');
const factory = fs.readFileSync('src/app/createFoundationSecurity.ts', 'utf8');
const docs = fs.readFileSync('docs/SECURITY_QUALITY_FIXES_1.1.1.md', 'utf8');

assert(session.includes("import type { Clock }"), 'SessionContext precisa usar Clock.');
assert(session.includes('new SystemClock()'), 'SessionContext precisa ter clock padrão injetável.');
assert(!session.includes('Date.now()'), 'SessionContext não pode usar Date.now() direto.');
assert(session.includes('DomainError'), 'SessionContext precisa usar DomainError.');
assert(session.includes('SessionLockedError'), 'SessionContext precisa erro específico para senha.');
assert(session.includes('SessionFaceIdRequiredError'), 'SessionContext precisa erro específico para Face ID.');
assert(session.includes('const currentState = this.state(now);'), 'requiresContext/currentMaterial devem evitar chamadas repetidas desnecessárias.');
assert(manager.includes('implements Releasable'), 'AccessCoordinator precisa implementar Releasable.');
assert(manager.includes('release(): void'), 'AccessCoordinator precisa expor release.');
assert(factory.includes('resourceScope.register(session)'), 'Session precisa ser registrada no ResourceScope.');
assert(factory.includes('resourceScope.register(accessCoordinator)'), 'AccessCoordinator precisa ser registrado no ResourceScope.');
assert(docs.includes('Ajustes de Qualidade de Segurança'), 'Docs da correção obrigatórios.');

console.log('security-quality-fixes.test.cjs OK');
