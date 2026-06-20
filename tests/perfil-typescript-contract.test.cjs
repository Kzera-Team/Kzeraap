const fs = require('fs');
function assert(cond, msg) { if (!cond) throw new Error(msg); }
const perfil = fs.readFileSync('src/domain/perfil/Perfil.ts','utf8');
const identity = fs.readFileSync('src/domain/identidade/IdentityRuleEngine.ts','utf8');
const sensitive = fs.readFileSync('src/runtime/PerfilPayloadFields.ts','utf8');
const docs = fs.readFileSync('docs/PERFIS_1.8.5_CADASTRO_CLIENTES.md','utf8');
assert(perfil.includes('PerfilStatus'), 'Perfil precisa status tipado.');
assert(perfil.includes('createdAt'), 'Perfil precisa datas.');
assert(perfil.includes('observacoes'), 'Perfil precisa observações sensíveis.');
assert(identity.includes('firstLetterOfEachWord'), 'Identity engine precisa iniciais de palavras.');
assert(identity.includes('reverse'), 'Identity engine precisa reverse.');
assert(sensitive.includes('PerfilPayload'), 'Campos sensíveis precisam estar tipados.');
assert(docs.includes('cadastro de clientes/perfis fechado'), 'Docs precisam declarar fechamento do escopo.');
console.log('perfil-typescript-contract.test.cjs OK');
