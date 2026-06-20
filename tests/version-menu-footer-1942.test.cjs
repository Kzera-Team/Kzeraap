const assert = require('assert');
const fs = require('fs');
const app = fs.readFileSync('src/app/createKzeraAuthenticatedApp.ts', 'utf8');
assert(app.includes('kzera-drawer-footer'), 'Versão deve ficar no rodapé do menu lateral.');
assert(app.includes('data-testid="menu-app-version"'), 'Menu deve manter versão com test id próprio.');
assert(!app.includes('<span>${escapeHtml(APP_VERSION_LABEL)}</span></div></div>'), 'Início não deve exibir versão no topo.');
assert(app.includes('<div class="kzera-home-brand"><div><strong>Hoje no app</strong></div></div>'), 'Topo do início deve mostrar linguagem humana sem repetir o nome público do sistema.');
console.log('version-menu-footer-1942.test.cjs OK');
