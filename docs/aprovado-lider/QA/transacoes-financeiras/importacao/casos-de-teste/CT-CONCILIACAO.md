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

Evidencias:

Status: Aguardando evidencia

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

Evidencias:

Status: Aguardando evidencia

## CT-CON-05 - Divergencia de perfil

Objetivo: validar conflito de comprador ou Perfil.

Esperado:
- status divergencia de perfil
- nao aprova automaticamente
- fica para revisao manual

Obtido:

Evidencias:

Status: Aguardando evidencia

## CT-CON-06 - Pagamento posterior provavel

Objetivo: validar sugestao de pagamento posterior.

Esperado:
- status pagamento posterior provavel
- sugestao aparece
- exige acao guiada
- nao confirma automaticamente

Obtido:

Evidencias:

Status: Aguardando evidencia
