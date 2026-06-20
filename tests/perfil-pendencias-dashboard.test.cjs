const fs = require('fs');
function assert(cond, msg) { if (!cond) throw new Error(msg); }
const domain = fs.readFileSync('src/domain/perfil/PerfilPendenciasDashboard.ts','utf8');
const usecase = fs.readFileSync('src/application/perfil/PerfilPendenciasDashboardUseCase.ts','utf8');
assert(domain.includes('semBairro'), 'Dashboard precisa semBairro.');
assert(domain.includes('semCodigo'), 'Dashboard precisa semCodigo.');
assert(domain.includes('aptosParaCodigo'), 'Dashboard precisa aptosParaCodigo.');
assert(domain.includes('possiveisDuplicados'), 'Dashboard precisa duplicados.');
assert(usecase.includes('PerfilPendenciasDashboardUseCase'), 'Precisa use case dashboard.');
console.log('perfil-pendencias-dashboard.test.cjs OK');
