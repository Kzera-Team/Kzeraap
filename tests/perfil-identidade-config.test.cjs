const fs = require('fs');
function assert(cond, msg) { if (!cond) throw new Error(msg); }
const domain = fs.readFileSync('src/domain/identidade/IdentityRuleConfig.ts','utf8');
const save = fs.readFileSync('src/application/identidade/SalvarIdentityRuleUseCase.ts','utf8');
const preview = fs.readFileSync('src/application/identidade/PreviewIdentityRuleUseCase.ts','utf8');
const vm = fs.readFileSync('src/presentation/perfil/IdentityRuleConfigViewModel.ts','utf8');
assert(domain.includes('IDENTITY_ALLOWED_CLIENT_COLUMNS'), 'Precisa whitelist de colunas.');
assert(domain.includes('validateIdentityRule'), 'Precisa validar regra.');
assert(domain.includes('previewIdentityRule'), 'Precisa preview da regra.');
assert(save.includes('SalvarIdentityRuleUseCase'), 'Precisa salvar regra.');
assert(preview.includes('PreviewIdentityRuleUseCase'), 'Precisa use case de preview.');
assert(vm.includes('addFieldLabel'), 'Precisa VM da tela de regra.');
console.log('perfil-identidade-config.test.cjs OK');
