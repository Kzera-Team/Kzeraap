# QA — documentação aprovada pelo líder

Este diretório guarda validações, casos de teste, evidências e pareceres de QA.

## Regra estrutural

```text
Produto -> módulo -> fluxo -> tipo de documento
```

## Estrutura por fluxo

```text
<modulo>/<fluxo>/
  README.md
  casos-de-teste/
  rodadas/
  evidencias/
  validacao-rose/
  pendencias/
```

## O que entra aqui

- casos de teste;
- rodadas de QA;
- evidências de execução;
- prints de validação;
- parecer Rose;
- pendências de QA.

## O que não entra aqui

- regra de negócio original;
- mockup como fonte de produto;
- decisão de UX sem validação;
- implementação de Dev.

Esses itens pertencem a `docs/aprovado-lider/desenvolvimento/`.

## Status permitidos

```text
Aprovado
Reprovado
Bloqueado
Aguardando evidência
Aprovado com ressalva
Parcial
```

## Regra Rose

Pendência não vira aprovação.

Se uma validação depende de ação de outro papel, ela deve permanecer explícita como pendência.

Frase de controle:

```text
Não testei, então não aprovo.
```
