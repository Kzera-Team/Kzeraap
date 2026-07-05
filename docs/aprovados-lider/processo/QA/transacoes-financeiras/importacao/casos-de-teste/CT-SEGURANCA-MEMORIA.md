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
- preview gerada com 1 transacao visivel ([data-previa-transacoes]=1)
- mensagem: "Previa pronta: 1 registros podem entrar."
- [data-abrir-confirmacao] visivel: true
- staging IDB antes: 7 registros
- apos logout ([data-testid="logout-button"]): tela de login apareceu
- apos reconectar e navegar para importacao:
  - [data-previa-transacoes]: null (memoria zerada)
  - [data-importacao-mensagem]: vazio (limpo)
  - [data-abrir-confirmacao] visivel: false (confirmacao nao exposta)
  - staging IDB depois: 7 registros (IDB persiste, so memoria foi zerada)

Evidencias:
- script: docs/aprovado-lider/QA/transacoes-financeiras/importacao/scripts/diag_seg02.mjs
- saida: Previa limpa apos bloqueio: ✓ (null)
- saida: Botao confirmar nao exposto apos bloqueio: ✓
- saida: Staging IDB persistiu: ✓

Status: Aprovado

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
