# Rodada QA 01 - Importacao de Transacoes

Status geral: Aguardando evidencia

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

- Total de casos: 23
- Aprovados: 8
- Reprovados: 0
- Bloqueados: 1
- Aguardando evidencia: 14
- Aprovados com ressalva: 0

Nota: os 14 casos restantes exigem massa de teste com perfis e itens pre-cadastrados no banco, que a massa atual nao tem. Bloqueados por massa inadequada ate proxima rodada.

## Casos da rodada

| Caso | Nome | Status | Evidencia | Observacao |
|---|---|---|---|---|
| CT-STG-01 | Importar CSV de transacoes para staging | Aprovado | prints/04-staging-apos-preparar.png |  |
| CT-STG-02 | Cliente inexistente vira pendencia | Aprovado | prints/04-staging-apos-preparar.png |  |
| CT-STG-03 | Item inexistente vira pendencia | Aprovado | prints/04-staging-apos-preparar.png |  |
| CT-STG-04 | Financeiro extrai numero da transacao | Aprovado | dump staging: numRef "459" |  |
| CT-STG-05 | Retomar importacao depois de fechar app | Aprovado | prints/06-staging-apos-reload.png |  |
| CT-CON-01 | Conciliado | Aguardando evidencia |  | massa de teste sem item cadastrado impede chegar nesta etapa |
| CT-CON-02 | Pendente sem financeiro | Bloqueado |  | pendente_item bloqueia antes da conciliacao |
| CT-CON-03 | Pendente sem transacao | Aprovado | dump staging: 2 registros sem numRef |  |
| CT-CON-04 | Divergencia de valor | Aguardando evidencia |  |  |
| CT-CON-05 | Divergencia de perfil | Aguardando evidencia |  |  |
| CT-CON-06 | Pagamento posterior provavel | Aguardando evidencia |  |  |
| CT-PEN-01 | Vincular pagamento posterior provavel | Aguardando evidencia |  |  |
| CT-PEN-02 | Marcar para revisao manual | Aguardando evidencia |  |  |
| CT-PEN-03 | Ignorar registro | Aguardando evidencia |  |  |
| CT-PEN-04 | Aprovacao em massa segura | Aguardando evidencia |  |  |
| CT-REG-01 | Importacao nao e confirmacao | Aprovado | prints/04-staging-apos-preparar.png |  |
| CT-REG-02 | Validado nao vira oficial sozinho | Aguardando evidencia |  |  |
| CT-REG-03 | Aprovacao em massa exige estado explicito | Aguardando evidencia |  |  |
| CT-REG-04 | Previa obrigatoria antes da confirmacao | Aguardando evidencia |  |  |
| CT-REG-05 | Mudanca no staging bloqueia confirmacao | Aguardando evidencia |  |  |
| CT-REG-06 | Duplicidade nao infla relatorio | Aguardando evidencia |  |  |
| CT-REG-07 | Estoque nao muda | Aguardando evidencia |  |  |
| CT-SEG-01 | Dados protegidos permanecem protegidos | Aprovado | prints/07-seguranca-posimportacao.png |  |
| CT-SEG-02 | Limpeza ao bloquear sessao ou sair | Aguardando evidencia |  |  |

## Decisao Rose

Status: Nao aprovado

Rose nao aprova intencao. Rose aprova evidencia.

Bloqueadores desta rodada:
- massa atual nao tem perfis nem itens pre-cadastrados: impossivel testar conciliacao, divergencias, aprovacao, previa e confirmacao
- CT-CON-02 e demais casos de conciliacao bloqueados por massa inadequada
- proxima rodada requer banco pre-semeado com perfis e itens, ou fluxo de resolucao de pendencias coberto antes da conciliacao
- Rose vai criar bateria complementar para mockups e contadores; incorporar quando disponivel
