const assert = require('node:assert/strict');
const fs = require('node:fs');

const app = fs.readFileSync('src/app/createKzeraAuthenticatedApp.ts', 'utf8');
const css = fs.readFileSync('public/styles.css', 'utf8');

assert(app.includes('<strong>Hoje no app</strong>'), 'Home deve mostrar linguagem humana sem repetir o nome público do sistema.');
assert(css.includes('1.9.48 dashboard operacional'), 'CSS do dashboard operacional deve existir.');
assert(css.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'), 'Cards principais devem voltar ao board em duas colunas no mobile.');
assert(!app.includes('kzera-home-summary'), 'Dashboard não deve repetir resumo redundante de Perfis/Itens.');
console.log('dashboard recovery 1.9.48 ok');
