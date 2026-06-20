const fs = require('fs');
const path = require('path');

const root = process.cwd();
const termos = [new RegExp('ven' + 'da', 'i'), new RegExp('fia' + 'do', 'i')];
const ignorarDirs = new Set(['node_modules', 'dist', '.git']);
const extensoes = new Set(['.ts', '.js', '.cjs', '.json', '.md', '.html', '.css']);
const falhas = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignorarDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (extensoes.has(path.extname(entry.name))) {
      const rel = path.relative(root, full);
      for (const termo of termos) {
        if (termo.test(rel)) falhas.push(`${rel} (nome do arquivo)`);
      }
      const text = fs.readFileSync(full, 'utf8');
      for (const termo of termos) {
        if (termo.test(text)) falhas.push(rel);
      }
    }
  }
}
walk(root);
if (falhas.length) {
  throw new Error(`Vocabulário antigo encontrado em: ${[...new Set(falhas)].slice(0, 30).join(', ')}`);
}
console.log('nomenclatura-transação-1153.test.cjs OK');
