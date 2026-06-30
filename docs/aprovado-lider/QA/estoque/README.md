# Estoque — QA

Validação do módulo Estoque.

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
  casos-de-teste/
  rodadas/
  evidencias/
  validacao-rose/
  pendencias/
```

## Critérios gerais

- Importação histórica financeira não deve alterar estoque.
- Movimentação de estoque precisa ter origem clara.
- Ajuste manual precisa ter motivo e confirmação.
- Lote não deve mudar sem fluxo explícito.

## Status

```text
Em planejamento documental.
Nenhum fluxo deste módulo está aprovado por Rose sem evidência própria.
```
