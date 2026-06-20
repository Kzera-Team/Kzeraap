const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const securityDoc = fs.readFileSync('docs/SECURITY.md', 'utf8');
const session = fs.readFileSync('src/runtime/SessionContext.ts', 'utf8');
const backup = fs.readFileSync('src/runtime/BackupPolicy.ts', 'utf8');

assert(securityDoc.includes('Credencial não expira'), 'Credencial sem expiração precisa estar documentada.');
assert(securityDoc.includes('Sem pergunta secreta'), 'Sem pergunta secreta precisa estar documentado.');
assert(securityDoc.includes('5 horas'), 'Revalidação por senha após 5 horas precisa estar documentada.');
assert(session.includes('5 * 60 * 60 * 1000'), 'Sessão precisa representar 5 horas.');
assert(session.includes('60_000'), 'Sessão precisa representar 1 minuto para Face ID.');
assert(backup.includes('retentionDays: 3'), 'Backup deve manter 3 dias.');
assert(backup.includes('postponeMinutes: 20'), 'Backup deve permitir adiamento de 20 minutos.');
assert(backup.includes('maxPostponesPerWindow: 1'), 'Backup deve permitir apenas um adiamento.');

console.log('security-decisions.test.cjs OK');
