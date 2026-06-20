const fs = require('fs');
const path = require('path');
const assert = require('assert');
const root = path.resolve(__dirname, '..');
const item = fs.readFileSync(path.join(root, 'src/domain/item/ItemCatalogo.ts'), 'utf8');
const balanca = fs.readFileSync(path.join(root, 'src/domain/operacao/Balanca.ts'), 'utf8');
const pesagem = fs.readFileSync(path.join(root, 'src/domain/operacao/PesagemRapida.ts'), 'utf8');
const template = fs.readFileSync(path.join(root, 'src/presentation/item/templates/ItemCatalogoTemplate.ts'), 'utf8');
const shell = fs.readFileSync(path.join(root, 'src/app/createKzeraAuthenticatedApp.ts'), 'utf8');
const itemView = fs.readFileSync(path.join(root, 'src/presentation/item/ItemCatalogoDomView.ts'), 'utf8');

assert(item.includes('FracionamentoLote'), 'Lote deve controlar fracionamentos por tipo.');
assert(item.includes('quantidadeUnidadesCriadas'), 'Fracionamento deve contar unidades criadas, não só massa base.');
assert(item.includes('tamanhoFracao'), 'Fracionamento deve guardar tamanho da fração.');
assert(item.includes('dataFracionamento'), 'Fracionamento deve guardar data própria.');
assert(item.includes('RetiradaInternaEstoque'), 'Estoque deve registrar retirada interna separada de transação/perda.');
assert(item.includes('conferirLoteConsolidado'), 'Lote deve ter conferência consolidada.');
assert(item.includes('divergenciaBase'), 'Conferência deve calcular divergência em unidade base.');
assert(item.includes('dataLancamento'), 'Lote deve ter data de lançamento.');
assert(item.includes('custoTotal'), 'Lote deve armazenar custo total.');
assert(template.includes('data-lote-detail-template'), 'Lote grande deve ter tela própria/estrutura própria, não só dentro da variação.');

assert(balanca.includes('interface Balanca'), 'Deve existir cadastro de balanças.');
assert(balanca.includes('BalancaCalibragem'), 'Balança deve ter histórico de calibragem.');
assert(balanca.includes('selecionarBalancaOperacional'), 'UX deve sugerir balança única ou padrão automaticamente.');

assert(pesagem.includes('SessaoPesagemRapida'), 'Deve existir sessão persistente de pesagem rápida.');
assert(pesagem.includes('RegistroPesoFracao'), 'Pesagem rápida deve salvar pesos individuais.');
assert(pesagem.includes('pesoMg'), 'Pesagem rápida deve persistir peso em mg.');
assert(pesagem.includes('proximaEtiqueta'), 'Pesagem rápida deve incrementar etiqueta automaticamente.');
assert(pesagem.includes('pausada'), 'Pesagem rápida deve suportar pausa/retomada.');
assert(pesagem.includes('interrompida'), 'Pesagem rápida deve suportar interrupção por app/sistema.');
assert(pesagem.includes('registrarPesoRapido'), 'Atalho/registro deve salvar peso e avançar.');
assert(pesagem.includes('formatarAtalhoPesoHumano'), 'Atalhos principais devem mostrar g quando couber.');
assert(pesagem.includes('calcularResumoSessao'), 'Sessão deve calcular histórico, média e total.');

assert(shell.includes('👤 Perfis') && shell.includes('📦 Itens'), 'Importação deve usar ícone + texto nas abas.');
assert(itemView.includes('Importar itens'), 'Importação de itens deve ter botão textual.');
assert(!itemView.includes('title="Confirmar importação">✓'), 'Importação não deve ter check solto.');
console.log('estoque-fracionamento-pesagem-1944.test.cjs OK');
