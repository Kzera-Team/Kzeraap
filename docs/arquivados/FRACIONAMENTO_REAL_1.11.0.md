# 1.11.0 — Fracionamento real do lote

## Objetivo

Implementar a primeira operação real de fracionamento dentro da tela própria de lote.

A entrega segue a regra de versionamento oficial:

- segunda posição (`1.11.0`) representa implementação/alteração funcional relevante;
- terceira posição (`1.11.1`) fica reservada para correções pequenas em cima desta funcionalidade.

## O que foi implementado

- Formulário de fracionamento dentro da aba **Fracionamentos** do lote.
- Registro persistente do fracionamento no item/lote atual.
- Cálculo do equivalente na unidade base.
- Baixa automática da quantidade **guardada/a granel**.
- Criação de unidades fracionadas disponíveis.
- Data do fracionamento preenchida automaticamente, mas editável.
- Observação opcional.
- Bloqueio de fracionamento maior que o guardado/a granel disponível.
- Bloqueio de unidades inválidas ou fração sem tamanho.
- Listagem dos fracionamentos criados no lote.

## Regra operacional

Exemplo:

Lote com 300 g guardados/a granel.

Usuário registra:

- tamanho da fração: 1 g;
- quantidade: 100 unidades.

Sistema calcula:

- equivalente base: 100 g;
- guardado/a granel passa de 300 g para 200 g;
- fracionado criado: 100 g;
- fracionado disponível: 100 g;
- unidades disponíveis: 100 de 100.

## Teste da Usuária

A tela precisa responder rapidamente:

1. quanto ainda está guardado/a granel;
2. quantas unidades foram criadas;
3. quanto isso equivale na unidade base;
4. se a operação foi salva;
5. se houve erro por tentar fracionar mais do que existe.

A ação principal usa texto claro: **⚖ Registrar fracionamento**.

## O que não foi implementado ainda

- Pesagem rápida persistente.
- Cadastro/seleção de balança dentro da operação.
- Conferência real dos fracionamentos.
- Retirada interna real.
- Transações.

Esses itens continuam como Pendências futuras, não Backlog solto.

## Recomendação de próxima funcionalidade

A próxima versão funcional recomendada é:

**1.12.0 — Pesagem rápida persistente do fracionamento**

Motivo: depois que as unidades fracionadas existem, a próxima dor operacional é pesar rápido, salvar imediatamente, pausar, retomar e recuperar interrupção.
