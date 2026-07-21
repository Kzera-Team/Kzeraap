# Item — QA

Validação do módulo Item.

## Fluxos previstos

```text
cadastro/
precificacao/
lote/
composicao/
identificacao/
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

- Item inexistente em importação deve gerar pendência quando a regra exigir Item já cadastrado.
- Alteração de Item não deve alterar estoque sem fluxo explícito.
- Preço, custo e lote precisam ter rastreio claro quando usados em venda ou importação.
- Terminologia deve usar Item no lugar de produto, salvo contexto legado autorizado.

## Status

```text
Em planejamento documental.
Nenhum fluxo deste módulo está aprovado por Rose sem evidência própria.
```
