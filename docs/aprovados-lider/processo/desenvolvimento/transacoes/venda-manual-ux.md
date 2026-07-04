# Documento UX — Venda Manual KZERA

## 1. Natureza deste documento

Este documento **não define o fluxo final da tela**.

Ele lista:

```text
- informações necessárias
- regras de negócio
- componentes possíveis
- estados da interface
- riscos de UX
- possibilidades de organização
```

A UX deve decidir a melhor solução visual e estrutural:

```text
- tela única
- tela em etapas
- modais
- bottom sheets
- tela separada para detalhes
- rodapé fixo
- cards
- qualquer outra composição mais adequada
```

As organizações sugeridas aqui são **possibilidades**, não obrigação.

---

## 2. Objetivo da Venda Manual

A Venda Manual precisa permitir registrar uma venda de forma clara, rápida e segura.

A tela precisa resolver:

```text
- cliente identificado ou venda sem cliente
- seleção de itens
- variação/lote
- quantidade
- validação de estoque
- preço
- desconto
- total
- pagamento
- conclusão
- recibo
```

A UX deve decidir como organizar esses blocos para reduzir erro e esforço.

---

## 3. Informações que a venda precisa conter

### Cliente / Perfil

A venda pode ter:

```text
- perfil selecionado
- venda sem cliente identificado
```

Informações possíveis:

```text
- código/apelido do perfil
- bairro, se ajudar na identificação
- WhatsApp, se fizer sentido no contexto
- opção de trocar/remover perfil
```

Regra importante:

```text
Nome real não deve aparecer por padrão.
Usar código/apelido sempre que possível.
```

---

## 4. Itens da venda

Cada item precisa ter dados suficientes para evitar erro.

Informações necessárias:

```text
- item
- variação
- lote, quando aplicável
- quantidade
- unidade exibida
- preço unitário
- desconto do item, se houver
- subtotal
- estoque disponível
```

Unidades atuais:

```text
- g
- ml
```

Regra interna:

```text
g na tela → mg no banco
ml na tela → ml no banco
```

Exemplos:

```text
0,5 g → 500 mg
1 g → 1000 mg
30 ml → 30 ml
```

A tela não deve fazer regra própria espalhada. Deve usar regra central do sistema.

---

## 5. Variação e lote

A venda precisa considerar:

```text
Item → Variação → Lote → Quantidade
```

A variação/lote deve fornecer:

```text
- unidade operacional
- estoque disponível
- preço sugerido
- status do lote
- bloqueio se lote estiver encerrado
- alerta se lote estiver divergente
```

A UX deve decidir se essa escolha aparece:

```text
- dentro do card do item
- em modal
- em bottom sheet
- em tela intermediária
```

---

## 6. Quantidade

A quantidade deve respeitar a unidade da variação.

Para `g`:

```text
Usuário vê/digita em gramas.
Sistema converte para miligramas antes de salvar.
```

Para `ml`:

```text
Usuário vê/digita em ml.
Sistema salva em ml.
```

Validações necessárias:

```text
- não aceitar valor negativo
- não aceitar zero para venda
- não permitir venda acima do estoque disponível
- converter corretamente antes de salvar
```

A UX pode mostrar apoio visual, por exemplo:

```text
Disponível: 12,5 g
Será baixado: 500 mg
```

Isso é sugestão, não obrigação.

---

## 7. Estoque

A venda manual precisa garantir:

```text
- estoque só baixa após concluir a venda
- venda cancelada não baixa estoque
- lote correto é registrado
- quantidade maior que estoque é bloqueada
- lote encerrado não pode ser usado
- divergência de lote deve gerar alerta
```

Estados necessários:

```text
- estoque OK
- estoque insuficiente
- lote encerrado
- lote divergente
- lote não selecionado
```

A UX define como exibir esses estados.

---

## 8. Preço e desconto

Cada item pode ter:

```text
- preço sugerido
- preço editado manualmente, se permitido
- desconto por item
```

A venda pode ter:

```text
- desconto geral
- total recalculado
```

Desconto pode aceitar:

```text
- valor fixo
- percentual
```

Se houver desconto alto, pode ser necessário:

```text
- motivo
- alerta
- confirmação
```

A UX define se desconto fica exposto, recolhido, em modal ou em ação dentro do item.

---

## 9. Resumo financeiro

A venda precisa mostrar:

```text
- subtotal
- desconto dos itens
- desconto geral
- acréscimo/taxa, se existir
- total final
```

Se houver cálculo de custo/lucro:

```text
- lucro estimado
- margem estimada
```

Mas lucro deve ser secundário. O total final é a informação principal.

---

## 10. Pagamento

A venda precisa permitir:

