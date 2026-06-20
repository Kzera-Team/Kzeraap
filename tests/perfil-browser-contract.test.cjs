const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const html = fs.readFileSync('public/index.html', 'utf8');
const css = fs.readFileSync('public/styles.css', 'utf8');
const docs = fs.readFileSync('docs/PERFIS_UI_1.8.6.md', 'utf8');

assert(html.includes('<main id="app">'), 'HTML precisa ter root #app.');
assert(html.includes('viewport'), 'HTML precisa viewport para iPhone.');
assert(html.includes('browserMain.ts'), 'HTML precisa carregar browserMain.');
assert(css.includes('@media'), 'CSS precisa responsividade.');
assert(docs.includes('Tela navegável'), 'Docs precisam registrar tela navegável.');
assert(docs.includes('Exportação CSV sem nome real'), 'Docs precisam regra de exportação.');

console.log('perfil-browser-contract.test.cjs OK');
