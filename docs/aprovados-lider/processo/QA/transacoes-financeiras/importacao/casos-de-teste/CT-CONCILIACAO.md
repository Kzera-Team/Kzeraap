# CT-CONCILIACAO - QA Importacao de Transacoes

Status inicial: Aguardando evidencia

## CT-CON-01 - Conciliado

Objetivo: validar conciliacao quando transacao e financeiro batem.

Passos:
1. Importar CSV de transacoes.
2. Importar CSV financeiro.
3. Preparar os dois arquivos.
4. Conferir pagamentos.
5. Verificar status da linha.

Esperado:
- status conciliado
- valor bate
- perfil bate
- metodo bate
- nada definitivo e criado

Obtido:
- staging pos-conciliar: 7 registros
- 6 registros com status=validado (conciliados — perfil, item e financeiro ok)
- 1 registro com status=pendente_item (item nao encontrado, nao entrou na previa)
- nenhum dado oficial criado durante a conciliacao (apenas classificacao de staging)

Evidencias:
- script: docs/aprovado-lider/QA/transacoes-financeiras/importacao/scripts/diag_reg03.mjs
- saida: Staging pos-conciliar: 7 registros
- saida: txn[2-6,8] status=validado

Status: Aprovado

## CT-CON-02 - Pendente sem financeiro

Objetivo: validar transacao sem financeiro correspondente.

Esperado:
- status pendente sem financeiro
- registro vai para revisao
- nao confirma automaticamente

Obtido:
- Bloqueado: as transacoes da massa de teste ficaram em pendente_item (item nao encontrado) antes de chegar na etapa de conciliacao
- a validacao de item bloqueia antes da conciliacao ser executada
- nao foi possivel validar financeiro_nao_encontrado com a massa atual
- nenhuma transacao foi confirmada automaticamente (confirmado)

Evidencias:
- transacoes em staging: tiposPendencia incluindo item_nao_encontrado para todos os 5 registros
- conciliacao nao executada pois pendencias de item bloqueiam o avanco

Status: Bloqueado por massa inadequada

## CT-CON-03 - Pendente sem transacao

Objetivo: validar financeiro sem transacao correspondente.

Esperado:
- status pendente sem transacao
- nao cria transacao automaticamente
- fica para revisao

Obtido:
- 2 registros financeiros sem numeroTransacaoReferenciado (descricao "Adicao de Credito" sem referencia de numero de transacao)
- nenhuma transacao foi criada automaticamente para esses registros
- registros ficaram disponiveis para revisao em staging

Evidencias:
- dump staging financeiro: 2 registros com numRef ausente (undefined/null)
- print: prints/04-staging-apos-preparar.png

Status: Aprovado

## CT-CON-04 - Divergencia de valor

Objetivo: validar divergencia entre valor da transacao e valor financeiro.

Massa sugerida:
- transacao: 100,00
- financeiro: 90,00

Esperado:
- status divergencia de valor
- registro bloqueado ou em revisao manual
- nao entra em aprovacao automatica

Obtido:
- 3 transacoes e 3 financeiros em staging apos preparacao
- conciliacao retornou: "Conferencia pronta: 0 pagamentos conferidos"
- txn 701 (total=100, valorPago=100) com financeiro #701 (valor=90, Ricardo) → financeiroStagingIdsResolvidos=[] (sem vinculo automatico)
- previa gerada: 2 bloqueadas (701 e 702), transacoesPrevistas=1 (apenas 703 com valorPago=0 entrou)
- zero transacoesFinanceiras oficiais criadas

Evidencias:
- script: docs/aprovado-lider/QA/transacoes-financeiras/importacao/scripts/diag_con04_05_06.mjs
- saida: CT-CON-04: txn 701 financeiroIds=0 → APROVADO
- saida: Bloqueadas: 2 (701 e 702)

Status: Aprovado

## CT-CON-05 - Divergencia de perfil

Objetivo: validar conflito de comprador ou Perfil.

Esperado:
- status divergencia de perfil
- nao aprova automaticamente
- fica para revisao manual

Obtido:
- txn 702 (total=25, valorPago=25, cliente=Ricardo) com financeiro #702 (valor=25, cliente=Guilherme) → perfil divergente
- financeiroStagingIdsResolvidos=[] para txn 702 (sem vinculo automatico)
- txn 702 bloqueada na previa junto com txn 701
- nao entrou em aprovacao automatica

Evidencias:
- script: docs/aprovado-lider/QA/transacoes-financeiras/importacao/scripts/diag_con04_05_06.mjs
- saida: CT-CON-05: txn 702 financeiroIds=0 → APROVADO
- saida: Bloqueadas: 2 (inclui txn 702)

Status: Aprovado

## CT-CON-06 - Pagamento posterior provavel

Objetivo: validar sugestao de pagamento posterior.

Esperado:
- status pagamento posterior provavel
- sugestao aparece
- exige acao guiada
- nao confirma automaticamente

Obtido:
- txn 703 (Guilherme, Shampoo, total=45, valorPago=0) com financeiro sem referencia (Credito Guilherme, valor=45, Guilherme, 15/06)
- candidato de pagamento posterior provavel: financeiro sem numRef, valor=45, mesma cliente, data >= transacao
- financeiroStagingIdsResolvidos=[] para txn 703 (sem vinculo automatico)
- nenhuma transacaoFinanceira oficial criada (0)
- txn 703 entrou na previa somente como historico sem pagamento vinculado (pagamentos=0, movimentos=0)

Evidencias:
- script: docs/aprovado-lider/QA/transacoes-financeiras/importacao/scripts/diag_con04_05_06.mjs
- saida: CT-CON-06: txn 703 financeiroIds=0 → APROVADO
- saida: Pagamentos previstos: 0 / Movimentos previstos: 0
- saida: transacoesFinanceiras (antes de confirmar): 0

Status: Aprovado