```text
- uma forma de pagamento
- mais de uma forma de pagamento
- venda paga
- venda parcial
- venda pendente/fiado
```

Informações necessárias:

```text
- forma de pagamento
- valor pago por forma
- total pago
- valor restante
- status do pagamento
```

As formas de pagamento devem vir de configuração, não hardcoded.

Exemplos possíveis:

```text
- Pix
- Dinheiro
- Cartão
- Fiado
```

A UX define se pagamento aparece direto na tela, em modal, bottom sheet ou etapa separada.

---

## 11. Observações

A venda pode ter observação opcional.

Usos:

```text
- detalhe operacional
- motivo de desconto
- instrução de entrega
- combinado com cliente
```

Não precisa ocupar espaço fixo se não for usado.

A UX pode decidir por:

```text
- campo recolhido
- modal
- campo simples no fim da tela
```

---

## 12. Conclusão da venda

Antes de concluir, o sistema precisa validar:

```text
- existe pelo menos um item
- estoque disponível
- lote válido
- total calculado
- pagamento coerente
- conversões corretas
```

Após concluir:

```text
- baixa estoque
- registra venda
- registra pagamento
- permite recibo
```

A UX deve decidir se existe confirmação final, modal, revisão ou outro padrão.

Ponto obrigatório:

```text
O estoque não pode ser alterado antes da conclusão da venda.
```

---

## 13. Recibo / pós-venda

Depois da venda, o sistema precisa permitir:

```text
- gerar recibo
- copiar resumo
- compartilhar
- enviar por WhatsApp, se aplicável
- iniciar nova venda
- abrir detalhes da venda
```

O recibo precisa conter:

```text
- loja
- data/hora
- cliente/código, se houver
- itens
- subtotal
- desconto
- total
- forma de pagamento
- aviso de documento não fiscal
```

A UX decide se isso aparece como tela de sucesso, modal ou tela separada.

---

## 14. Estados que a UX precisa desenhar

Estados mínimos:

```text
- venda vazia
- cliente selecionado
- venda sem cliente
- item adicionado
- item com erro de estoque
- lote encerrado
- lote divergente
- pagamento ausente
- pagamento parcial
- venda pronta para concluir
- venda concluída
- erro ao concluir
```

---

## 15. Possibilidades de organização

A UX pode avaliar:

```text
Tela única:
- bom para venda rápida
- risco de ficar carregada

Tela com etapas:
- reduz excesso visual
- pode aumentar toques

Modais/bottom sheets:
- bons para escolhas pontuais
- ruins se usados em excesso

Rodapé fixo:
- bom para manter total e ação principal visíveis
- precisa não esconder conteúdo

Cards:
- bons para itens da venda
- precisam ser compactos
```

Nenhuma dessas opções é obrigatória. A UX deve testar a melhor composição.

---

## 16. Componentes possíveis

Componentes que podem existir:

```text
- card de cliente
- botão venda sem cliente
- busca de perfil
- card de item no carrinho
- seletor de variação
- seletor de lote
- campo de quantidade
- campo de preço
- ação de desconto
- resumo financeiro
- bloco de pagamento
- observação recolhida
- confirmação
- recibo
```

---

## 17. Regras de segurança e consistência

```text
1. Não baixar estoque antes de concluir.
2. Não permitir venda acima do estoque.
3. Não permitir quantidade negativa.
4. Não permitir venda sem item.
5. Não mostrar nome real do perfil por padrão.
6. Não permitir lote encerrado.
7. Alertar lote divergente.
8. Registrar lote usado.
9. Registrar pagamento.
10. Evitar clique duplo em concluir.
11. Venda cancelada não altera estoque.
12. Conversão de unidade deve vir da regra central.
```

---

## 18. MVP necessário

Para MVP, a venda manual precisa cobrir:

```text
- cliente opcional
- item
- variação
- lote
- quantidade
- estoque
- preço
- total
- pagamento
- concluir venda
- recibo
```

Pode ficar fora do primeiro MVP:

```text
- promoção complexa
- comissão
- entrega avançada
- relatório dentro da venda
- múltiplos operadores
- tela financeira avançada
```

---

## 19. Critério de aprovação da UX

A tela será considerada boa se:

```text
- permite vender sem confusão
- reduz erro de estoque
- deixa o total claro
- não parece formulário gigante
- funciona bem no iPhone 11
- permite venda rápida
- deixa pagamento compreensível
- gera recibo sem esforço
- protege ações irreversíveis
```

---

## 20. Resumo para a UX

A tela de Venda Manual precisa conter todas as informações necessárias para registrar uma venda corretamente, mas **a UX deve decidir a melhor forma de apresentar isso**.

O objetivo não é empilhar campos.

O objetivo é permitir uma venda segura, rápida e clara.
