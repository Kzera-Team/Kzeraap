const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'src/app/createKzeraAuthenticatedApp.ts'), 'utf8');
const domain = fs.readFileSync(path.join(root, 'src/domain/relatorio/RelatorioOperacional.ts'), 'utf8');
const useCase = fs.readFileSync(path.join(root, 'src/application/relatorio/GerarRelatorioOperacionalUseCase.ts'), 'utf8');
const version = fs.readFileSync(path.join(root, 'src/app/appVersion.ts'), 'utf8');

assert(version.includes("APP_VERSION = '1.19.5'"), 'versao publica deve ser 1.19.5');
assert(app.includes("'relatorios'"), 'app deve registrar tela de relatorios');
assert(app.includes("['relatorios', 'Relatórios']"), 'menu deve abrir Relatórios');
assert(app.includes('data-testid="relatorios-operacionais"'), 'tela de relatorios deve existir');
assert(app.includes('Visão rápida do trabalho'), 'relatorio deve ter linguagem operacional simples');
assert(app.includes('Operação comercial completa entra aqui quando o módulo principal existir.'), 'relatorio nao deve fingir que Operação comercial ja existe');
assert(app.includes('renderRelatoriosScreen'), 'render de relatorios deve existir');
assert(app.includes('bindRelatoriosFilters'), 'filtros de relatorios devem existir');

assert(domain.includes('interface RelatorioOperacional'), 'domain deve tipar RelatorioOperacional');
assert(domain.includes('RelatorioIndicadorFinanceiro'), 'domain deve tipar indicadores financeiros');
assert(useCase.includes('class GerarRelatorioOperacionalUseCase'), 'application deve conter caso de uso de relatorio');
assert(useCase.includes('ticketMedio'), 'relatorio deve calcular media por registro');
assert(useCase.includes('itensComEstoque'), 'relatorio deve resumir estoque');
assert(useCase.includes('perfisAtivos'), 'relatorio deve resumir cadastros');

const relatoriosSlice = app.slice(app.indexOf('async function renderRelatoriosScreen'), app.indexOf('function bindTransacoesFilters'));
const forbiddenUi = ['Dashboard', 'staging', 'pacote congelado', 'falha_confirmacao'];
for (const term of forbiddenUi) {
  assert(!relatoriosSlice.includes(term), `UI de relatorios nao deve expor termo frio: ${term}`);
}

console.log('relatorios-operacionais-1194: ok');
