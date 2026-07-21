# Item — desenvolvimento

Módulo responsável por cadastro, edição, identificação, preço, composição e relação do Item com estoque e lote.

No KZERA, Item é o termo preferencial para o antigo conceito de produto, salvo contexto legado documentado.

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
  regras/
  mockups/
  fluxos/
  decisoes/
  pendencias/
```

## Diretrizes já conhecidas

- Cadastro e edição de Item devem ficar em tela própria.
- Estoque não deve ficar misturado dentro da tela principal de Item.
- Lote deve ter fluxo próprio quando necessário.
- Item inexistente em importação deve virar pendência, não criação automática sem regra.

## Status

```text
Em planejamento documental.
Pendências permanecem pendentes até decisão específica do líder.
```
