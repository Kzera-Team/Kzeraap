# Laudo versão 02 — Recuperação funcional dispersa

## Identificação

- **Versão:** 02
- **Nome:** Recuperação funcional dispersa
- **Bases citadas:** commits e branches de Item, Estoque, Pesagem, Importações e Financeiro.
- **Função:** conferir lacunas funcionais antes de promover código para branches de módulo.

## Escopo encontrado

A versão 02 representa o material funcional espalhado em commits e branches anteriores. Ela não deve substituir a versão 01 inteira; deve ser usada como fonte de comparação dirigida para recuperar o que estiver faltando.

Módulos cobertos:

1. Produto/Item.
2. Estoque.
3. Pesagem/Balança.
4. Importações.
5. Importação de venda/transação/financeiro.

## Evidências principais

- `9424ff6` restaurou `ReprocessarPendenciasItemNomeUseCase` e correções de qualidade de Item.
- A sequência `a029662`, `216e0a8`, `e4b75cc`, `5e23a6`, `89752b3` e `eb29808` compõe a evolução de Estoque/Lote.
- `fe22c82` corrigiu confirmação de pacote de importação com zero registros aprovados.
- Branches/documentos citados como `merge_produto_testes`, `testes_transacao_importar` e registros arquivados apontam conteúdo disperso de Produto, Importação e Financeiro.

## Decisão

Usar esta versão apenas para comparação e recuperação seletiva. A promoção deve seguir a cadeia:

```text
reconstrucao/02-item
└── reconstrucao/03-estoque
    └── reconstrucao/04-pesagem-balanca
        └── reconstrucao/05-importacoes
            └── reconstrucao/06-importacao-financeira
```

## Conflitos conhecidos

- `ReprocessarPendenciasPerfilUseCase` foi adicionado em `bb0d9f4`, mas removido em `b0be2b3` por não autorização. Não recuperar sem decisão explícita.
- `ReprocessarPendenciasItemNomeUseCase` foi restaurado em `9424ff6` e deve ser preservado.

## Risco de regressão

Alto, se a recuperação for feita por merge amplo. A orientação é recuperar por módulo, arquivo e caso de uso, sempre comparando com a versão 01.

## Ação recomendada

Para cada módulo recuperado:

```bash
git diff --name-only work...HEAD
npm run check
npm run build
```
