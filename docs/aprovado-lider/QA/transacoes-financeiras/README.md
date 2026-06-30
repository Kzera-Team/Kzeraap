# Transações financeiras — QA

Validação do módulo de transações financeiras.

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
  casos-de-teste/
  rodadas/
  evidencias/
  validacao-rose/
  pendencias/
```

## Fluxo ativo agora

```text
importacao/
```

Status atual da importação:

```text
CT-REG-03: Reprovado / aguardando correção Dev
Casos sem ação de UI: Bloqueado por ausência de binding / aguardando decisão Produto-UX
Casos parciais por seletor/campo ausente: Parcial / aguardando refinamento futuro
Documentação QA: em organização / conteúdo preservado
Mockups e regras: estrutura aceita
```

## Critério Rose

A aprovação final do fluxo de importação histórica depende de nova rodada depois da correção do CT-REG-03.

Enquanto CT-REG-03 falhar, confirmação segura permanece bloqueada.
