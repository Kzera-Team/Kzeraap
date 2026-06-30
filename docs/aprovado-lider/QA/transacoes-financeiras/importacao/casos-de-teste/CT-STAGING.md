# CT-STAGING - QA Importacao de Transacoes

Status inicial: Aguardando evidencia

## CT-STG-01 - Importar CSV para staging

Objetivo: validar que o CSV entra em staging sem virar dado oficial.

Pre-condicao:
- sessao autenticada
- CSV valido
- dados oficiais antes do teste registrados

Passos:
1. Abrir Importacao de Transacoes.
2. Selecionar ou colar CSV.
3. Preparar registros.
4. Conferir resumo.
5. Conferir tabela de staging.
6. Comparar dados oficiais antes e depois.

Esperado:
- registros entram em staging
- nenhuma transacao oficial e criada
- nenhum pagamento oficial e criado
- nenhum movimento oficial e criado
- estoque nao muda

Obtido:
- 5 transacoes e 5 registros financeiros entraram em staging
- transacoesFinanceiras oficiais: 0 (antes e depois)
- pagamentosTransacao oficiais: 0 (antes e depois)
- movimentosFinanceiros oficiais: 0 (antes e depois)
- tela exibiu: "Arquivos preparados: 5 transacoes e 5 pagamentos" e "Financeiro oficial R$0"

Evidencias:
- arquivo de transacoes: vendas_qa.csv (5 linhas, clientes e produtos mascarados)
- arquivo financeiro: financeiro_qa.csv (5 linhas, clientes mascarados)
- print antes: prints/01-estado-inicial.png
- print tela vazia: prints/02-tela-importacao-vazia.png
- print arquivos selecionados: prints/03-arquivos-selecionados.png
- print staging preparado: prints/04-staging-apos-preparar.png

Status: Aprovado

## CT-STG-02 - Cliente inexistente vira pendencia

Objetivo: validar que cliente inexistente nao cria Perfil automatico.

Passos:
1. Confirmar que o Perfil nao existe.
2. Importar transacao com esse cliente.
3. Preparar registros.
4. Conferir status da linha.
5. Conferir lista de Perfis depois.

Esperado:
- status pendente de Perfil
- Perfil nao e criado automaticamente
- transacao nao vira oficial

Obtido:
- todos os 5 registros financeiros ficaram com status pendente_cliente
- nenhum Perfil foi criado automaticamente
- nenhuma transacao virou oficial

Evidencias:
- registros financeiros: {registrosImportacaoFinanceira: {pendente_cliente: 5, total: 5}}
- print: prints/04-staging-apos-preparar.png

Status: Aprovado

## CT-STG-03 - Item inexistente vira pendencia

Objetivo: validar que item inexistente nao cria Item automatico.

Passos:
1. Confirmar que o Item nao existe.
2. Importar transacao com esse item.
3. Preparar registros.
4. Conferir status da linha.
5. Conferir lista de Itens depois.

Esperado:
- status pendente de Item
- Item nao e criado automaticamente
- estoque nao muda

Obtido:
- todos os 5 registros de transacoes ficaram com tiposPendencia incluindo item_nao_encontrado
- nenhum Item foi criado automaticamente
- estoque nao foi alterado

Evidencias:
- registros transacoes: {registrosImportacaoTransacoes: {pendente_item: 5, total: 5}}
- print: prints/04-staging-apos-preparar.png

Status: Aprovado

## CT-STG-04 - Financeiro extrai numero da transacao

Objetivo: validar extracao de referencia no financeiro.

Massa sugerida:
- descricao: #459 - Pix

Passos:
1. Importar financeiro.
2. Preparar financeiro.
3. Conferir registro financeiro no staging.
4. Conferir numero extraido.

Esperado:
- numero 459 extraido
- numero disponivel para conciliacao

Obtido:
- campo numeroTransacaoReferenciado retornou "459" para o registro com descricao "#459 - Pix"
- numero disponivel no staging para conciliacao

Evidencias:
- dump staging financeiro: {numRef: "459", status: "pendente_cliente", pend: [...]}
- print: prints/04-staging-apos-preparar.png

Status: Aprovado

## CT-STG-05 - Retomar depois de fechar app

Objetivo: validar persistencia do staging.

Passos:
1. Importar registros.
2. Resolver parte das pendencias.
3. Fechar o app.
4. Abrir novamente.
5. Voltar para Importacao de Transacoes.

Esperado:
- staging continua disponivel
- pendencias resolvidas continuam resolvidas
- nao precisa importar tudo novamente

Obtido:
- apos page.reload() e novo login, staging continuou disponivel
- registrosImportacaoFinanceira total: 5 (igual antes do reload)
- registrosImportacaoTransacoes total: 5 (igual antes do reload)
- nao foi necessario reimportar

Evidencias:
- staging apos reload: {registrosImportacaoFinanceira: {pendente_cliente: 5, total: 5}}
- print apos reload: prints/06-staging-apos-reload.png (tela de login aparece, staging persistido no IndexedDB)

Status: Aprovado
