# CT-SEGURANCA-MEMORIA - QA Importacao de Transacoes

Status inicial: Aguardando evidencia

## CT-SEG-01 - Dados protegidos permanecem protegidos

Objetivo: validar que dados sensiveis nao sao criados fora do payload protegido.

Passos:
1. Importar arquivo com dados de cliente.
2. Preparar registros.
3. Resolver pendencias.
4. Conferir armazenamento e exibicao disponivel para QA.

Esperado:
- dados sensiveis continuam protegidos
- nenhum campo sensivel novo fica aberto fora do payload protegido
- dados descriptografados aparecem somente durante sessao autenticada

Obtido:
- localStorage inspecionado apos importacao: 0 chaves expostas fora do prefixo kzera-runtime e kzera-config
- campos acessiveis no IndexedDB sem autenticacao: apenas metadata (status, tiposPendencia, numeroTransacaoReferenciado, numeroOriginal, id, loteImportacaoId)
- dados do cliente e produto presentes somente em payloadProtegido (criptografado, AES-GCM)
- campos dadosBrutos e dadosNormalizados nao ficam em texto claro no IndexedDB

Evidencias:
- localStorage keys expostas: 0
- print apos importacao: prints/07-seguranca-posimportacao.png

Status: Aprovado

## CT-SEG-02 - Limpeza ao bloquear sessao ou sair

Objetivo: validar limpeza de dados sensiveis mantidos em memoria.

Passos:
1. Abrir tela com previa ou conciliacao visivel.
2. Bloquear sessao, sair ou limpar autenticacao.
3. Retornar ao app.
4. Conferir se dados sensiveis ainda aparecem sem autenticacao.

Esperado:
- previa sensivel e limpa
- conciliacao sensivel e limpa
- listas descriptografadas sao limpas
- snapshots temporarios sao limpos
- dados nao ficam expostos sem autenticacao

Obtido:
- nao foi possivel executar: bloqueio de sessao sem binding de UI na tela de importacao para observar limpeza de memoria

Evidencias:
- nenhum seletor de bloqueio de sessao acessivel durante tela de importacao

Status: Bloqueado — produto sem binding de UI

## CT-SEG-03 - Falha nao deixa dados abertos

Objetivo: validar que erro durante importacao ou confirmacao nao deixa dados sensiveis expostos.

Passos:
1. Iniciar fluxo com dados sensiveis.
2. Forcar erro controlado.
3. Conferir tela apos erro.
4. Conferir memoria ou estado visivel disponivel para QA.

Esperado:
- erro e tratado
- nao aparece tela preta
- dados sensiveis nao ficam expostos
- usuario recebe orientacao segura

Obtido:

Evidencias:

Status: Aguardando evidencia
