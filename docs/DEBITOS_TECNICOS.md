

## Dívida Técnica — Importação

Criar `ImportacaoShell` compartilhado para telas de importação.

Motivo:

- reduzir duplicação entre Perfis e Transações;
- evitar novo layout dentro de tela antiga;
- centralizar `.import-page`, `.import-panel`, abas internas e botão de menu;
- facilitar manutenção futura.

Não fazer junto com bug urgente se aumentar risco de regressão.
