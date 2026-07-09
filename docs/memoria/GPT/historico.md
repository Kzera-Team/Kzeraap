# Histórico — José GPT

Histórico resumido da atuação do **José GPT** (`agent_jose_dev_gpt`).

Local canônico atual: `docs/memoria/GPT/historico.md`.

Este arquivo registra o resumo organizado do que acontecer com o José no GPT.

Regras deste histórico:

- Registrar por acréscimo.
- Não apagar linhas antigas.
- Não copiar nem fundir conteúdo da memória do José atual.
- O José atual pode ser lido apenas para contextualização, quando autorizado pelo líder.
- O registro bruto correspondente deve ficar em `docs/memoria/GPT/bruto.md`.
- O caminho `.claude/agents/GPT/` foi usado inicialmente por engano e está descontinuado para memórias GPT.

## 2026-07-09 — Bootstrap da memória e do histórico do José GPT

### Resumo

O líder acionou o José GPT em contexto de urgência para a Importação de Vendas/Transações do Kzeraap. O agente consultou o Chatzera, identificou uma tarefa atribuída a `agent_jose_dev_gpt` e confirmou que se tratava de portar apenas o miolo funcional da Importação de Vendas/Transações, sem carregar o pacote completo histórico do PR #104.

Durante o alinhamento, o líder interrompeu a execução para contextualizar que este caso é histórico: foi a primeira vez que um agente pegou um chamado direcionado pelo Chatzera. O líder também explicou que existe uma confusão histórica entre o José/personagem usado em outro ambiente e o José usado no GPT.

### Decisões do líder

- Não registrar esse marco na memória antiga do José.
- Não alterar `.claude/agents/jose.md`.
- Não alterar `docs/memoria/jose.md`.
- Criar uma área separada para o José GPT.
- Manter a memória do José GPT sob as mesmas regras de preservação: acrescentar sem apagar.
- Criar um histórico resumido dentro da área GPT.
- Manter um arquivo bruto separado para registrar o conteúdo mais cru do que acontecer aqui.
- Permitir que o José GPT leia a memória/contexto do José atual apenas para se contextualizar, sem copiar nem “pegar” de lá.

### Ações executadas

- Criada a branch `agents/agent_jose_dev_gpt/gpt-memory-bootstrap` a partir de `desenvolvimento`.
- Criados inicialmente arquivos em `.claude/agents/GPT/` por orientação inicial, depois corrigida pelo líder.
- Local canônico corrigido para `docs/memoria/GPT/` porque `.claude/agents/` é área de configuração/inicialização dos agentes Claude.

### Ponto de atenção

Antes de qualquer atuação em código de produto, o José GPT deve separar claramente:

- contexto lido para entender o papel;
- memória própria do GPT;
- memória e inicializador do José atual, que não devem ser alterados nem copiados;
- área de configuração Claude (`.claude/agents/`) versus área de memória (`docs/memoria/`).

## 2026-07-09 — Contexto apontado pelo GPT personalizado

### Resumo

O líder esclareceu que, na configuração do GPT personalizado do José, o contexto não foi todo embutido como texto fixo. A configuração identifica o agente como José, desenvolvedor sênior responsável pelo módulo de Importação da Equipe KZERA, define o ID `agent_jose_dev_gpt` e orienta o agente a entrar no Git Bridge para ler mais detalhes do prompt/contexto.

### Decisão registrada

O José GPT deve deixar claro que opera com um modelo de contexto apontado: o GPT personalizado chama o papel e direciona a leitura do contexto no Git Bridge. Isso é diferente de carregar todo o conteúdo diretamente dentro da própria configuração inicial do GPT.

### Impacto operacional

Contexto embutido tende a estar disponível desde o início da conversa. Contexto apontado depende de acesso, leitura e interpretação na sessão. Depois de lido, pode ser usado como contexto de trabalho, mas o agente deve registrar o que efetivamente leu para evitar confundir referência externa com instrução já carregada.

## 2026-07-09 — Plano de testes da Importação de Vendas/Transações

### Resumo

O líder pediu ao José GPT para ler as tasks do Chatzera e montar apenas um plano de testes para a Importação de Vendas/Transações histórica, sem executar a implementação. O sistema Chatzera foi descrito pelo líder como algo criado para apagar o fogo do sistema de vendas do Kzeraap, ainda com nomes e fluxo operacional em estabilização.

### Contexto lido

- Tasks relevantes no Chatzera:
  - `task_317b933e`: fechamento funcional da Importação de Vendas/Transações em branch limpa.
  - `task_9616bc94`: portar miolo funcional da importação, atribuída a `agent_jose_dev_gpt`.
- Branch observada para diagnóstico: `agents/agent_maxzera_gpt_fone/pr-104-importacao-limpa`.
- Arquivo principal observado: `src/presentation/importacao/ImportacaoTransacoesFinanceiroView.ts`.
- Mockup observado: `docs/mockups/importar_transacoes.html`.

### Requisito UX reforçado pelo líder

O mockup aprovado pela UX deve ser usado como base integral de HTML. Não é permitido pegar pedaços, fatiar ou reinterpretar o layout. O ajuste esperado é mínimo: separar CSS quando necessário e integrar com JS/TypeScript, preservando estrutura e experiência aprovadas.

### Task criada

Foi cadastrada no Chatzera a task `task_8e534a7e`, intitulada `Plano de testes — Importação de Vendas/Transações histórica`, com owner `agent_reviewer` e reviewer `agent_maxzera_gpt_fone`.

### Observação

Nenhum código de produto foi alterado durante esta ação. A entrega foi apenas o cadastro do plano de testes como task no Chatzera.

## 2026-07-09 — Diretriz de registro compacto e retomada rápida

### Resumo

O líder orientou que tudo que o José GPT for pegando durante a investigação deve ser registrado na área GPT, mas de forma resumida e útil. A finalidade é reduzir tokens, evitar acúmulo excessivo de contexto na conversa e permitir que próximas instâncias do José retomem o trabalho sem reler todos os arquivos e mensagens.

### Regra operacional

- Registrar achados, decisões, tasks, branches, arquivos, riscos, critérios de aceite e próximos cuidados.
- Preferir resumo operacional a transcrição completa.
- Usar `historico.md` para síntese organizada.
- Usar `bruto.md` para registro mais cru, ainda filtrado e sem cadeia de pensamento interna.
- Não registrar ruído que não ajude uma próxima instância.

## 2026-07-09 — Correção de local das memórias GPT

### Resumo

O líder identificou que havia feito pequena confusão ao orientar a criação da pasta GPT dentro de `.claude/agents/`. Ele corrigiu que a pasta deve ficar em `docs/memoria/GPT/`, porque `.claude/agents/` também é usado como configuração/inicialização dos agentes Claude.

### Decisão registrada

- Local canônico para a memória do José GPT: `docs/memoria/GPT/`.
- A pasta `.claude/agents/GPT/` fica descontinuada e deve ser removida quando houver operação de delete disponível.
- Até a remoção física, qualquer conteúdo antigo em `.claude/agents/GPT/` não deve ser usado como fonte de memória.
