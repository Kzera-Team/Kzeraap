# Desenvolvimento — documentação aprovada pelo líder

Este diretório guarda documentação de produto e desenvolvimento já autorizada ou em análise pelo líder.

## Regra estrutural

```text
Produto -> módulo -> fluxo -> tipo de documento
```

## Módulos

```text
transacoes-financeiras/
perfil/
item/
estque/
fidelidade/
```

Observação: se uma pasta ainda não existir fisicamente, ela representa o padrão esperado para o próximo ciclo documental.

## Estrutura por fluxo

```text
<modulo>/<fluxo>/
  README.md
  regras/
  mockups/
  fluxos/
  decisoes/
  pendencias/
```

## O que entra aqui

- regras de negócio;
- fluxos funcionais;
- decisões do líder;
- mockups aprovados ou em análise;
- pendências de produto, UX, UI, arquitetura ou desenvolvimento.

## O que não entra aqui

- resultado de execução de QA;
- prints de validação Rose;
- rodadas de teste;
- status final de aprovação QA.

Esses itens pertencem a `docs/aprovado-lider/QA/`.
