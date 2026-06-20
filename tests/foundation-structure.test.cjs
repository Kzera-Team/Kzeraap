const fs = require('fs');
const path = require('path');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const required = [
  'src/core/Result.ts',
  'src/core/Entity.ts',
  'src/domain/perfil/Perfil.ts',
  'src/domain/identidade/IdentityRule.ts',
  'src/application/ports/Repository.ts',
  'src/runtime/SessionContext.ts',
  'src/runtime/BackupPolicy.ts',
  'src/infrastructure/repositories/PerfilRepository.ts',
  'src/app/bootstrap.ts',
  'docs/ARCHITECTURE.md',
  'docs/SECURITY.md'
];

for (const file of required) {
  assert(fs.existsSync(path.join(process.cwd(), file)), `Arquivo obrigatório ausente: ${file}`);
}

const bootstrap = fs.readFileSync('src/app/bootstrap.ts', 'utf8');
assert(!bootstrap.includes('bindTransaçãoEvents'), 'bootstrap não pode conter handlers de transação.');
assert(!bootstrap.includes('bindItemEvents'), 'bootstrap não pode conter handlers de item.');
assert(bootstrap.length < 1500, 'bootstrap deve ser pequeno nesta fundação.');

console.log('foundation-structure.test.cjs OK');
