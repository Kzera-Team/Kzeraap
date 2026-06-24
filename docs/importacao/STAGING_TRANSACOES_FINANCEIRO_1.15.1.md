# 1.15.1 — Staging de Transações e Movimentações Financeiras

## Objetivo

Antes de cadastrar transação nova ou baixar estoque, o app passa a preparar importações de transações e movimentações financeiras em uma área intermediária persistente.

Regra central:

> CSV → staging persistente → resolução de pendências → conciliação → confirmação definitiva.

Nada desta etapa baixa estoque.

## Regra financeira oficial

Este documento descreve o staging inicial de transações e movimentações financeiras.

As regras de negócio obrigatórias para confirmação histórica, impacto financeiro oficial, conciliação, receita, custo, lucro, pagamentos, movimentos financeiros, relatórios, recuperação de falha e desfazer lote confirmado ficam documentadas em:

- [REGRAS_FINANCEIRO_TRANSACOES_IMPORTADAS.md](./REGRAS_FINANCEIRO_TRANSACOES_IMPORTADAS.md)

Nenhuma confirmação histórica deve ser implementada ou aprovada considerando apenas este documento de staging.

## Planilha de transações

A importação reconhece colunas como:

- Número
- Status
- Data
- Data de Entrega
- Data de Vencimento
- Data do Pagamento
- Quantidade
- Descrição
- Desconto
- Entrega
- Taxa de Transações
- Total
- Valor Pago
- Custo
- Lucro
- Tipos de Pagamento
- Cliente
- Observação

A coluna Descrição pode conter mais de um item em múltiplas linhas, por exemplo:

```text
1g x Pérola (380,00)
1g x Topázio (380,00)
```

Cada item é extraído para staging. Se o item não existir no app, o registro fica pendente.

## Regra de cliente

Todo cliente de transação importada precisa existir como Perfil.

Se não existir Perfil correspondente, a transação fica como:

```text
pendente_cliente
```

O sistema não cria Perfil automaticamente durante a importação.

## Planilha financeira

A importação financeira reconhece colunas como:

- Data de Criação
- Data de Vencimento
- Data do Pagamento
- Descrição
- Valor
- Método de Pagamento
- Taxa
- Valor Pago
- Pago
- Categoria
- Cliente
- Tipo
- Observação
- Usuário
- Usuário do Pagamento

A descrição pode trazer referência da transação, por exemplo:

```text
#459 - Pix
```

O parser extrai o número 459 para futura conciliação.

## Estados de registro

- validado
- pendente_cliente
- pendente_item
- pendente_financeiro
- confirmado
- ignorado
- erro

## Usuária

A usuária pode importar, resolver parte das pendências, fechar o app e continuar depois sem importar tudo novamente.

Isso evita retrabalho e impede que dados incompletos contaminem transações finais.
