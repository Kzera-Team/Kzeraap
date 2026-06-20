const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function walk(dir, acc = []) {
  for (const item of fs.readdirSync(path.join(root, dir))) {
    const full = path.join(root, dir, item);
    const rel = path.relative(root, full);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(rel, acc);
    else if (/\.(ts|md|cjs|json)$/.test(item)) acc.push(rel);
  }
  return acc;
}

const eventDoc = read('src/domain/uxMetricas/UxMetricas.ts');
const service = read('src/application/uxMetricas/UxMetricasService.ts');
const sanitizer = read('src/application/uxMetricas/UxMetricasSanitizer.ts');
const domTracker = read('src/presentation/shared/uxTracking/UxDomTracker.ts');
const configView = read('src/presentation/configuracoes/ConfiguracoesOperacionaisView.ts');
const docs = read('docs/ux/METRICAS_LOCAIS_UX_1.19.3.md');
const appVersion = read('src/app/appVersion.ts');

assert(appVersion.includes("APP_VERSION = '1.19.5'"), 'Versão deve estar em 1.19.3.');

const allowed = [
  'app_sessao_iniciada',
  'app_sessao_finalizada',
  'app_bloqueado',
  'app_desbloqueado',
  'app_reaberto',
  'tela_aberta',
  'tela_fechada',
  'fluxo_iniciado',
  'fluxo_concluido',
  'fluxo_abandonado',
  'acao_executada',
  'voltar_usado',
  'navegacao_repetida',
  'erro_exibido',
  'lista_limitada'
];
for (const eventName of allowed) assert(eventDoc.includes(eventName), `Evento permitido ausente: ${eventName}`);

const removed = ['tempo' + '_parado_detectado', 'atrito' + '_detectado', 'campo' + '_interagido'];
for (const file of walk('src')) {
  const content = read(file);
  for (const eventName of removed) {
    assert(!content.includes(eventName), `${eventName} não pode existir no código inicial de métricas: ${file}`);
  }
}

assert(service.includes('maxEventosBrutos ?? 2000'), 'Retenção local de 2.000 eventos deve existir.');
assert(service.includes('limpar()'), 'Serviço deve permitir limpar métricas locais.');
assert(sanitizer.includes('FORBIDDEN_KEY_PATTERNS'), 'Sanitizer deve bloquear chaves proibidas.');
assert(sanitizer.includes('/telefone/i'), 'Sanitizer deve bloquear telefone.');
assert(sanitizer.includes('/valor/i'), 'Sanitizer deve bloquear valor financeiro.');
assert(sanitizer.includes('/texto/i'), 'Sanitizer deve bloquear texto digitado.');
assert(sanitizer.includes('/perfilid/i'), 'Sanitizer deve bloquear ID real de Perfil.');
assert(domTracker.includes('acao_executada'), 'DOM tracker deve registrar ações genéricas.');
assert(domTracker.includes('tela_fechada'), 'DOM tracker deve registrar duração de tela.');
assert(configView.includes('Limpar métricas de uso'), 'Configurações deve permitir limpar métricas.');
assert(configView.includes('não guardam nomes, telefones, itens, valores ou textos digitados'), 'UI deve explicar privacidade das métricas.');
assert(docs.includes('Não é auditoria da Usuária'), 'Documentação deve deixar claro que não é auditoria.');
assert(docs.includes('não devem existir no código desta versão'), 'Documentação deve registrar remoções do escopo inicial.');

for (const file of walk('src').concat(walk('docs')).concat(walk('tests'))) {
  const content = read(file);
  const termoAntigoMaior = 'Senhora' + ' ' + 'Cansada';
  const termoAntigoMenor = 'senhora' + ' ' + 'cansada';
  assert(!content.includes(termoAntigoMaior), `Nomenclatura antiga deve sair: ${file}`);
  assert(!content.includes(termoAntigoMenor), `Nomenclatura antiga deve sair: ${file}`);
}

console.log('ux-metricas-locais-1193 ok');
