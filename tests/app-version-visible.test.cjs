const fs = require('fs');
function assert(condition, message) { if (!condition) throw new Error(message); }
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const app = fs.readFileSync('src/app/createKzeraAuthenticatedApp.ts', 'utf8');
const version = fs.readFileSync('src/app/appVersion.ts', 'utf8');
assert(pkg.version === '1.19.7', 'package.json deve estar na versão atual.');
assert(version.includes('pkg.version'), 'APP_VERSION deve vir do package.json.');
assert(app.includes('APP_VERSION_LABEL'), 'A UI deve usar a constante de versão.');
assert(app.includes('data-testid="app-version"'), 'Login/cadastro de senha devem exibir versão no authShell.');
assert(app.includes('data-testid="menu-app-version"'), 'Menu lateral deve exibir a versão.');
assert(app.includes('data-testid="setup-form"'), 'Tela de cadastro de senha deve continuar existente.');
assert(app.includes('data-testid="login-form"'), 'Tela de login deve continuar existente.');
console.log('app-version-visible.test.cjs OK');
