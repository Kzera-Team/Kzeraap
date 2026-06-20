# 1.10.0 — Lote Operacional Base

## Objetivo

Criar a primeira etapa funcional do Lote Operacional sem iniciar Transações e sem misturar fracionamento/pesagem completa na mesma entrega.

## Regra de versionamento aplicada

A partir desta entrega:

- segunda posição (`1.10.0`, `1.11.0`) representa implementação ou alteração funcional relevante;
- terceira posição (`1.10.1`, `1.10.2`) representa correção de bug ou pequeno ajuste;
- governança anterior permanece válida, mas a próxima implementação funcional sai como `1.10.0`.

## Implementado

- Botão `📦 Lote` no card do item para abrir o lote ativo principal: ícone + texto, sem depender de ícone sozinho.
- Tela própria de lote operacional.
- Cabeçalho com item, variação e unidade base.
- Resumo físico do lote:
  - quantidade total;
  - guardado/a granel;
  - fracionado criado;
  - fracionado disponível;
  - disponível agora;
  - retirada interna.
- Resumo de custo:
  - custo total;
  - custo unitário;
  - valor de transação;
  - data de lançamento;
  - total de conferências;
  - total de retiradas.
- Abas de posição operacional:
  - Resumo;
  - Fracionamentos;
  - Pesagem;
  - Conferência;
  - Retirada interna.
- Funções de domínio para resumo operacional do lote.

## Não implementado ainda

Esta versão não implementa a operação completa de:

- criar fracionamento;
- pesagem rápida persistente;
- cadastro/seleção de balança;
- conferência real;
- retirada interna real.

Esses itens continuam como Pendências, não Backlog.

## Teste da Usuária

A tela agora dá um caminho claro para entrar no lote sem procurar dentro do cadastro do item. A usuária cansada consegue abrir o lote e ver o estado físico principal sem rolar dentro de uma ficha gigante.

Ainda não é permitido declarar estoque operacional completo, porque ações reais de fracionar, pesar, conferir e retirar seguem pendentes.
