const fs=require('fs');function a(c,m){if(!c)throw new Error(m)}
const cleanup=fs.readFileSync('src/runtime/RuntimeCleanup.ts','utf8');
const payload=fs.readFileSync('src/runtime/PayloadProvider.ts','utf8');
const material=fs.readFileSync('src/runtime/MaterialService.ts','utf8');
const repo=fs.readFileSync('src/infrastructure/repositories/PerfilRepository.ts','utf8');
a(cleanup.includes('releaseBytes'),'releaseBytes');
a(cleanup.includes('releaseObject'),'releaseObject');
a(payload.includes('releaseBytes(inputBuffer)'),'pack/unpack input cleanup');
a(payload.includes('releaseBytes(aadBuffer)'),'aad cleanup');
a(material.includes('releaseBytes(inputBuffer)'),'password buffer cleanup');
a(material.includes('releaseBytes(saltBuffer)'),'salt buffer cleanup');
a(repo.includes('releaseObject(workingSet)'),'payload object cleanup');
console.log('runtime-hardening-1914.test.cjs OK');
