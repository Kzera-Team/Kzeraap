const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const pkg = JSON.parse(read('package.json'));
const appVersion = read('src/app/appVersion.ts');
const app = read('src/app/createKzeraAuthenticatedApp.ts');
const itemApp = read('src/app/createItemCatalogoUiApp.ts');
const itemBinder = read('src/presentation/item/binders/ItemFormBinder.ts');
const perfilBinder = read('src/presentation/perfil/binders/PerfilFormBinder.ts');
const perfilTemplate = read('src/presentation/perfil/templates/PerfilTemplate.html');
const itemTemplate = read('src/presentation/item/templates/ItemCatalogoTemplate.ts');
const backupGate = read('src/application/backup/BackupGateUseCase.ts');
const doc = read('docs/AUDITORIA_CORRECOES_1.10.2.md');

assert.strictEqual(pkg.version, '1.19.5', 'Versão atual deve refletir cadastro de balanças 1.12.0.');
assert(appVersion.includes("APP_VERSION = '1.19.5'"), 'APP_VERSION deve estar em 1.12.0.');

assert(app.includes("createOperationalRepository<Perfil>('perfis')"), 'Perfis do app principal devem usar repositório operacional persistente.');
assert(app.includes("createOperationalRepository<ItemCatalogo>('itens')"), 'Itens do app principal devem usar repositório operacional persistente.');
assert(app.includes("new IndexedDbRepository<T>(connection, storeName)"), 'Repositório operacional deve usar IndexedDB quando disponível.');
assert(!app.includes('const perfis = new InMemoryRepository<Perfil>();'), 'Perfis não podem ficar em memória no app principal.');
assert(!app.includes('const itens = new InMemoryRepository<ItemCatalogo>();'), 'Itens não podem ficar em memória no app principal.');

assert(itemBinder.includes('loteData'), 'Binder do item deve ler a data do lote.');
assert(itemApp.includes('const dataLancamento = input.loteData'), 'Criação de item deve calcular dataLancamento a partir da data informada.');
assert(itemApp.includes('dataLancamento,'), 'Entrada inicial deve receber dataLancamento calculado, não now fixo.');

assert(backupGate.includes('pendingWindowAt'), 'Backup deve considerar janela pendente antiga.');
assert(backupGate.includes('status.completedWindowKey !== status.pendingWindowKey'), 'Backup pendente não concluído deve atravessar meia-noite.');

assert(app.includes('attention-password'), 'Tela de Face ID deve oferecer senha como fallback real.');
assert(app.includes('Entrar com senha'), 'Fallback de Face ID deve ser textual e claro.');

assert(app.includes('scheduleAttentionCheck();\n    }, 1_000);'), 'Checagem de ociosidade deve ser reagendada enquanto desbloqueado.');

assert(perfilBinder.includes('selectedOptionText'), 'Perfil deve salvar texto compreensível da região selecionada.');
assert(perfilTemplate.includes('Região operacional'), 'UI deve nomear corretamente o grupo de localidade como região operacional.');

assert(perfilTemplate.includes('⇩ Salvar lista'), 'Salvar lista de perfis deve ter ícone + texto.');
assert(itemTemplate.includes('⇩ Salvar lista'), 'Salvar lista de itens deve ter ícone + texto.');
assert(itemTemplate.includes('← Itens'), 'Voltar itens deve ter texto.');
assert(perfilTemplate.includes('← Perfis'), 'Voltar perfis deve ter texto.');

assert.strictEqual(pkg.scripts.test, pkg.scripts.check, 'npm test e npm run check devem rodar a mesma cobertura.');
assert(pkg.scripts.test.includes('backup-obrigatorio-1943.test.cjs'), 'npm test deve incluir backup obrigatório.');
assert(pkg.scripts.test.includes('npx tsc --noEmit'), 'npm test deve incluir TypeScript.');
assert(pkg.scripts.test.includes('audit-fixes-1102.test.cjs'), 'npm test deve incluir auditoria 1.10.2.');

assert(doc.includes('Usuária'), 'Documento 1.10.2 deve registrar o teste da Usuária.');
assert(doc.includes('IndexedDB'), 'Documento 1.10.2 deve registrar persistência IndexedDB.');

console.log('audit fixes 1.10.2 ok');
