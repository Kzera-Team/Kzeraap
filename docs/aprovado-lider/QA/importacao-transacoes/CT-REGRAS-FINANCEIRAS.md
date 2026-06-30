# CT-REGRAS-FINANCEIRAS - QA Importacao de Transacoes

Status inicial: Aguardando evidencia

## CT-REG-01 - Importacao nao e confirmacao

Objetivo: validar que preparar arquivo nao cria dado oficial.

Esperado:
- nao cria transacao oficial
- nao cria pagamento oficial
- nao cria movimento oficial
- nao altera relatorio oficial
- nao altera estoque
- nao altera lote

Obtido:

Evidencias:

Status: Aguardando evidencia

## CT-REG-02 - Validado nao vira oficial sozinho

Objetivo: validar que status validado e apenas tecnico.

Esperado:
- validado nao confirma registro
- somente aprovado para confirmacao pode seguir para oficializacao

Obtido:

Evidencias:

Status: Aguardando evidencia

## CT-REG-03 - Previa obrigatoria

Objetivo: validar que existe previa antes da confirmacao.

Esperado:
- previa mostra quantidades, bloqueios, pendencias e totais
- previa informa que nao mexe no estoque
- detalhes tecnicos ficam separados

Obtido:

Evidencias:

Status: Aguardando evidencia

## CT-REG-04 - Mudanca depois da previa bloqueia confirmacao

Objetivo: validar que a previa congelada nao pode ser confirmada se o staging mudar.

Esperado:
- sistema bloqueia a confirmacao
- sistema pede nova previa

Obtido:

Evidencias:

Status: Aguardando evidencia

## CT-REG-05 - Duplicidade nao infla resultado

Objetivo: validar que duplicidade nao aumenta numeros financeiros.

Esperado:
- duplicado fica bloqueado ou em revisao
- totais nao sao inflados
- quantidade de vendas nao e inflada

Obtido:

Evidencias:

Status: Aguardando evidencia

## CT-REG-06 - Estoque nao muda

Objetivo: validar regra critica de estoque.

Esperado:
- estoque antes igual depois
- lote antes igual depois
- quantidade disponivel antes igual depois

Obtido:

Evidencias:

Status: Aguardando evidencia
