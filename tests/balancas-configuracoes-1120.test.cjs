const fs = require('fs');
function assert(condition, message) { if (!condition) throw new Error(message); }
const domain = fs.readFileSync('src/domain/operacao/Balanca.ts', 'utf8');
const app = fs.readFileSync('src/app/createKzeraAuthenticatedApp.ts', 'utf8');
const view = fs.readFileSync('src/presentation/configuracoes/ConfiguracoesOperacionaisView.ts', 'utf8');
const gov = fs.readFileSync('src/domain/governanca/OperacaoKzera.ts', 'utf8');
const docs = fs.readFileSync('docs/BALANCAS_CONFIGURACOES_1.12.0.md', 'utf8');

assert(domain.includes('BalancaCalibragem'), 'Balança deve ter histórico de calibragem.');
assert(domain.includes('selecionarBalancaOperacional'), 'Deve existir regra de seleção operacional da balança.');
assert(domain.includes('exigirBalancaParaPesagem'), 'Pesagem deve exigir balança ativa ou escolha.');
assert(fs.existsSync('src/application/operacao/CriarBalancaUseCase.ts'), 'Deve existir caso de uso para cadastrar balança.');
assert(fs.existsSync('src/application/operacao/RegistrarCalibragemBalancaUseCase.ts'), 'Deve existir caso de uso para calibragem.');
assert(app.includes("createOperationalRepository<Balanca>('balancas')"), 'App deve persistir balanças em repositório próprio.');
assert(app.includes("stores: ['perfis', 'itens', 'balancas']"), 'IndexedDB deve conter store de balanças.');
assert(app.includes('await configuracoesApp.mount(appRoot)'), 'Configurações deve montar tela operacional real.');
assert(view.includes('data-testid="balanca-form"'), 'Tela de Configurações deve ter formulário de balança.');
assert(view.includes('data-balanca-calibragem-form'), 'Tela deve permitir registrar calibragem.');
assert(view.includes('O que quase nunca muda fica aqui'), 'Tela deve explicar com calma por que cadastro raro não vai para a tela inicial.');
assert(!app.includes('data-nav="balancas"'), 'Balanças não devem virar item direto de Dashboard/menu principal.');
assert(gov.includes('deveEntrarNoDashboard'), 'Governança deve registrar teste de entrada no Dashboard.');
assert(gov.includes('localCorretoParaCadastroRaro'), 'Governança deve registrar cadastro raro em Configurações.');
assert(docs.includes('Cadastro de balanças é configuração operacional rara'), 'Documentação deve explicar decisão de Configurações.');
console.log('balancas-configuracoes-1120.test.cjs OK');
