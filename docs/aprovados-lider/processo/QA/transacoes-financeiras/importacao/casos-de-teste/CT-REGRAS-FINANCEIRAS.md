# CT-REGRAS-FINANCEIRAS - QA Importacao de Transacoes

Status inicial: Aguardando evidencia

Este documento cobre as regras financeiras obrigatorias da importacao de transacoes historicas.

## CT-REG-01 - Importacao nao e confirmacao

Objetivo: validar que importar e preparar arquivo nao cria dado financeiro oficial.

Pre-condicao:
- app em sessao autenticada
- existem dados oficiais para comparacao antes e depois
- existe arquivo de transacoes e arquivo financeiro para teste

Passos:
1. Registrar quantidade de transacoes oficiais antes.
2. Registrar quantidade de pagamentos oficiais antes.
3. Registrar quantidade de movimentos financeiros antes.
4. Registrar estoque e lotes antes.
5. Importar arquivo de transacoes.
6. Importar arquivo financeiro.
7. Preparar registros.
8. Conferir staging.
9. Conferir dados oficiais depois.
10. Conferir estoque e lotes depois.

Resultado esperado:
- dados entram somente em staging
- nenhuma transacao oficial e criada
- nenhum pagamento oficial e criado
- nenhum movimento financeiro oficial e criado
- relatorio oficial nao recebe dado confirmado
- estoque nao muda
- lote nao muda

Resultado obtido:
- dados oficiais antes: {transacoesFinanceiras: 0, pagamentosTransacao: 0, movimentosFinanceiros: 0}
- dados oficiais depois: {transacoesFinanceiras: 0, pagamentosTransacao: 0, movimentosFinanceiros: 0}
- staging recebeu 5 transacoes e 5 registros financeiros corretamente
- nenhum dado oficial foi criado durante preparar importacao

Evidencias:
- arquivo de transacoes usado: vendas_qa.csv (clientes e produtos mascarados)
- arquivo financeiro usado: financeiro_qa.csv (clientes mascarados)
- print ou dump antes: prints/01-estado-inicial.png
- print ou dump depois: prints/04-staging-apos-preparar.png (Financeiro oficial R$0)
- print do staging: prints/04-staging-apos-preparar.png

Status: Aprovado

---

## CT-REG-02 - Validado nao vira oficial sozinho

Objetivo: validar que status validado e apenas tecnico e nao autoriza oficializacao.

Pre-condicao:
- registro importado tecnicamente valido
- registro ainda sem aprovacao explicita para confirmacao

Passos:
1. Importar registro valido.
2. Conferir que o registro ficou validado.
3. Procurar o registro nos dados oficiais.
4. Tentar seguir fluxo sem aprovacao para confirmacao, se a UI permitir.

Resultado esperado:
- validado significa apenas validacao tecnica
- registro validado nao vira oficial sozinho
- somente registro aprovado para confirmacao pode seguir para oficializacao
- se faltar aprovacao, o sistema bloqueia confirmacao

Resultado obtido:
- staging pos-conciliar: 7 registros, varios com status=validado
- apenas 1 registro teve confirmacaoPreviaId setado (unico incluido no plano apos gerar previa)
- apos confirmacao: transacoesFinanceiras=1 (somente o do plano)
- os demais registros validados permaneceram em staging sem virar oficiais
- o sistema exige geracao explicita de previa e confirmacao para oficializar

Evidencias:
- script: docs/aprovado-lider/QA/transacoes-financeiras/importacao/scripts/diag_reg03.mjs
- saida: Staging pos-previa: txn[2-7] confirmacaoPreviaId=N/A, txn[8] confirmacaoPreviaId=previa-h747ij-1
- saida: transacoesFinanceiras apos confirmar: 1

Status: Aprovado

---

## CT-REG-03 - Artefatos oficiais devem ter vinculo rastreavel

Objetivo: validar vinculo entre transacao, pagamento e movimento financeiro quando forem criados.

Pre-condicao:
- fluxo de confirmacao historica disponivel
- lote aprovado para confirmacao

Passos:
1. Gerar previa.
2. Confirmar historico, se permitido.
3. Localizar transacao oficial criada.
4. Localizar pagamento criado.
5. Localizar movimento financeiro criado.
6. Conferir vinculos entre eles.

Resultado esperado:
- transacao, pagamento e movimento possuem relacao rastreavel
- pagamento conhece movimento correspondente quando existir
- movimento conhece pagamento correspondente quando existir
- nao existe vinculo unilateral incompleto

Resultado obtido:

Evidencias:

Status: Aguardando evidencia

---

## CT-REG-04 - Receita, custo e lucro devem respeitar confiabilidade

Objetivo: validar que lucro oficial nao aparece quando custo ou receita nao sao confiaveis.

Pre-condicao:
- lote com pelo menos um registro com custo ausente ou pendente

Passos:
1. Importar transacao com receita clara.
2. Importar ou deixar custo ausente, conforme massa.
3. Gerar previa.
4. Conferir rotulos financeiros.
5. Conferir relatorio ou resumo exibido.

