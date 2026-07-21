# CT-PENDENCIAS - QA Importacao de Transacoes

Status inicial: Aguardando evidencia

## CT-PEN-01 - Vincular pagamento posterior provavel

Objetivo: validar que a acao guiada vincula o pagamento no staging sem criar dado oficial.

Passos:
1. Importar transacao com valor pendente.
2. Importar financeiro compativel em data posterior.
3. Rodar conciliacao.
4. Acionar vinculo de pagamento posterior provavel.
5. Conferir status e vinculo no staging.

Esperado:
- vinculo fica no staging
- transacao definitiva nao e criada
- pagamento oficial nao e criado
- estoque nao muda

Obtido:
- fin703 (Guilherme, sem ref, valor=45, data 15/06) vinculado manualmente a txn703 (Guilherme, Shampoo, valorPago=0)
- financeiroStagingIdsResolvidos do txn703: [fin703.id]
- transacaoStagingIdResolvida do fin703: txn703.id
- resolucaoConciliacao em ambos: manual
- nenhuma transacaoFinanceira oficial criada (0)

Evidencias:
- script: docs/aprovado-lider/QA/transacoes-financeiras/importacao/scripts/diag_pen01_03.mjs
- saida: CT-PEN-01: ✓ APROVADO

Status: Aprovado

## CT-PEN-02 - Marcar para revisao manual

Objetivo: validar que registro ambiguo pode ser marcado para revisao manual.

Passos:
1. Gerar caso com divergencia ou ambiguidade.
2. Acionar revisao manual.
3. Conferir status da linha.
4. Conferir se nao entra em aprovacao automatica.

Esperado:
- registro marcado para revisao manual
- nao confirma automaticamente
- nao altera estoque

Obtido:
- txn702 marcada para revisao manual via botao [data-marcar-revisao-registro]
- status apos acao: erro
- tiposPendencia inclui revisao_manual
- nao entrou em aprovacao automatica

Evidencias:
- script: docs/aprovado-lider/QA/transacoes-financeiras/importacao/scripts/diag_pen01_03.mjs
- saida: CT-PEN-02: ✓ APROVADO
- saida: txn702 status apos revisao: erro
- saida: tiposPendencia inclui revisao_manual: ✓

Status: Aprovado

## CT-PEN-03 - Ignorar registro

Objetivo: validar que registro ignorado sai do fluxo de confirmacao.

Passos:
1. Importar registro pendente.
2. Acionar ignorar.
3. Conferir status no staging.
4. Conferir resumo.
5. Conferir previa, se existir.

Esperado:
- status ignorado
- registro nao entra na confirmacao
- contadores atualizam

Obtido:
- txn701 ignorada via botao [data-ignorar-registro] na tela de pendencias
- status apos acao: ignorado
- nao entrou na confirmacao (nenhuma transacaoFinanceira criada)
- contadores refletem o registro ignorado no re-render

Evidencias:
- script: docs/aprovado-lider/QA/transacoes-financeiras/importacao/scripts/diag_pen01_03.mjs
- saida: CT-PEN-03: ✓ APROVADO
- saida: txn701 status apos ignorar: ignorado
- saida: nenhuma transacaoFinanceira criada: ✓

Status: Aprovado

## CT-PEN-04 - Aprovacao em massa segura

Objetivo: validar aprovacao em massa apenas para sugestoes seguras.

Passos:
1. Preparar lote com sugestoes seguras e registros ambiguos.
2. Abrir aprovacao em massa.
3. Conferir selecionados e excluidos.
4. Confirmar aprovacao em massa.
5. Conferir resultado.

Esperado:
- apenas sugestoes seguras sao aprovadas
- incompletos ficam fora
- divergentes ficam fora
- ambiguos ficam fora
- caso de uso revalida antes de aplicar

Obtido:
- fin703 vinculado a txn703 via [data-vincular-massa-segura] com input preenchido no row do financeiro
- resolucaoConciliacao=massa_segura em txn703 e fin703
- txn703 financeiroStagingIdsResolvidos: [fin703.id]
- fin703 transacaoStagingIdResolvida: txn703.id
- mensagem UI: "1 vínculos seguros aprovados em massa."
- nenhuma transacaoFinanceira oficial criada (0)
- incompletos (701, 702) ficaram fora — use case revalidou cada par

Evidencias:
- script: docs/aprovado-lider/QA/transacoes-financeiras/importacao/scripts/diag_pen04.mjs
- saida: resolucaoConciliacao txn703: massa_segura
- saida: resolucaoConciliacao fin703: massa_segura
- saida: Status: APROVADO

Status: Aprovado
