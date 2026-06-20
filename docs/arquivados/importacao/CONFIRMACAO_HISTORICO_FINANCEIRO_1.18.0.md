# 1.18.0 — Confirmação histórica financeira

## Regra

A importação histórica confirmada cria dados definitivos de Transações e Financeiro, mas não baixa estoque e não altera lote.

## O que é preservado

Cada Transação histórica confirmada deve preservar:

- total/faturamento;
- valor pago;
- valor pendente;
- desconto;
- entrega;
- taxa;
- custo;
- lucro;
- período do primeiro registro ao último registro confirmado;
- vínculo com movimentações financeiras quando existir.

Esses valores entram no resumo financeiro histórico para consulta, mesmo quando custo e lucro vieram do sistema antigo e podem não refletir a realidade operacional perfeita.

## Bloqueios

A confirmação definitiva bloqueia:

- registro ignorado;
- registro já confirmado;
- registro sem dados normalizados;
- registro com pendência;
- registro com valor pago maior que zero sem financeiro vinculado;
- vínculo financeiro incompleto ou pendente;
- número de origem já confirmado.

## Baixa de estoque

Histórico importado não baixa estoque/lote. A baixa de estoque só vale para transações novas futuras, quando a regra própria existir.

## UX de baixo clique

A usuária confirma o lote financeiro aprovado de uma vez. Registros bloqueados ficam fora e são resumidos em avisos.
