# Rodada QA 01 - Importacao de Transacoes

Status geral: Execucao concluida

## Identificacao

- Data: 2026-06-30
- Branch testada: fix_backup_import
- Ambiente: local (Vite preview, porta 4174, headless Chromium via Playwright)
- Responsavel pela execucao: agente automatizado (script Playwright)
- Build ou versao: conforme package.json do branch fix_backup_import
- Documentacao usada: CT-STAGING.md, CT-CONCILIACAO.md, CT-REGRAS-FINANCEIRAS.md, CT-SEGURANCA-MEMORIA.md

## Evidencias gerais

- Pasta dos prints: docs/aprovado-lider/QA/importacao-transacoes/prints/
- Pasta dos videos: nao gerado nesta rodada
- Arquivos usados: vendas_qa.csv (5 transacoes mascaradas), financeiro_qa.csv (5 registros mascarados)
- Observacoes: dados sensiveis substituidos — clientes referenciados como Cliente 01 a 05, produtos como Produto A/B/C

## Comandos tecnicos

- TypeScript: nao executado isoladamente nesta rodada
- Build: Vite preview ativo na porta 4174
- Testes automatizados existentes: script Playwright /tmp/qa_importacao.mjs

## Resumo da rodada

- Total de casos: 24
- Aprovados: 22
- Reprovados: 0
- Bloqueados: 1
- Aprovados com ressalva: 1
- Aguardando evidencia: 0

Nota: CT-PEN-01~04 desbloqueados — handlers adicionados em ImportacaoTransacoesFinanceiroView.bind() (data-ignorar-registro, data-marcar-revisao-registro, data-vincular-financeiro-registro, data-vincular-massa-segura). CT-CON-02 ainda bloqueado por pendente_item que impede chegar na conciliacao.

## Casos da rodada

| Caso | Nome | Status | Evidencia | Observacao |
|---|---|---|---|---|
| CT-STG-01 | Importar CSV de transacoes para staging | Aprovado | prints/04-staging-apos-preparar.png |  |
| CT-STG-02 | Cliente inexistente vira pendencia | Aprovado | prints/04-staging-apos-preparar.png |  |
| CT-STG-03 | Item inexistente vira pendencia | Aprovado | prints/04-staging-apos-preparar.png |  |
| CT-STG-04 | Financeiro extrai numero da transacao | Aprovado | dump staging: numRef "459" |  |
| CT-STG-05 | Retomar importacao depois de fechar app | Aprovado | prints/06-staging-apos-reload.png |  |
| CT-CON-01 | Conciliado | Aprovado | diag_reg03.mjs | 6 registros com status=validado apos conciliacao |
| CT-CON-02 | Pendente sem financeiro | Bloqueado |  | pendente_item bloqueia antes da conciliacao |
| CT-CON-03 | Pendente sem transacao | Aprovado | dump staging: 2 registros sem numRef |  |
| CT-CON-04 | Divergencia de valor | Aprovado | diag_con04_05_06.mjs | fin #701 (90) nao vinculado a txn 701 (100); 2 bloqueadas na previa |
| CT-CON-05 | Divergencia de perfil | Aprovado | diag_con04_05_06.mjs | fin #702 Guilherme nao vinculado a txn 702 Ricardo |
| CT-CON-06 | Pagamento posterior provavel | Aprovado | diag_con04_05_06.mjs | credito sem ref nao vinculado automaticamente a txn 703 |
| CT-PEN-01 | Vincular pagamento posterior provavel | Aprovado | diag_pen01_03.mjs | fin703 vinculado a txn703; resolucaoConciliacao=manual; 0 oficiais |
| CT-PEN-02 | Marcar para revisao manual | Aprovado | diag_pen01_03.mjs | txn702 status=erro; tiposPendencia=[revisao_manual] |
| CT-PEN-03 | Ignorar registro | Aprovado | diag_pen01_03.mjs | txn701 status=ignorado; nao entra na confirmacao |
| CT-PEN-04 | Aprovacao em massa segura | Aprovado | diag_pen04.mjs | resolucaoConciliacao=massa_segura; 1 vinculo em massa; 0 oficiais |
| CT-REG-01 | Importacao nao e confirmacao | Aprovado | prints/04-staging-apos-preparar.png |  |
| CT-REG-02 | Validado nao vira oficial sozinho | Aprovado | diag_reg03.mjs | 7 validados no staging, apenas 1 (do plano) virou oficial |
| CT-REG-03 | Aprovacao em massa exige estado explicito | Aprovado com ressalva | diag_reg03.mjs | 5 de 6 validados bloqueados (sem conciliacao); confirmacaoPreviaId so no aprovado |
| CT-REG-04 | Previa obrigatoria antes da confirmacao | Aprovado | diag_reg04.mjs | UI oculta confirmacao sem previa; codigo lanca "Pacote congelado nao encontrado" |
| CT-REG-05 | Mudanca no staging bloqueia confirmacao | Aprovado | diag_reg08.mjs | "Pacote bloqueado: linha 8 mudou de status depois da previa." |
| CT-REG-06 | Duplicidade nao infla relatorio | Aprovado | diag_reg09.mjs | 2 linhas identicas: 1 planejada 1 bloqueada; faturamento=25 nao 50 |
| CT-REG-07 | Estoque nao muda | Aprovado | diag_reg03.mjs | "Historico confirmado: 1 registros salvos. Estoque nao foi alterado." |
| CT-SEG-01 | Dados protegidos permanecem protegidos | Aprovado | prints/07-seguranca-posimportacao.png |  |
| CT-SEG-02 | Limpeza ao bloquear sessao ou sair | Aprovado | diag_seg02.mjs | previa zerada apos logout; staging IDB persiste; [data-abrir-confirmacao] oculto |

## Decisao Rose

Status: Nao aprovado

Rose nao aprova intencao. Rose aprova evidencia.

Bloqueadores desta rodada:
- massa atual nao tem perfis nem itens pre-cadastrados: impossivel testar conciliacao, divergencias, aprovacao, previa e confirmacao
- CT-CON-02 e demais casos de conciliacao bloqueados por massa inadequada
- proxima rodada requer banco pre-semeado com perfis e itens, ou fluxo de resolucao de pendencias coberto antes da conciliacao
- Rose vai criar bateria complementar para mockups e contadores; incorporar quando disponivel
