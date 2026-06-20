const fs = require('fs');
const path = require('path');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const root = process.cwd();
const netlifyPath = path.join(root, 'netlify.toml');
const vitePath = path.join(root, 'vite.config.ts');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

assert(fs.existsSync(netlifyPath), 'netlify.toml deve existir na raiz.');
assert(fs.existsSync(vitePath), 'vite.config.ts deve existir na raiz.');

const netlifyToml = fs.readFileSync(netlifyPath, 'utf8');
const viteConfig = fs.readFileSync(vitePath, 'utf8');

assert(netlifyToml.includes('command = "npm run check && npm run build"'), 'deploy deve validar check antes do build.');
assert(netlifyToml.includes('publish = "dist"'), 'publish directory deve ser dist.');
assert(netlifyToml.includes('NODE_VERSION = "20"'), 'Node 20 deve estar fixado para deploy.');
assert(netlifyToml.includes('to = "/index.html"'), 'PWA deve redirecionar rotas para index.html.');
assert(netlifyToml.includes('Content-Security-Policy'), 'headers de segurança devem incluir CSP.');
assert(viteConfig.includes("root: 'public'"), 'Vite deve usar public como raiz do HTML público.');
assert(viteConfig.includes("outDir: '../dist'"), 'Vite deve gerar dist na raiz do projeto.');
assert(packageJson.scripts.build === 'vite build', 'script build deve usar Vite.');
assert(packageJson.scripts.dev?.startsWith('vite'), 'script dev deve usar Vite.');
assert(packageJson.scripts.preview?.startsWith('vite preview'), 'script preview deve usar Vite preview.');
assert(packageJson.devDependencies?.vite, 'vite deve estar em devDependencies.');

const publicName = 've' + 'velt';
const internalName = 'kzera';
const forbiddenDns = new RegExp(`(https?:\\/\\/\\S*(${internalName}|${publicName})|(?:${internalName}|${publicName})\\.[a-z]{2,}(?:[:/]|$))`, 'i');
for (const file of ['netlify.toml', 'vite.config.ts', 'docs/DEPLOY_NETLIFY.md']) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  assert(!forbiddenDns.test(text), `${file} não pode conter DNS/URL com nomes proibidos.`);
}

console.log('netlify-deploy.test.cjs OK');
