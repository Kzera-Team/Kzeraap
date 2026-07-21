# Laudo versão 03 — Experiência/UX e próximos módulos

## Identificação

- **Versão:** 03
- **Nome:** Experiência/UX e próximos módulos
- **Bases citadas:** mockups de Venda manual, mockups de Fidelidade e domínio inicial `Campanha`.
- **Função:** preservar a intenção visual e funcional para implementação futura sem contaminar módulos base.

## Escopo encontrado

A versão 03 reúne material de experiência e módulos ainda não totalmente integrados como fluxo real. Ela serve como referência para a etapa posterior à consolidação de Perfil, Item, Estoque, Pesagem, Importações e Financeiro.

Módulos cobertos:

1. Venda/Transação manual.
2. Fidelidade/Campanha.
3. Diretrizes de UX preservadas em mockups.

## Evidências principais

- `mockups/venda_manual` preserva os estados de venda manual, incluindo tela vazia, perfil selecionado, item válido, estoque insuficiente, lote divergente, pagamento parcial, conclusão e recibo.
- `docs/mockups/fidelidade` preserva dashboard, configuração, prêmio e visão individual de Fidelidade.
- `src/domain/campanha/Campanha.ts` fornece o início do domínio que pode sustentar Fidelidade/Campanha.
- Commits de Fidelidade citados: `0cb29e4`, `38b3467`, `e27c7a0` e `485eb83`.

## Decisão

Não misturar esta versão com a recuperação funcional da versão 02. Venda e Fidelidade devem entrar depois da cadeia de base:

```text
reconstrucao/07-vendas
└── reconstrucao/08-fidelidade
```

## Restrições

- Venda não pode baixar estoque sem regra explícita e teste.
- Fidelidade não deve ser acoplada a Venda antes do contrato de negócio estar definido.
- Mockup bom não é implementação pronta; deve virar caso de uso, domínio, apresentação e teste quando promovido.

## Risco de regressão

Médio a alto, se UX for implementada antes de congelar as regras de Estoque, Financeiro e Transação. O maior risco é criar fluxo visual bonito que contradiz a regra de estoque ou pagamento/movimentação.

## Ação recomendada

Antes de implementar:

```bash
npm run check
npm run build
```

Para mudança perceptível em tela, anexar evidência visual no PR.
