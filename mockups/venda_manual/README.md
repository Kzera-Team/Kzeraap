# Mockups — Venda Manual

Pasta reservada para os mockups HTML da funcionalidade **Venda Manual** do KZERA.

## Diretriz

- Cada estado visual deve ser um arquivo HTML separado.
- Cada HTML deve ser independente, com CSS embutido no próprio arquivo.
- Os mockups devem seguir o manual UX aprovado em `docs/aprovados-lider/processo/manual-ux.md`.
- Dispositivo alvo: iPhone 11, viewport 414 × 896 px.
- Modal permitido: apenas bottom sheet.

## Estados previstos

1. `venda-manual-1-vazia-sem-perfil.html`
2. `venda-manual-2-vazia-com-perfil.html`
3. `venda-manual-3-item-adicionado-valido.html`
4. `venda-manual-4-item-estoque-insuficiente.html`
5. `venda-manual-5-bottom-sheet-lote-encerrado-divergente.html`
6. `venda-manual-6-pagamento-parcial.html`
7. `venda-manual-7-pronta-para-concluir.html`
8. `venda-manual-8-concluida-recibo.html`
9. `venda-manual-9-bottom-sheet-pagamento.html`
10. `venda-manual-10-confirmacao-pagamento-parcial.html`

## Decisões de Produto aplicadas

- Venda vazia não exibe bloco de pagamento.
- Perfil aparece compacto.
- Pagamento só aparece depois de item adicionado.
- Estoque insuficiente não exibe subtotal como válido.
- Lote encerrado e lote divergente ficam bloqueados no MVP.
- Pagamento parcial usa linguagem explícita: concluir com pendência.
- Pós-venda prioriza recibo e nova venda.
