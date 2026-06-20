const fs = require('fs');
const path = require('path');
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => { const full = path.join(dir, entry.name); return entry.isDirectory() ? walk(full) : [full]; }); }
function assert(cond, msg) { if (!cond) throw new Error(msg); }
const files = walk('src').filter(file => /\.(ts|tsx|js|cjs|html)$/.test(file));
const forbidden = ['Cliente', 'Clientes', 'Produto', 'Produtos', 'Código do cliente', 'codigo-cliente'];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  for (const term of forbidden) assert(!text.includes(term), `${file} ainda contém nomenclatura antiga: ${term}`);
}
console.log('nomenclatura-neutra.test.cjs OK');
