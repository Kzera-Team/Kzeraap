# 1.13.3 — Correções pré-transações e operação noturna

Esta versão corrige riscos encontrados na auditoria pré-transações, sem ativar política de senha forte.

## Decisão sobre senha

A política de senha forte fica para a fase final, quando o sistema estiver pronto para uso real. Durante testes, a equipe não deve travar o fluxo com senha forte obrigatória.

## Correções aplicadas

- Perfis do app principal usam repositório seguro com payload protegido para campos pessoais quando IndexedDB está disponível.
- Backup obrigatório ganhou verificação periódica enquanto o app está aberto, sem depender apenas de troca de tela.
- Backup passou a incluir balanças/calibragens para não deixar pesagens apontando para balança inexistente após restauração futura.
- Campos numéricos passam a aceitar entrada PT-BR com vírgula, como `1,5`.
- Lote inicial com quantidade zero não fica mais como estoque ativo.
- Pesagem rápida não permite registrar mais pesos do que unidades fracionadas.
- A tela de pesagem mostra progresso `registrado/esperado` e sinaliza divergência/incompletude.
- A UI ganhou correção individual de peso no histórico da sessão.
- O visual recebeu modo de operação noturna: menos brilho, menos roxo forte, menos blur/sombra e mais legibilidade para uso prolongado de madrugada.

## Regra da Usuária

Se a usuária estiver às 3h da manhã, com dor de cabeça e ainda tiver duas horas de trabalho, a interface deve reduzir estímulo visual, preservar dados e sinalizar divergência sem obrigá-la a adivinhar o problema.

## Ainda pendente

- Política de senha forte final.
- Mitigação definitiva da dependência `xlsx` antes de expandir importação de Transações.
- Transações Base.
