const assert = require('assert');
const fs = require('fs');

const policy = fs.readFileSync('src/runtime/BackupPolicy.ts', 'utf8');
assert(policy.includes("hour: 7, minute: 0"), 'Backup da manhã deve ser às 07:00.');
assert(policy.includes("hour: 15, minute: 0"), 'Backup da tarde deve ser às 15:00.');
assert(policy.includes("hour: 23, minute: 0"), 'Backup da noite deve ser às 23:00.');
assert(policy.includes('postponeMinutes: 20'), 'Backup deve permitir adiamento de 20 minutos.');
assert(policy.includes('maxPostponesPerWindow: 1'), 'Backup deve permitir apenas um adiamento.');

const gate = fs.readFileSync('src/application/backup/BackupGateUseCase.ts', 'utf8');
assert(gate.includes('blocked: !canPostpone'), 'Depois do adiamento usado, backup deve bloquear.');
assert(gate.includes('postpone('), 'Backup precisa ter ação de adiar.');
assert(gate.includes('complete('), 'Backup precisa registrar conclusão.');

const exporter = fs.readFileSync('src/application/backup/BackupExportUseCase.ts', 'utf8');
assert(exporter.includes('PayloadProvider'), 'Backup precisa usar criptografia da senha mestra via material da sessão.');
assert(exporter.includes('perfis: unknown[]'), 'Backup deve incluir Perfis.');
assert(exporter.includes('itens: unknown[]'), 'Backup deve incluir Itens.');
assert(!exporter.includes('configuracoes'), 'Backup não deve incluir Configurações.');

const app = fs.readFileSync('src/app/createKzeraAuthenticatedApp.ts', 'utf8');
assert(app.includes('data-testid="backup-modal"'), 'Backup obrigatório deve aparecer em modal.');
assert(app.includes('data-backup-export'), 'Modal de backup precisa ter ação de exportar.');
assert(app.includes('data-backup-postpone'), 'Modal de backup precisa ter ação de adiar quando permitido.');
assert(app.includes('Configurações não entram'), 'Modal deve avisar que configurações não entram no backup.');

console.log('backup-obrigatorio-1943.test.cjs OK');
