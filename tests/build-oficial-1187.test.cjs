const fs = require('fs');
function assert(cond, msg) { if (!cond) throw new Error(msg); }
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
const lock = fs.readFileSync('package-lock.json','utf8');
const perfilGateway = fs.readFileSync('src/infrastructure/importacao/PerfilSpreadsheetImportGateway.ts','utf8');
const itemGateway = fs.readFileSync('src/infrastructure/importacao/ItemSpreadsheetImportGateway.ts','utf8');
const checklist = fs.readFileSync('docs/governanca/06_CHECKLIST_ENTREGA_OBRIGATORIO.md','utf8');

assert(pkg.version === '1.19.5', 'package precisa estar em 1.19.3');
assert(!pkg.dependencies || !pkg.dependencies.xlsx, 'xlsx não pode ser dependência direta');
assert(!lock.includes('node_modules/xlsx'), 'package-lock não pode incluir xlsx');
assert(!lock.includes('node_modules/codepage'), 'package-lock não pode incluir codepage');
assert(!perfilGateway.includes("from 'xlsx'") && !itemGateway.includes("from 'xlsx'"), 'gateways não podem importar xlsx');
assert(checklist.includes('npm ci') && checklist.includes('npm run build'), 'checklist deve exigir build oficial');
console.log('build-oficial-1187.test.cjs OK');
