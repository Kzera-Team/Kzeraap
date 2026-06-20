# Kzera 1.18.1 — Confirmação histórica segura e baixo clique

## Regra

A confirmação do histórico financeiro tem **prévia obrigatória** antes de gravar dados definitivos.

O histórico importado alimenta Transações e Financeiro com faturamento, custo, lucro, valor pago e valor pendente. O histórico **não baixa estoque** nem altera lote.

## Correções

- Confirmação definitiva exige `previaId` atual.
- Registro apenas `validado` não basta quando há valor pago; precisa conciliação aprovada.
- Valor pago é revalidado contra a soma das movimentações financeiras vinculadas.
- Deduplicação considera número da transação e também assinatura para registro sem número.
- Pagamento confirmado recebe o `movimentoFinanceiroId` de volta.
- A operação valida tudo antes e tenta rollback se falhar no meio.
- UI tem prévia, resumo de impacto e confirmação em lote, sem clique registro por registro.
- Vínculos podem ser expandidos/recolhidos em massa.

## UX Usuária

O fluxo correto é:

1. Pré-visualizar confirmação.
2. Conferir resumo: quantidade, faturamento, custo, lucro, pago, pendente e bloqueios.
3. Confirmar tudo que está apto em lote.

Sem obrigar a clicar transação por transação.

## Métricas preservadas

Preserva total/faturamento, custo, lucro, valor pago e valor pendente.
