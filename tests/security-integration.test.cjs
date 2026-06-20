const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const accessCoordinator = fs.readFileSync('src/runtime/AccessCoordinator.ts', 'utf8');
const runtimeState = fs.readFileSync('src/runtime/RuntimeMetadata.ts', 'utf8');
const session = fs.readFileSync('src/runtime/SessionContext.ts', 'utf8');
const secureRepo = fs.readFileSync('src/infrastructure/repositories/PerfilRepository.ts', 'utf8');
const tableObfuscator = fs.readFileSync('src/infrastructure/storage/TableObfuscator.ts', 'utf8');
const factory = fs.readFileSync('src/app/createFoundationSecurity.ts', 'utf8');
const docs = fs.readFileSync('docs/SECURITY_INTEGRATION_1.0.1.md', 'utf8');

assert(accessCoordinator.includes('randomSalt'), 'AccessCoordinator precisa gerar salt internamente.');
assert(accessCoordinator.includes('RuntimeMetadataStore'), 'AccessCoordinator precisa persistir metadados.');
assert(accessCoordinator.includes('InvalidMasterPasswordError'), 'Senha inválida precisa ter erro próprio.');
assert(runtimeState.includes('salt: number[]'), 'RuntimeMetadata precisa armazenar salt.');
assert(session.includes('confirmAttention'), 'SessionContext precisa suportar revalidação de atenção.');
assert(session.includes('implements Releasable'), 'SessionContext precisa ser limpável pelo ResourceScope.');
assert(secureRepo.includes('SessionContext'), 'PerfilRepository precisa depender da sessão.');
assert(!secureRepo.includes("application/ports/PayloadCodec"), 'PerfilRepository não deve receber PayloadCodec solto.');
assert(tableObfuscator.includes('saveEncryptedMap'), 'TableObfuscator precisa persistir mapa criptografado.');
assert(tableObfuscator.includes('loadEncryptedMap'), 'TableObfuscator precisa carregar mapa criptografado.');
assert(factory.includes('resourceScope.register(session)'), 'Factory precisa registrar sessão no ResourceScope.');
assert(docs.includes('Segurança Integrada'), 'Documento de integração de segurança obrigatório.');

console.log('security-integration.test.cjs OK');
