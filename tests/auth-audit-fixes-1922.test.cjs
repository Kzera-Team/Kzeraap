const fs=require('fs');
function assert(c,m){if(!c)throw new Error(m)}
const rules=fs.readFileSync('src/domain/auth/AuthRules.ts','utf8');
const gateway=fs.readFileSync('src/infrastructure/auth/BrowserFaceIdGateway.ts','utf8');
const app=fs.readFileSync('src/app/createKzeraAuthenticatedApp.ts','utf8');
assert(rules.includes('minLength: 1'), 'credencial mínima deve estar relaxada para teste');
assert(!gateway.includes('globalThis.confirm(reason)'), 'Face ID não pode cair em confirm()');
assert(app.includes('listenersBound') || !app.includes("rootRef.addEventListener('pointerdown', touchSession, { passive: true });\n    rootRef.addEventListener('keydown', touchSession);"), 'listeners não devem duplicar a cada render');
console.log('auth-audit-fixes-1922.test.cjs OK');
