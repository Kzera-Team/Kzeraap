# Requisito de Produto — MVP Importação Financeira

Responsável: Lucas — Produto IA
Status: proposta de Produto para análise do líder

## Problema de negócio

A importação financeira histórica ajuda a trazer vendas, pagamentos e movimentações antigas para o Kzera, mas o processo tem risco alto quando a usuária não entende o que está pendente, fecha o app no meio do fluxo ou confirma algo sem perceber.

O MVP precisa impedir que a usuária confirme dado oficial errado por cansaço, dúvida ou interrupção.

## Objetivo do MVP

Permitir que a usuária:

- retome uma importação interrompida;
- entenda pendências em linguagem simples;
- separe item duvidoso para revisão manual;
- descarte uma importação sem medo;
- siga para prévia/confirmar somente quando estiver segura.

## Entra agora no MVP

### 1. Retomada/recuperação de importação

Quando houver importação em andamento, prévia congelada ou confirmação interrompida, o sistema deve mostrar uma tela clara de retomada.

A tela deve informar que nada foi confirmado ainda, quando aplicável.

A usuária deve conseguir continuar revisão ou descartar a importação.

### 2. Resolução guiada de pendências

Pendências devem ser exibidas com texto compreensível.

Cada pendência deve explicar:

- o que aconteceu;
- por que importa;
- qual ação recomendada;
- quais ações estão disponíveis.

### 3. Marcar item para revisão manual

A usuária deve conseguir separar um item para revisar depois.

Item marcado para revisão manual não deve entrar em confirmação automática.

### 4. Descartar importação com confirmação simples

A usuária deve conseguir descartar uma importação em andamento.

Antes de descartar, o sistema deve confirmar com mensagem clara:

```text
Nenhum dado oficial será alterado.
```

## Fica para futuro

### 1. Aprovação em massa segura completa

Motivo: acelera o fluxo, mas aumenta risco de confirmação indevida enquanto a base do processo ainda está sendo validada.

### 2. Limpeza segura completa ao sair ou bloquear sessão

Motivo: envolve decisão de Produto, UX e AppSec. Para o MVP, basta existir descarte simples e retomada segura.

## Critério de sucesso de Produto

O MVP é bem-sucedido se a usuária cansada conseguir responder, sem ajuda externa:

```text
Onde eu parei?
O que deu problema?
O que posso fazer com este item?
Como separo para revisar depois?
Como descarto sem alterar nada oficial?
```

## Riscos se não existir agora

- usuária abandonar a importação;
- confirmar item errado;
- duplicar ou perder contexto após fechar o app;
- não entender pendência;
- chamar suporte ou líder para decidir algo que a tela deveria explicar.

## Decisão de Produto proposta

```text
MVP enxuto, seguro e compreensível.
Sem ação avançada enquanto a base ainda está sendo validada.
```

## Próximo responsável

Após aprovação do líder, Helena deve detalhar o fluxo UX com base neste requisito.
