const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const perfilRules = fs.readFileSync('src/domain/perfil/PerfilRules.ts', 'utf8');
const identity = fs.readFileSync('src/domain/identidade/IdentityRuleEngine.ts', 'utf8');
const business = fs.readFileSync('docs/BUSINESS_RULES.md', 'utf8');

assert(perfilRules.includes('Perfil exige nome'), 'Perfil precisa exigir nome.');
assert(perfilRules.includes('perfilAptoParaDefinirCodigo'), 'Precisa existir regra de aptidão para codigo.');
assert(identity.includes('firstLetterOfEachWord'), 'Motor de identidade precisa suportar iniciais de palavras.');
assert(identity.includes('reverse'), 'Motor de identidade precisa suportar transformação inverter.');
assert(business.includes('Perfil nunca é excluído'), 'Regra de perfil nunca excluído precisa estar documentada.');
assert(business.includes('Codigo é imutável'), 'Codigo imutável precisa estar documentado.');

console.log('domain-rules.test.cjs OK');
