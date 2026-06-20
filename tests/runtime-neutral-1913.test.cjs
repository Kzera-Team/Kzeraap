const fs=require('fs');
function a(c,m){if(!c)throw new Error(m)}
a(fs.existsSync('src/runtime/SessionContext.ts'),'SessionContext');
a(fs.existsSync('src/runtime/ResourceScope.ts'),'ResourceScope');
a(fs.existsSync('src/runtime/PayloadProvider.ts'),'PayloadProvider');
a(fs.existsSync('src/runtime/AccessCoordinator.ts'),'AccessCoordinator');
a(fs.existsSync('src/infrastructure/repositories/PerfilRepository.ts'),'PerfilRepository');
const provider=fs.readFileSync('src/runtime/PayloadProvider.ts','utf8');
a(provider.includes('fill(0)'),'buffers zeroed');
a(!fs.existsSync('src/security'),'sem pasta security');
console.log('runtime-neutral-1913.test.cjs OK');
