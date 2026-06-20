const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const authRules = fs.readFileSync('src/domain/auth/AuthRules.ts', 'utf8');
const firstAccess = fs.readFileSync('src/application/auth/PrimeiroAcessoUseCase.ts', 'utf8');
const login = fs.readFileSync('src/application/auth/LoginUseCase.ts', 'utf8');
const faceId = fs.readFileSync('src/application/auth/ConfirmarFaceIdUseCase.ts', 'utf8');
const lock = fs.readFileSync('src/application/auth/BloquearSessaoUseCase.ts', 'utf8');
const state = fs.readFileSync('src/application/auth/ObterAuthStateUseCase.ts', 'utf8');
const backupGate = fs.readFileSync('src/application/backup/BackupGateUseCase.ts', 'utf8');
const controller = fs.readFileSync('src/presentation/auth/AuthFlowController.ts', 'utf8');
const docs = fs.readFileSync('docs/AUTH_FLOW_1.0.3.md', 'utf8');

assert(authRules.includes('minLength: 1'), 'Nesta versão de teste, senha mínima deve aceitar qualquer tamanho não vazio.');
assert(authRules.includes('productionMinLengthTodo: 14'), 'TODO de produção para 14 caracteres obrigatório.');
assert(firstAccess.includes('createMasterPassword'), 'Primeiro acesso deve criar credencial.');
assert(login.includes('accessCoordinator.open'), 'Login deve abrir sessão via AccessCoordinator.');
assert(faceId.includes('FaceIdGateway'), 'Face ID precisa depender de gateway.');
assert(faceId.includes('confirmAttention'), 'Use case de Face ID precisa confirmar sessão.');
assert(lock.includes('resourceScope.releaseAll'), 'Bloqueio precisa limpar memória.');
assert(state.includes('not_initialized'), 'Auth state precisa detectar primeiro acesso.');
assert(backupGate.includes('maxPostponesPerWindow'), 'Backup gate precisa respeitar adiamento único.');
assert(controller.includes('showFirstAccess'), 'Controller precisa rotear primeiro acesso.');
assert(docs.includes('Fluxos de Primeiro Acesso'), 'Documento de fluxo auth obrigatório.');

console.log('auth-flow.test.cjs OK');