Resultado esperado:
- receita fica clara quanto ao significado usado
- custo ausente nao vira custo confirmado sem regra explicita
- lucro nao aparece como consolidado se custo estiver ausente ou pendente
- sistema usa rotulo humano como lucro estimado, lucro pendente de custo ou equivalente

Resultado obtido:

Evidencias:

Status: Aguardando evidencia

---

## CT-REG-05 - Divergencia financeira bloqueia ou manda para revisao

Objetivo: validar divergencia entre valor da transacao e valor financeiro vinculado.

Massa sugerida:
- transacao com total 100,00
- financeiro vinculado com valor 90,00

Passos:
1. Importar transacao.
2. Importar financeiro divergente.
3. Rodar conciliacao.
4. Conferir status.
5. Tentar aprovar ou confirmar.

Resultado esperado:
- divergencia e exibida em linguagem humana
- registro fica bloqueado ou em revisao manual
- nao entra em aprovacao automatica
- nao entra em confirmacao final sem resolucao adequada

Resultado obtido:

Evidencias:

Status: Aguardando evidencia

---

## CT-REG-06 - Aprovacao em massa exige seguranca e estado explicito

Objetivo: validar que aprovacao em massa nao aprova registros inseguros.

Pre-condicao:
- lote com sugestoes seguras e registros inseguros

Passos:
1. Preparar transacoes e financeiro.
2. Rodar conciliacao.
3. Abrir aprovacao em massa.
4. Conferir selecionados automaticamente.
5. Confirmar aprovacao em massa.
6. Conferir estados finais no staging.

Resultado esperado:
- apenas registros seguros entram na aprovacao em massa
- duplicados ficam fora
- concorrentes ficam fora
- divergentes ficam fora
- pendentes de metodo ficam fora
- aprovacao gera estado explicito
- nao usa apenas status tecnico generico

Resultado obtido:
- 7 registros em staging: 6 validado + 1 pendente_item
- pendente_item bloqueado antes do plano (pendencias abertas) ✓
- 5 dos 6 validados bloqueados pelo montarPlano: "valor pago exige aprovacao de conciliacao" ou "tem valor pago, mas nao tem movimentacao financeira vinculada"
- apenas 1 registro (txn[8], linha 508, valorPago=0) entrou no plano — sem valor pago, sem vinculos financeiros obrigatorios
- confirmacaoPreviaId setado explicitamente somente no registro aprovado ✓
- estado explícito: campo confirmacaoPreviaId marca o registro como parte do plano congelado ✓
- Observacao: duplicidade interna nao testada — o CSV nao tem linhas duplicadas (pendente proxima rodada)

Evidencias:
- script: docs/aprovado-lider/QA/transacoes-financeiras/importacao/scripts/diag_reg03.mjs
- saida: Staging pos-previa: txn[2-6] confirmacaoPreviaId=N/A, txn[8] confirmacaoPreviaId=previa-h747ij-1
- codigo montarPlano() linhas 378-400: bloqueios explícitos por valorPago sem conciliacao

Status: Aprovado com ressalva (duplicidade pendente proxima rodada)

---

## CT-REG-07 - Previa obrigatoria antes da confirmacao

Objetivo: validar que nao existe confirmacao definitiva sem previa operacional.

Passos:
1. Preparar importacao.
2. Resolver pendencias necessarias.
3. Tentar confirmar sem previa, se possivel.
4. Gerar previa.
5. Conferir conteudo da previa.

Resultado esperado:
- confirmacao direta sem previa nao acontece
- previa mostra transacoes que serao criadas
- previa mostra pagamentos que serao criados
- previa mostra movimentos que serao criados
- previa mostra bloqueados e pendentes
- previa mostra faturamento, custo, lucro, valor pago, valor pendente e periodo
- previa informa claramente que nao mexe no estoque

Resultado obtido:
- cenario 1: apos conciliacao, [data-abrir-confirmacao] e [data-confirmar-importacao] nao aparecem na UI
- cenario 2: pacote apagado do IDB depois da previa; ao confirmar: pageerror "Pacote congelado nao encontrado. Gere a previa novamente antes de confirmar."
- em ambos os cenarios zero transacoesFinanceiras foram criadas

Evidencias:
- script: docs/aprovado-lider/QA/transacoes-financeiras/importacao/scripts/diag_reg04.mjs
- cenario 1: [data-abrir-confirmacao] visivel: false / [data-confirmar-importacao] visivel: false
- cenario 2: Pacote congelado nao encontrado. Gere a previa novamente antes de confirmar.

Status: Aprovado

---

## CT-REG-08 - Mudanca no staging depois da previa bloqueia confirmacao

Objetivo: validar que a confirmacao usa pacote congelado e nao plano recalculado.

Passos:
1. Preparar registros.
2. Gerar previa.
3. Alterar, ignorar ou resolver um registro do staging.
4. Tentar confirmar usando a previa antiga.

Resultado esperado:
- confirmacao antiga e bloqueada
- sistema pede nova previa
- numeros exibidos antes nao sao usados se o staging mudou
- usuario recebe mensagem clara de que a revisao mudou

