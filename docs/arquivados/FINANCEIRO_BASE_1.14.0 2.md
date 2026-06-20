# 1.14.1 — Esqueleto Financeiro Base

## Objetivo

Criar a fundação financeira antes da importação de transações, sem baixar estoque e sem iniciar transação nova.

A transação importada precisa bater com o sistema antigo em faturamento, custo, lucro, valor pago e pendências. Por isso o financeiro não pode nascer como texto solto de forma de pagamento.

## Decisão de Produto

Antes de importar transações de verdade, o app precisa entender:

- transação financeira;
- pagamento;
- movimento financeiro;
- conta financeira;
- status financeiro;
- valor pendente;
- origem importada/manual/conciliação.

## Regra da Usuária

A usuária não deve conferir tudo na cabeça. O sistema precisa mostrar depois se os totais batem ou não batem. O esqueleto financeiro existe para reduzir retrabalho e evitar conciliação mentirosa.

## Entidades criadas

### ContaFinanceira

Representa onde dinheiro entra, sai ou fica registrado.

Tipos preparados:

- manual;
- dinheiro;
- banco;
- carteira digital;
- cripto;
- outro.

Cripto existe como tipo arquitetural, mas não será implementado agora.

### TransaçãoFinanceira

Representa a parte financeira de uma transação importada ou futura.

Campos principais:

- clienteNome obrigatório;
- total;
- valor pago;
- valor pendente;
- custo;
- lucro;
- desconto;
- entrega;
- taxa;
- status financeiro;
- origem.

### PagamentoTransação

Representa um pagamento vinculado a uma transação.

Permite pagamento imediato, pagamento pendente, pagamento parcial e futura conciliação.

### MovimentoFinanceiro

Representa dinheiro entrando, saindo, abatendo, sendo ajustado, estornado, convertido ou transferido.

Esse modelo prepara integração futura com bancos e carteiras, mas sem implementar integração agora.

## Status financeiro

- pago;
- parcial;
- pendente;
- cancelado.

## O que não entra nesta versão

- importação real de CSV de transações;
- conciliação visual;
- transação nova manual;
- baixa de estoque;
- integração bancária;
- integração cripto;
- cálculo automático de perda em cripto.

## Próxima etapa

1.15.0 — Importação de Transações com prévia e validação financeira.


Regra crítica: esta versão não baixa estoque. A baixa fica para etapa posterior de transação/estoque.
