# Padrão estrutural documental KZERA

Status: padrão recomendado por Rose para análise do líder.

## Regra principal

A documentação deve seguir o produto.

Ordem oficial:

```text
Produto -> módulo -> fluxo -> tipo de documento
```

Exemplo correto:

```text
docs/aprovado-lider/desenvolvimento/transacoes-financeiras/importacao/mockups/
docs/aprovado-lider/desenvolvimento/transacoes-financeiras/importacao/regras/
docs/aprovado-lider/QA/transacoes-financeiras/importacao/casos-de-teste/
```

Exemplo errado:

```text
mockups/transacoes/importacao/
docs/importacao/
docs/aprovado-lider/QA/importacao-transacoes/
```

O exemplo errado mistura tipo de documento com módulo do sistema e dificulta rastreio.

## Primeiro nível

```text
docs/aprovado-lider/
  desenvolvimento/
  QA/
```

`desenvolvimento/` guarda definição do produto: regras, mockups, fluxos, decisões e pendências.

`QA/` guarda validação: casos de teste, rodadas, evidências, validações e pendências de QA.

## Módulos principais

```text
transacoes-financeiras/
perfil/
item/
estoque/
fidelidade/
```

## Estrutura dentro de desenvolvimento

```text
docs/aprovado-lider/desenvolvimento/<modulo>/<fluxo>/
  README.md
  regras/
  mockups/
  fluxos/
  decisoes/
  pendencias/
```

## Estrutura dentro de QA

```text
docs/aprovado-lider/QA/<modulo>/<fluxo>/
  README.md
  casos-de-teste/
  rodadas/
  evidencias/
  validacao-rose/
  pendencias/
```

## Status permitidos em QA

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

Se algo ainda depende de Dev, Produto, UX, UI, AppSec, Arquiteto ou Tech Lead, deve permanecer como pendência explícita.

## Responsabilidades

- Produto/líder decide escopo e prioridade.
- Desenvolvimento documenta regras, fluxos, decisões e mockups.
- QA valida com evidência objetiva.
- Rose não aprova sem teste ou evidência.

## Frase de controle

Não testei, então não aprovo.