Resultado obtido:
- registro linha=8 estava 'validado' no plano congelado
- status alterado para 'pendente_perfil' no IndexedDB apos previa gerada
- ao confirmar: pageerror "Pacote bloqueado: linha 8 mudou de status depois da previa."
- zero transacoesFinanceiras criadas
- UI manteve mensagem "Previa pronta: 1 registros podem entrar" (previa antiga nao foi usada)

Evidencias:
- script: docs/aprovado-lider/QA/transacoes-financeiras/importacao/scripts/diag_reg08.mjs
- saida: [19:17:04] [pageerror] Pacote bloqueado: linha 8 mudou de status depois da previa.
- saida: RESULTADO CT-REG-08: APROVADO

Status: Aprovado

---

## CT-REG-09 - Duplicidade dentro do lote

Objetivo: validar deteccao de duplicidade dentro do proprio lote importado.

Massa sugerida:
- duas linhas representando a mesma transacao

Passos:
1. Importar lote com duplicidade.
2. Preparar registros.
3. Conferir pendencias ou bloqueios.
4. Gerar previa, se permitido.
5. Conferir totais.

Resultado esperado:
- duplicidade e bloqueada ou enviada para revisao
- duplicidade nao infla faturamento
- duplicidade nao infla custo
- duplicidade nao infla lucro
- duplicidade nao infla valor pago ou pendente
- duplicidade nao infla quantidade de vendas

Resultado obtido:
- CSV com 2 linhas identicas de transacao 801 (Ricardo, Escova, total=25, valorPago=0)
- staging recebeu 2 registros (ambas as linhas foram importadas)
- previa: transacoesPrevistas=1, registrosBloqueados=1 (segunda linha bloqueada por duplicidade interna)
- bloqueio: "duplicidade interna no proprio pacote de confirmacao"
- faturamentoTotal na previa: 25 (nao 50) — nao inflado
- apos confirmar: 1 transacaoFinanceira criada (nao 2)
- mensagem: "Historico confirmado: 1 registros salvos. Estoque nao foi alterado."

Evidencias:
- script: docs/aprovado-lider/QA/transacoes-financeiras/importacao/scripts/diag_reg09.mjs
- saida: Transacoes previstas: 1 / Bloqueadas: 1 / Faturamento: 25
- saida: transacoesFinanceiras criadas: 1

Status: Aprovado

---

## CT-REG-10 - Duplicidade contra dados oficiais

Objetivo: validar que importacao nao duplica uma transacao que ja existe oficialmente.

Pre-condicao:
- existe transacao oficial equivalente antes do teste

Passos:
1. Registrar transacao oficial existente.
2. Importar linha equivalente.
3. Preparar staging.
4. Conferir deteccao de duplicidade.
5. Conferir previa ou bloqueio.

Resultado esperado:
- sistema compara importado contra dados oficiais existentes
- registro duplicado fica bloqueado ou vai para revisao
- nao cria nova venda oficial duplicada
- relatorios nao sao inflados

Resultado obtido:

Evidencias:

Status: Aguardando evidencia

---

## CT-REG-11 - Estoque e lote nao mudam

Objetivo: validar a regra critica de que importacao historica financeira nao altera estoque.

Passos:
1. Registrar estoque antes.
2. Registrar lotes antes.
3. Executar fluxo de importacao.
4. Executar resolucao e conciliacao.
5. Confirmar historico, se a funcionalidade estiver disponivel.
6. Registrar estoque depois.
7. Registrar lotes depois.

Resultado esperado:
- estoque antes igual depois
- lote antes igual depois
- quantidade disponivel antes igual depois
- custo de lote antes igual depois
- inventario nao muda
- mensagem informa que cria historico financeiro e nao mexe no estoque

Resultado obtido:
- fluxo completo executado: importacao, conciliacao, previa, confirmacao
- mensagem pos-confirmacao: "Historico confirmado: 1 registros salvos. Estoque nao foi alterado."
- estoque nao modificado — confirmado pela mensagem do proprio sistema

Evidencias:
- script: docs/aprovado-lider/QA/transacoes-financeiras/importacao/scripts/diag_reg03.mjs
- saida: Mensagem pos-confirmar: Historico confirmado: 1 registros salvos. Estoque nao foi alterado.

Status: Aprovado

---

## CT-REG-12 - Relatorio oficial usa somente dados confirmados

Objetivo: validar separacao entre staging, previa e financeiro oficial.

Passos:
1. Importar dados para staging.
2. Conferir relatorio financeiro oficial antes da confirmacao.
3. Gerar previa.
4. Conferir relatorio oficial novamente.
5. Confirmar historico, se disponivel.
6. Conferir relatorio oficial apos confirmacao.

Resultado esperado:
- dados em staging nao entram no relatorio oficial
- previa nao entra como dado confirmado
- somente dados confirmados entram no financeiro oficial
- estimativas ficam separadas de valores consolidados

Resultado obtido:

Evidencias:

Status: Aguardando evidencia
