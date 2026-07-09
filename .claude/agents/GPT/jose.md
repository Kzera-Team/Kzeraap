# Memória — José GPT

Arquivo de memória operacional do papel **José GPT** (`agent_jose_dev_gpt`) dentro do contexto de agentes GPT.

Este arquivo é separado da memória e do inicializador do José já existentes no projeto.

Regras:

- Não editar nem substituir `.claude/agents/jose.md`.
- Não editar nem substituir `docs/memoria/jose.md`.
- Nenhuma linha já escrita aqui deve ser removida.
- Correções, atualizações e mudanças de entendimento devem ser registradas por acréscimo.
- Esta memória existe para preservar a vivência específica do José no GPT, até decisão futura de unificação com outras memórias.

## Registro

### 2026-07-09 — Primeiro chamado operacional assumido via Chatzera

- **Contexto:** o líder acionou o José GPT durante a retomada da Importação de Vendas/Transações no Kzeraap.
- **Marco histórico:** este foi registrado como o primeiro caso em que um agente pegou um chamado direcionado pelo Chatzera.
- **Tarefa relacionada:** `José — Portar miolo funcional da Importação de Vendas/Transações`, atribuída ao agente `agent_jose_dev_gpt`.
- **Direção operacional:** portar somente o miolo funcional da Importação de Vendas/Transações, sem puxar o pacote completo histórico do PR #104.
- **Observação de identidade:** o líder explicou que havia uma confusão entre a personagem usada em outro ambiente e o José usado no GPT. Esta memória separada foi criada para preservar a vivência específica do José GPT sem mexer no José atual.
- **Decisão do líder:** criar uma pasta `GPT` dentro de `.claude/agents/` e manter aqui a memória do José GPT, regida pelas mesmas regras de preservação das outras memórias.

### 2026-07-09 — Origem apontada do contexto do José GPT

- **Contexto do inicializador do GPT personalizado:** o José GPT foi configurado como “José — Desenvolvedor Sênior responsável pelo módulo de Importação da Equipe KZERA”, com ID operacional `agent_jose_dev_gpt` no orquestrador.
- **Direção do inicializador:** a configuração do GPT personalizado não contém todo o histórico do José dentro do próprio texto fixo. Ela aponta para o Git Bridge e orienta o agente a ler mais detalhes do prompt/contexto ali, absorvendo esse material como contexto operacional.
- **Decisão do líder:** deixar explícito que o contexto usado nesta sessão vem desse modelo apontado: o GPT personalizado aciona o José e manda buscar o contexto no Git Bridge, em vez de embutir tudo diretamente na configuração do GPT.
- **Implicação prática:** o contexto apontado só é seguro operacionalmente depois de ser lido na sessão. Até a leitura, ele é uma referência externa, não um conteúdo já carregado integralmente no comportamento do agente.
- **Regra para o José GPT:** quando depender de contexto apontado, registrar o que foi efetivamente lido e distinguir isso de instruções já embutidas no GPT personalizado.
