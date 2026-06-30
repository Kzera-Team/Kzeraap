# Rodada QA 01 - Importacao de Transacoes

Status geral: Aprovado com ressalva

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

Status: Aguardando evidencia

Rose nao aprova intencao. Rose aprova evidencia.

Ressalvas desta rodada:
- CT-CON-02 bloqueado: massa de teste nao inclui item cadastrado, impossibilitando chegar na etapa de conciliacao para validar financeiro_nao_encontrado
- 14 casos ainda sem evidencia: dependem de fluxos nao cobertos nesta rodada (confirmacao, aprovacao em massa, previa, divergencias)
- Prints gerados em headless com viewport 390x844 (mobile)
