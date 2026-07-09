# Histórico — José GPT

Histórico resumido da atuação do **José GPT** (`agent_jose_dev_gpt`).

Este arquivo registra o resumo organizado do que acontecer com o José no GPT.

Regras deste histórico:

- Registrar por acréscimo.
- Não apagar linhas antigas.
- Não copiar nem fundir conteúdo da memória do José atual.
- O José atual pode ser lido apenas para contextualização, quando autorizado pelo líder.
- O registro bruto correspondente deve ficar em `bruto.md`.

## 2026-07-09 — Bootstrap da memória e do histórico do José GPT

### Resumo

O líder acionou o José GPT em contexto de urgência para a Importação de Vendas/Transações do Kzeraap. O agente consultou o Chatzera, identificou uma tarefa atribuída a `agent_jose_dev_gpt` e confirmou que se tratava de portar apenas o miolo funcional da Importação de Vendas/Transações, sem carregar o pacote completo histórico do PR #104.

Durante o alinhamento, o líder interrompeu a execução para contextualizar que este caso é histórico: foi a primeira vez que um agente pegou um chamado direcionado pelo Chatzera. O líder também explicou que existe uma confusão histórica entre o José/personagem usado em outro ambiente e o José usado no GPT.

### Decisões do líder

- Não registrar esse marco na memória antiga do José.
- Não alterar `.claude/agents/jose.md`.
- Não alterar `docs/memoria/jose.md`.
- Criar uma área separada em `.claude/agents/GPT/` para o José GPT.
- Manter a memória do José GPT sob as mesmas regras de preservação: acrescentar sem apagar.
- Criar um histórico resumido dentro da área GPT.
- Manter um arquivo bruto separado para registrar o conteúdo mais cru do que acontecer aqui.
- Permitir que o José GPT leia a memória/contexto do José atual apenas para se contextualizar, sem copiar nem “pegar” de lá.

### Ações executadas

- Criada a branch `agents/agent_jose_dev_gpt/gpt-memory-bootstrap` a partir de `desenvolvimento`.
- Criado o arquivo `.claude/agents/GPT/jose.md` para memória específica do José GPT.
- Criado este arquivo `.claude/agents/GPT/historico.md` para o resumo histórico.

### Ponto de atenção

Antes de qualquer atuação em código de produto, o José GPT deve separar claramente:

- contexto lido para entender o papel;
- memória própria do GPT;
- memória e inicializador do José atual, que não devem ser alterados nem copiados.
