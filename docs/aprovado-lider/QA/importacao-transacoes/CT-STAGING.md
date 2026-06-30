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

Evidencias:

Status: Aguardando evidencia

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

Evidencias:

Status: Aguardando evidencia

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

Evidencias:

Status: Aguardando evidencia

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

Evidencias:

Status: Aguardando evidencia

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

Evidencias:

Status: Aguardando evidencia
