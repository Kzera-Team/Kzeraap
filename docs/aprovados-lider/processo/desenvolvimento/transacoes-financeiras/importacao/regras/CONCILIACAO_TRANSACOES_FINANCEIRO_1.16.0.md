# Conciliação de Transações e Financeiro — 1.16.0

Objetivo: comparar o staging de transações com o staging financeiro antes de confirmar qualquer dado definitivo.

Escopo:
- cruzar por número de transação extraído da movimentação financeira;
- comparar valor, comprador/perfil e método;
- identificar movimentação sem transação correspondente;
- sugerir pagamento posterior provável quando houver valor pendente e movimento compatível em data posterior;
- manter tudo em memória autenticada, lendo payload protegido do staging.

Fora do escopo:
- confirmar transação definitiva;
- resolver pendências;
- baixar estoque;
- criar dados financeiros finais.
- Não cria tabela nova com dados sensíveis abertos.

Estados principais:
- conciliado;
- pendente sem financeiro;
- pendente sem transação;
- divergência de valor;
- divergência de perfil;
- divergência de pagamento;
- pagamento posterior provável;
- revisão manual.
