# Backlog — Rastreio financeiro de cripto e carteiras

Prioridade: média/alta.

## Ideia

No futuro, pagamentos em cripto e movimentações entre carteiras precisam preservar o rastro de origem do dinheiro.

O sistema deve permitir registrar que uma transação recebeu valor em cripto, que esse valor caiu em uma carteira, foi transferido, dividido, convertido ou sacado depois.

## Cenário 1 — perda simples

Transação: R$ 350.
Cliente paga equivalente em Bitcoin.
Após transferência/conversão, o valor realizado fica em R$ 346.

Por enquanto, o sistema só precisa estar preparado para registrar o evento. O cálculo automático da perda fica para depois.

## Cenário 2 — várias transações em uma carteira

Três pagamentos de transações entram na Carteira A e totalizam R$ 400.
Depois esse valor é dividido:

- R$ 250 para Carteira B;
- R$ 150 para Carteira C.

Mais tarde, cada carteira pode sacar ou converter para contas diferentes.

O sistema precisa preservar o vínculo entre os pagamentos originais e os movimentos seguintes.

## Regra futura

Não basta saldo por carteira. É necessário rastro do dinheiro.

O modelo futuro deve suportar:

- pagamentos agrupados;
- transferência entre carteiras;
- divisão de valores;
- alocação manual ou proporcional de origem;
- conversão;
- saque;
- comparação entre valor original e valor final realizado;
- identificação futura de gargalos e perdas.

## Decisão de arquitetura

A versão 1.14.1 não implementa cripto, mas cria ContaFinanceira e MovimentoFinanceiro para não fechar o caminho contra esse futuro.
