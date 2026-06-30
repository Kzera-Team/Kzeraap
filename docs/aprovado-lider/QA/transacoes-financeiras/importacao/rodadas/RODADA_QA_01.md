# Rodada QA 01 - Importacao de Transacoes

Status geral: Parcial — bloqueador ativo (CT-REG-03 reprovado, causa raiz identificada)

## Identificacao

- Data: 2026-06-30
- Branch testada: fix_backup_import
- Ambiente: local (Vite preview, porta 4174, headless Chromium via Playwright)
- Responsavel pela execucao: agente automatizado (script Playwright) + analise estatica de codigo
- Build ou versao: conforme package.json do branch fix_backup_import
- Documentacao usada: CT-STAGING.md, CT-CONCILIACAO.md, CT-REGRAS-FINANCEIRAS.md, CT-SEGURANCA-MEMORIA.md, CT-PENDENCIAS.md

## Evidencias gerais

- Pasta dos prints: docs/aprovado-lider/QA/transacoes-financeiras/importacao/evidencias/prints/
- Pasta dos videos: nao gerado nesta rodada
- Arquivos usados: vendas_qa.csv (5 transacoes mascaradas), financeiro_qa.csv (5 registros mascarados)
- Observacoes: dados sensiveis substituidos — clientes referenciados como Cliente 01 a 05, produtos como Produto A/B/C

## Comandos tecnicos

- TypeScript: nao executado isoladamente nesta rodada
- Build: Vite preview ativo na porta 4174
- Testes automatizados existentes: confirmacao-historico-financeiro-1184.test.cjs (passou)
- Analise estatica de codigo: ConfirmarImportacaoHistoricaFinanceiraUseCase.ts, ImportacaoStagingRepository.ts, RuntimeCleanup.ts, PayloadProvider.ts

## Resumo da rodada

- Total de casos mapeados: 30
- Aprovados: 8
- Reprovados: 1
- Bloqueados: 5
- Aguardando evidencia: 16

Nota: CT-REG-03 reprovado com causa raiz identificada via analise estatica — bloqueador para aprovacao dos demais CTs conforme instrucao Rose. Casos de staging e seguranca basica aprovados na rodada anterior com massa sem perfis/itens. Casos de conciliacao, pendencias com UI e confirmacao aguardam massa adequada e correcao do CT-REG-03.

## Casos da rodada

