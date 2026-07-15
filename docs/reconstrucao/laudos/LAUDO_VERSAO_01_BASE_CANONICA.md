# Laudo versão 01 — Base canônica atual

## Identificação

- **Versão:** 01
- **Nome:** Base canônica atual
- **Base técnica:** branch local `work`
- **Função:** servir como referência estável para reconstrução e comparação dos módulos.

## Escopo encontrado

A versão 01 concentra o estado atual consolidado da branch `work`. Ela preserva a estrutura funcional já reunida no repositório e deve ser tratada como ponto de partida antes de reabrir qualquer trabalho disperso.

Módulos cobertos:

1. Cliente/Perfil.
2. Produto/Item.
3. Estoque subordinado a Item.
4. Pesagem/Balança subordinada a Estoque/Item.
5. Importações de Perfil, Item e transações financeiras.
6. Transações/Financeiro.
7. Mockups de Venda e Fidelidade preservados como entrada futura.

## Evidências principais

- `src/domain/perfil`, `src/application/perfil` e `src/presentation/perfil` sustentam Cliente/Perfil.
- `src/domain/item`, `src/application/item` e `src/presentation/item` sustentam Produto/Item.
- `src/domain/estoque` e casos de uso em `src/application/item` sustentam Estoque dentro de Item/Lote.
- `src/domain/operacao`, `src/application/operacao` e binder de pesagem sustentam Pesagem/Balança.
- `src/domain/importacao`, `src/application/importacao`, `src/presentation/importacao` e repositórios de staging sustentam Importações.
- `src/app/financeiro`, `src/domain/transacao` e `src/application/financeiro` sustentam Transações/Financeiro.

## Decisão

Usar a versão 01 como base para criar `reconstrucao/01-perfil` e iniciar a cadeia de branches. Nenhum módulo posterior deve nascer diretamente de uma base mais antiga sem comparar contra esta versão.

## Risco de regressão

Médio, se alguém pular esta base e recuperar código antigo diretamente. O risco principal é reintroduzir decisões já revertidas ou perder a documentação reorganizada.

## Ação recomendada

Antes de qualquer branch funcional:

```bash
npm run check
npm run build
git diff --name-only work...HEAD
```
