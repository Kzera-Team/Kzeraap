# Memória — José GPT

Arquivo de memória operacional do papel **José GPT** (`agent_jose_dev_gpt`) dentro da área de memórias do Kzeraap.

Local canônico atual desta memória: `docs/memoria/GPT/jose.md`.

Este arquivo é separado da memória e do inicializador do José já existentes no projeto.

Regras:

- Não editar nem substituir `.claude/agents/jose.md`.
- Não editar nem substituir `docs/memoria/jose.md`.
- Nenhuma linha já escrita aqui deve ser removida.
- Correções, atualizações e mudanças de entendimento devem ser registradas por acréscimo.
- Esta memória existe para preservar a vivência específica do José no GPT, até decisão futura de unificação com outras memórias.
- O caminho `.claude/agents/GPT/` foi usado inicialmente por engano e deve ser considerado descontinuado para memória. `.claude/agents/` é área de configuração/inicialização dos agentes Claude.

## Registro

### 2026-07-09 — Primeiro chamado operacional assumido via Chatzera

- **Contexto:** o líder acionou o José GPT durante a retomada da Importação de Vendas/Transações no Kzeraap.
- **Marco histórico:** este foi registrado como o primeiro caso em que um agente pegou um chamado direcionado pelo Chatzera.
- **Tarefa relacionada:** `José — Portar miolo funcional da Importação de Vendas/Transações`, atribuída ao agente `agent_jose_dev_gpt`.
- **Direção operacional:** portar somente o miolo funcional da Importação de Vendas/Transações, sem puxar o pacote completo histórico do PR #104.
- **Observação de identidade:** o líder explicou que havia uma confusão entre a personagem usada em outro ambiente e o José usado no GPT. Esta memória separada foi criada para preservar a vivência específica do José GPT sem mexer no José atual.
- **Correção de local:** inicialmente esta memória foi criada em `.claude/agents/GPT/`, mas o líder corrigiu que isso era inadequado porque `.claude/agents/` é configuração de inicialização dos agentes Claude. O local correto passou a ser `docs/memoria/GPT/`.

### 2026-07-09 — Origem apontada do contexto do José GPT

- **Contexto do inicializador do GPT personalizado:** o José GPT foi configurado como “José — Desenvolvedor Sênior responsável pelo módulo de Importação da Equipe KZERA”, com ID operacional `agent_jose_dev_gpt` no orquestrador.
- **Direção do inicializador:** a configuração do GPT personalizado não contém todo o histórico do José dentro do próprio texto fixo. Ela aponta para o Git Bridge e orienta o agente a ler mais detalhes do prompt/contexto ali, absorvendo esse material como contexto operacional.
- **Decisão do líder:** deixar explícito que o contexto usado nesta sessão vem desse modelo apontado: o GPT personalizado aciona o José e manda buscar o contexto no Git Bridge, em vez de embutir tudo diretamente na configuração do GPT.
- **Implicação prática:** o contexto apontado só é seguro operacionalmente depois de ser lido na sessão. Até a leitura, ele é uma referência externa, não um conteúdo já carregado integralmente no comportamento do agente.
- **Regra para o José GPT:** quando depender de contexto apontado, registrar o que foi efetivamente lido e distinguir isso de instruções já embutidas no GPT personalizado.

### 2026-07-09 — Regra de registro compacto para próximas instâncias

- **Direção do líder:** tudo que o José GPT for descobrindo ou usando como contexto relevante deve ser registrado na área GPT durante o trabalho.
- **Forma esperada:** resumir o suficiente para economizar tokens, mas preservar a ideia, decisões, arquivos, tasks, branch, achados e próximos cuidados de forma que outra instância do José consiga retomar sem reler tudo do zero.
- **Separação:** `historico.md` mantém resumo organizado; `bruto.md` mantém registro mais cru, porém ainda compacto e sem cadeia de pensamento interna.
- **Objetivo:** evitar acúmulo excessivo no contexto da conversa e reduzir custo de recarregamento em instâncias futuras.
- **Regra prática:** registrar o que muda operação, escopo, teste, risco, UX, branch, arquivo, task, decisão do líder ou achado técnico; não registrar ruído irrelevante.

### 2026-07-09 — Local canônico corrigido para memórias GPT

- **Correção do líder:** a pasta criada em `.claude/agents/GPT/` deve sair dali, porque `.claude/agents/` é área de configuração/inicialização dos agentes Claude.
- **Novo local:** `docs/memoria/GPT/`.
- **Prática adotada:** memórias e registros do José GPT ficam em `docs/memoria/GPT/`; arquivos antigos em `.claude/agents/GPT/` devem ser ignorados e removidos quando houver ferramenta de delete disponível.
