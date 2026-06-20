const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const indexedDbConnection = fs.readFileSync('src/infrastructure/storage/IndexedDbConnection.ts', 'utf8');
const indexedDbRepository = fs.readFileSync('src/infrastructure/repositories/IndexedDbRepository.ts', 'utf8');
const keyValue = fs.readFileSync('src/infrastructure/storage/KeyValueStore.ts', 'utf8');
const securityStore = fs.readFileSync('src/infrastructure/storage/RuntimeMetadataKeyValueStore.ts', 'utf8');
const tableStore = fs.readFileSync('src/infrastructure/storage/TableMapKeyValueStore.ts', 'utf8');
const createPersistence = fs.readFileSync('src/app/createPersistence.ts', 'utf8');
const docs = fs.readFileSync('docs/PERSISTENCE_1.0.2.md', 'utf8');

assert(indexedDbConnection.includes('indexedDB.open'), 'IndexedDbConnection precisa abrir IndexedDB.');
assert(indexedDbRepository.includes('implements Repository<T>'), 'IndexedDbRepository precisa implementar Repository<T>.');
assert(keyValue.includes('interface KeyValueStore'), 'KeyValueStore obrigatório.');
assert(securityStore.includes('RuntimeMetadataStore'), 'RuntimeMetadata precisa ter store persistível.');
assert(tableStore.includes('TableMapStore'), 'TableMap precisa ter store persistível.');
assert(createPersistence.includes('TableObfuscator'), 'Persistência IndexedDB precisa usar TableObfuscator.');
assert(createPersistence.includes('PerfilRepository'), 'Perfil precisa continuar passando pelo repositório seguro.');
assert(docs.includes('Persistência Segura Base'), 'Documento de persistência obrigatório.');

console.log('persistence-foundation.test.cjs OK');
