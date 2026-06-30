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

Evidencias:

Status: Aguardando evidencia

## CT-CON-03 - Pendente sem transacao

Objetivo: validar financeiro sem transacao correspondente.

Esperado:
- status pendente sem transacao
- nao cria transacao automaticamente
- fica para revisao

Obtido:

Evidencias:

Status: Aguardando evidencia

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
