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

Evidencias:

Status: Aguardando evidencia

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
- nao foi possivel executar: ResolverPendenciaImportacaoUseCase sem botao de revisao manual na UI

Evidencias:
- nenhum seletor de revisao manual encontrado na tela de importacao

Status: Bloqueado — produto sem binding de UI

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

Evidencias:

Status: Aguardando evidencia

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
- nao foi possivel executar: AprovacaoEmMassaImportacaoUseCase sem botao de aprovacao em massa na UI

Evidencias:
- nenhum seletor de aprovacao em massa encontrado na tela de importacao

Status: Bloqueado — produto sem binding de UI
