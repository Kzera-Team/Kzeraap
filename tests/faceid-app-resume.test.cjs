const fs = require('fs');
function assert(condition, message) { if (!condition) throw new Error(message); }
const app = fs.readFileSync('src/app/createKzeraAuthenticatedApp.ts', 'utf8');
const session = fs.readFileSync('src/runtime/SessionContext.ts', 'utf8');
assert(session.includes('requireAttention('), 'SessionContext deve permitir forçar atenção sem fechar a sessão.');
assert(app.includes('bindAppLifecycle'), 'App deve registrar ciclo de vida do PWA.');
assert(app.includes('visibilitychange'), 'App deve ouvir visibilitychange para reabertura.');
assert(app.includes('pageshow'), 'App deve ouvir pageshow para retorno via bfcache/PWA.');
assert(app.includes('focus'), 'App deve ouvir focus como fallback de retorno.');
assert(app.includes("security.session.requireAttention()"), 'Reabertura deve forçar Face ID quando a sessão ainda estiver em memória.');
assert(app.includes("state !== 'unlocked'"), 'Face ID automático de retomada só deve ocorrer quando sessão estiver desbloqueada em memória.');
console.log('faceid-app-resume.test.cjs OK');