| Caso | Nome | Status | Evidencia | Observacao |
|---|---|---|---|---|
| CT-STG-01 | Importar CSV de transacoes para staging | Aprovado | prints/04-staging-apos-preparar.png |  |
| CT-STG-02 | Cliente inexistente vira pendencia | Aprovado | prints/04-staging-apos-preparar.png |  |
| CT-STG-03 | Item inexistente vira pendencia | Aprovado | prints/04-staging-apos-preparar.png |  |
| CT-STG-04 | Financeiro extrai numero da transacao | Aprovado | dump staging: numRef "459" |  |
| CT-STG-05 | Retomar importacao depois de fechar app | Aprovado | prints/06-staging-apos-reload.png |  |
| CT-CON-01 | Conciliado | Aguardando evidencia |  | massa sem item cadastrado impede conciliacao |
| CT-CON-02 | Pendente sem financeiro | Bloqueado |  | pendente_item bloqueia antes da conciliacao |
| CT-CON-03 | Pendente sem transacao | Aprovado | dump staging: 2 registros sem numRef |  |
| CT-CON-04 | Divergencia de valor | Aguardando evidencia |  | exige massa com divergencia explicita |
| CT-CON-05 | Divergencia de perfil | Aguardando evidencia |  | exige massa com divergencia explicita |
| CT-CON-06 | Pagamento posterior provavel | Aguardando evidencia |  | exige massa com data posterior |
| CT-PEN-01 | Vincular pagamento posterior provavel | Aguardando evidencia |  | exige massa com data posterior |
| CT-PEN-02 | Marcar para revisao manual | Bloqueado |  | sem binding de UI para revisao manual |
| CT-PEN-03 | Ignorar registro | Aguardando evidencia |  |  |
| CT-PEN-04 | Aprovacao em massa segura | Bloqueado |  | sem binding de UI para aprovacao em massa |
| CT-REG-01 | Importacao nao e confirmacao | Aprovado | prints/04-staging-apos-preparar.png |  |
| CT-REG-02 | Validado nao vira oficial sozinho | Aguardando evidencia |  | exige massa com status validado |
| CT-REG-03 | Artefatos oficiais devem ter vinculo rastreavel | Reprovado | analise estatica — ver CT-REGRAS-FINANCEIRAS.md | releaseObject zera dadosNormalizados; hash diverge entre previa e confirmacao |
| CT-REG-04 | Receita custo e lucro respeitam confiabilidade | Aguardando evidencia |  |  |
| CT-REG-05 | Divergencia financeira bloqueia ou manda para revisao | Aguardando evidencia |  |  |
| CT-REG-06 | Aprovacao em massa exige seguranca e estado explicito | Bloqueado |  | sem binding de UI para aprovacao em massa |
| CT-REG-07 | Previa obrigatoria antes da confirmacao | Aguardando evidencia |  | bloqueado ate CT-REG-03 corrigido |
| CT-REG-08 | Mudanca no staging depois da previa bloqueia confirmacao | Aguardando evidencia |  | bloqueado ate CT-REG-03 corrigido |
| CT-REG-09 | Duplicidade dentro do lote | Aguardando evidencia |  |  |
| CT-REG-10 | Duplicidade contra dados oficiais | Aguardando evidencia |  |  |
| CT-REG-11 | Estoque e lote nao mudam | Aguardando evidencia |  | bloqueado ate CT-REG-03 corrigido |
| CT-REG-12 | Relatorio oficial usa somente dados confirmados | Aguardando evidencia |  | bloqueado ate CT-REG-03 corrigido |
| CT-SEG-01 | Dados protegidos permanecem protegidos | Aprovado | prints/07-seguranca-posimportacao.png |  |
| CT-SEG-02 | Limpeza ao bloquear sessao ou sair | Bloqueado |  | sem binding de UI para bloqueio de sessao na tela de importacao |
| CT-SEG-03 | Falha nao deixa dados abertos | Aguardando evidencia |  |  |

## Bloqueador principal

CT-REG-03 Reprovado — confirmar() lanca "Pacote congelado foi alterado ou corrompido."

Causa raiz confirmada via analise estatica:
- src/infrastructure/repositories/ImportacaoStagingRepository.ts:53 e :97
  registro.dadosNormalizados = payload.dadosNormalizados (referencia direta, sem structuredClone)
- src/infrastructure/repositories/ImportacaoStagingRepository.ts:141
  releaseObject(payload) no bloco finally zera TODAS as propriedades de payload.dadosNormalizados recursivamente
- resultado: registro.dadosNormalizados retornado para montarPlano tem todas as propriedades definidas como undefined
- src/application/importacao/ConfirmarImportacaoHistoricaFinanceiraUseCase.ts:162-167
  stableStringify trata undefined como string "undefined" via template literal (JSON.stringify(undefined) -> undefined -> "${undefined}" -> "undefined")
- src/runtime/PayloadProvider.ts:11
  JSON.stringify no packJson descarta propriedades com valor undefined
- resultado: hash computado na previa inclui "undefined" para cada campo; hash computado na validacao usa objeto sem essas chaves — divergencia inevitavel

Correcao necessaria (nao autorizada — encaminhar para Max):
- ImportacaoStagingRepository.ts linha 53: substituir referencia direta por structuredClone(payload.dadosNormalizados)
- ImportacaoStagingRepository.ts linha 97 (financeiro): idem

## Decisao Rose

Status: Aguardando — CT-REG-03 reprovado com causa raiz documentada. Nao aprovado enquanto bloqueador nao for corrigido.
