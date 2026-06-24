const fs = require('fs');
const assert = require('assert');

const transacoes = fs.readFileSync('src/application/importacao/PrepararImportacaoTransacoesUseCase.ts', 'utf8');
const financeiro = fs.readFileSync('src/application/importacao/PrepararImportacaoFinanceiraUseCase.ts', 'utf8');
const view = fs.readFileSync('src/presentation/importacao/ImportacaoTransacoesFinanceiroView.ts', 'utf8');
const listar = fs.readFileSync('src/application/importacao/ListarStagingImportacaoUseCase.ts', 'utf8');

assert(transacoes.includes('TAMANHO_BLOCO_IMPORTACAO = 50'), 'Importação de transações deve processar em blocos pequenos.');
assert(transacoes.includes('await liberarThreadImportacao()'), 'Importação de transações deve liberar a thread entre blocos.');
assert(transacoes.includes('index % TAMANHO_BLOCO_IMPORTACAO === 0'), 'Importação de transações deve pausar periodicamente.');

assert(financeiro.includes('TAMANHO_BLOCO_IMPORTACAO = 50'), 'Importação financeira deve processar em blocos pequenos.');
assert(financeiro.includes('await liberarThreadImportacao()'), 'Importação financeira deve liberar a thread entre blocos.');
assert(financeiro.includes('index % TAMANHO_BLOCO_IMPORTACAO === 0'), 'Importação financeira deve pausar periodicamente.');

assert(listar.includes('limiteVisualizacao = 80'), 'Listagem de staging deve limitar renderização mobile.');
assert(listar.includes('registrosTransacoes.slice(-limiteVisualizacao)'), 'Tela não deve receber todas as transações para renderizar.');
assert(listar.includes('registrosFinanceiros.slice(-limiteVisualizacao)'), 'Tela não deve receber todos os financeiros para renderizar.');
assert(view.includes('limiteRenderizacaoMobile = 80'), 'Conferência visual deve limitar itens renderizados.');
assert(view.includes('para não travar o iPhone'), 'Tela deve explicar limite visual para o usuário.');

console.log('importacao-transacoes-mobile-1198.test.cjs OK');
