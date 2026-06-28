# Auxiliar 03 — Reuso e Duplicação

Use antes de criar novo componente, parser, use case, helper, repository ou validação.

## Regra

José deve procurar solução existente antes de criar nova.

## Evidência obrigatória

Registrar:

```txt
Onde procurei:
O que encontrei:
Decisão:
Por que reutilizei ou não reutilizei:
```

## Bloquear se

- criou componente duplicado;
- criou helper genérico com regra de negócio;
- duplicou validação de importação;
- criou novo fluxo sem verificar fluxo existente;
- copiou lógica para “resolver rápido”;
- deixou duas fontes de verdade.

## Aceitável criar novo se

- não existe solução equivalente;
- solução existente não atende e a diferença foi explicada;
- reuso aumentaria acoplamento indevido;
- criação foi autorizada e tem local correto.
