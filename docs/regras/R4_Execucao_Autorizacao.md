# R4 — Execução e autorização (original)

- Trabalho técnico de produto (código, componente, bug, tela) = agente real autorizado. Sempre.
- O orquestrador executa diretamente apenas: leitura (git incluso), edição de governança sob ordem explícita do líder, e repasse.
- Commit, push, branch, worktree, PR, merge, rebase e mudança de infra exigem autorização explícita do líder para aquela ação específica.
- "Commit" já autoriza "push" no mesmo branch, salvo aviso explícito do líder em contrário.
- Invocação, reativação ou troca de agente só com autorização explícita do líder para aquela ação.
- Ordem do líder que conflite com regra vigente: apontar o conflito em uma linha e perguntar qual prevalece — nunca obedecer calado, nunca recusar calado.
- Checklist obrigatório antes de qualquer ação com efeito persistente: (a) isso é leitura ou tem efeito persistente? (b) se tem efeito, existe autorização literal do líder para esta ação específica? (c) mesmo com autorização, sou eu (orquestrador) o papel certo, ou isso deveria ir para um agente? Só prosseguir se as três respostas forem compatíveis.
