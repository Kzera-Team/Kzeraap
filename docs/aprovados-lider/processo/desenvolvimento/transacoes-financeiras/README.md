# Transações financeiras — desenvolvimento

Módulo responsável por vendas, importações financeiras, conciliação, confirmações históricas, relatórios financeiros e demais fluxos ligados a movimentação financeira.

## Fluxos previstos

```text
importacao/
vendas/
conciliacao/
relatorios/
confirmacao-historico/
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

## Fluxo ativo agora

```text
importacao/
```

Status do fluxo de importação:

```text
Mockups: estruturalmente aceitos
Regras: preservadas e reorganizadas
QA: em validação paralela
Pendências técnicas: CT-REG-03 ainda pendente até correção Dev
Pendências Produto/UX: ações ausentes permanecem pendentes
```

## Regra do módulo

Transação financeira importada não vira dado oficial automaticamente.

Importação histórica financeira deve passar por staging, revisão, prévia segura e confirmação explícita.

Enquanto não houver confirmação segura aprovada por QA, dados importados permanecem em staging ou pendência.
