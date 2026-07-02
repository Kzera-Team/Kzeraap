# Estoque — desenvolvimento

Módulo responsável por movimentação, ajuste, inventário, disponibilidade, lote e separação entre venda histórica e estoque operacional.

## Fluxos previstos

```text
movimentacao/
ajuste/
inventario/
lote/
relatorios/
```

## Estrutura por fluxo

```text
<fluxo>/
  README.md
  regras/
  mockups/
  fluxos/
  decisoes/
  pendencias/
```

## Diretrizes já conhecidas

- Estoque deve ser separado da tela principal de Item.
- Importação histórica financeira não deve mexer no estoque.
- Lote deve ter fluxo próprio quando necessário.
- Ajuste de estoque precisa ter motivo, rastreio e confirmação clara.

## Status

```text
Em planejamento documental.
Pendências permanecem pendentes até decisão específica do líder.
```
