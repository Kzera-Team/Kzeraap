const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const financeiro = read('src/domain/financeiro/Financeiro.ts');
[
  'ContaFinanceira',
  'TransacaoFinanceira',
  'PagamentoTransacao',
  'MovimentoFinanceiro',
  'valorPendente',
  'origensRastreaveis',
  "'cripto'",
  'calcularStatusFinanceiro',
  'criarTransacaoFinanceira',
  'criarMovimentoFinanceiro'
].forEach(term => {
  if (!financeiro.includes(term)) throw new Error(`Financeiro base sem termo obrigatório: ${term}`);
});

const app = read('src/app/createKzeraAuthenticatedApp.ts');
[
  'contasFinanceiras',
  'movimentosFinanceiros',
  'pagamentosTransacao',
  'transacoesFinanceiras'
].forEach(store => {
  if (!app.includes(store)) throw new Error(`App não criou store operacional financeira: ${store}`);
});

const backup = read('src/application/backup/BackupExportUseCase.ts');
[
  'contasFinanceiras',
  'movimentosFinanceiros',
  'pagamentosTransacao',
  'transacoesFinanceiras'
].forEach(store => {
  if (!backup.includes(store)) throw new Error(`Backup não contempla dado financeiro: ${store}`);
});

const docs = read('docs/FINANCEIRO_BASE_1.14.0.md') + read('docs/backlog/FINANCEIRO_CRIPTO_RASTRO_DINHEIRO.md');
[
  'Esqueleto Financeiro Base',
  'não baixa estoque',
  'rastro do dinheiro',
  'Prioridade: média/alta',
  'pagamentos agrupados'
].forEach(term => {
  if (!docs.includes(term)) throw new Error(`Documentação financeira/backlog incompleta: ${term}`);
});

const governanca = read('src/domain/governanca/OperacaoKzera.ts');
[
  'FINANCEIRO_BASE_OBRIGATORIO_ANTES_IMPORTACAO_TRANSACOES',
  'BACKLOG_FINANCEIRO_CRIPTO_RASTRO_DINHEIRO',
  'DOCUMENTOS_FINANCEIRO_OBRIGATORIOS'
].forEach(term => {
  if (!governanca.includes(term)) throw new Error(`Governança sem regra financeira: ${term}`);
});

console.log('financeiro-base-1140 ok');
