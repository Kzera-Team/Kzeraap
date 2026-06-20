const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist']);
const SKIP_EXT = new Set(['.zip', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico']);
const PUBLIC_APP_NAME = 'Ve' + 'velt';
const INTERNAL_APP_NAME = 'Kzera';
const PUBLIC_APP_PATTERN = new RegExp('ve' + 'velt', 'i');
const DNS_FORBIDDEN_PATTERN = new RegExp('https?:\\/\\/\\S*(kzera|' + 've' + 'velt)', 'i');
const BARE_NAME_PATTERN = new RegExp('(?:kzera|' + 've' + 'velt' + ')');

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (!SKIP_EXT.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

function rel(file) {
  return path.relative(ROOT, file).replaceAll(path.sep, '/');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const files = walk(ROOT);
const legacyHits = [];
const publicNameHits = [];
const dnsHits = [];

for (const file of files) {
  const relative = rel(file);
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    const location = `${relative}:${index + 1}`;

    if (new RegExp('cat' + 'lover', 'i').test(line)) legacyHits.push(`${location}: ${line.trim()}`);

    if (line.includes(PUBLIC_APP_NAME) || PUBLIC_APP_PATTERN.test(line)) {
      const allowedPublicHtml = relative === 'public/index.html'
        && (line.includes(`<title>${PUBLIC_APP_NAME}</title>`) || line.includes(`usar o ${PUBLIC_APP_NAME}`));
      const allowedPublicManifest = relative === 'public/static/manifest.webmanifest'
        && (line.includes(`"name": "${PUBLIC_APP_NAME}"`) || line.includes(`"short_name": "${PUBLIC_APP_NAME}"`));
      if (!allowedPublicHtml && !allowedPublicManifest) publicNameHits.push(`${location}: ${line.trim()}`);
    }

    const lower = line.toLowerCase();
    if (DNS_FORBIDDEN_PATTERN.test(line)) dnsHits.push(`${location}: ${line.trim()}`);

    for (const quoted of line.matchAll(/['"`]([^'"`]+)['"`]/g)) {
      const value = quoted[1].toLowerCase();
      const looksLikeBareDomain = BARE_NAME_PATTERN.test(value)
        && /\.[a-z]{2,}(?:[:/]|$)/.test(value)
        && !value.includes('/')
        && !value.endsWith('.ts')
        && !value.endsWith('.js')
        && !value.endsWith('.cjs')
        && !value.endsWith('.css')
        && !value.endsWith('.html');
      if (looksLikeBareDomain) dnsHits.push(`${location}: ${line.trim()}`);
    }
  });
}

assert(legacyHits.length === 0, `Nome legado anterior encontrado:\n${legacyHits.join('\n')}`);
assert(publicNameHits.length === 0, `Nome público ${PUBLIC_APP_NAME} fora da superfície pública permitida:\n${publicNameHits.join('\n')}`);
assert(dnsHits.length === 0, `DNS/URL não pode conter nomes internos/públicos do projeto:\n${dnsHits.join('\n')}`);
assert(fs.readFileSync('package.json', 'utf8').includes('"name": "kzera"'), 'package interno deve ser kzera.');
assert(fs.readFileSync('src/app/browserMain.ts', 'utf8').includes('createKzeraAuthenticatedApp'), 'bootstrap deve usar factory interna Kzera.');
assert(!fs.existsSync('src/app/create' + PUBLIC_APP_NAME + 'AuthenticatedApp.ts'), 'arquivo interno antigo com nome público não pode existir.');
assert(fs.readFileSync('public/index.html', 'utf8').includes(`<title>${PUBLIC_APP_NAME}</title>`), 'nome público precisa continuar visível ao usuário.');
assert(!fs.readFileSync('public/index.html', 'utf8').includes(INTERNAL_APP_NAME), 'nome interno não deve aparecer no HTML público.');

console.log('internal-naming-kzera.test.cjs OK');
