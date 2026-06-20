const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const secureUi = fs.readFileSync('src/app/createSecurePerfilUiApp.ts', 'utf8');
const docs = fs.readFileSync('docs/SECURITY_SESSION_FIXES_1.8.7.md', 'utf8');

assert(secureUi.includes('SessionActivityController'), 'UI segura precisa usar SessionActivityController.');
assert(secureUi.includes('activity.bind(document)'), 'UI segura precisa ligar eventos no document.');
assert(secureUi.includes('activity.evaluate()'), 'UI segura precisa avaliar inatividade.');
assert(secureUi.includes('resourceScope.releaseAll()'), 'Unmount precisa limpar memória.');
assert(docs.includes('Inatividade na UI'), 'Docs precisam explicar hook de inatividade na UI.');

console.log('security-ui-inactivity-hook.test.cjs OK');
