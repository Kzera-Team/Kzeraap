const fs = require('fs');
const assert = require('assert');

const doc = fs.readFileSync('docs/seguranca/VOCABULARIO_OPERACIONAL_PROTEGIDO_1.16.0.md', 'utf8');
const domain = fs.readFileSync('src/domain/vocabulario/VocabularioOperacional.ts', 'utf8');
const useCase = fs.readFileSync('src/application/vocabulario/PrepararVocabularioOperacionalUseCase.ts', 'utf8');
const session = fs.readFileSync('src/runtime/security/VocabularioOperacionalSession.ts', 'utf8');
const governance = fs.readFileSync('src/domain/governanca/OperacaoKzera.ts', 'utf8');

assert(doc.includes('Rótulo operacional sensível não pode nascer aberto no código'), 'Documento deve registrar nascimento seguro do rótulo.');
assert(domain.includes('UNIT_INTERNAL_PRECISION'), 'Domínio deve usar token neutro.');
assert(domain.includes('payloadProtegido'), 'Vocabulário real deve persistir protegido.');
assert(useCase.includes('criptografador.proteger(payload)'), 'Use case deve proteger antes de retornar registro persistível.');
assert(session.includes('limpar()'), 'Sessão deve permitir limpeza de memória.');
assert(governance.includes('POLITICA_VOCABULARIO_OPERACIONAL_PROTEGIDO'), 'Governança deve registrar política.');
assert(!domain.includes('defaultVocabulary'), 'Não deve existir vocabulário real padrão hardcoded.');
assert(!useCase.includes('defaultVocabulary'), 'Use case não deve embutir rótulo real padrão.');

console.log('vocabulario-operacional-protegido-1155.test.cjs OK');
