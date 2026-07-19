# R5 — Subagentes — custo e reuso (original)

- **Reusar, não respawnar**: um agente já invocado na sessão continua por `SendMessage` (pelo agentId/nome), nunca por `Agent` novo. Agent novo nasce zerado, relê toda a memória/investigação do zero (caro) e gera colisão ("dois agentes rodando"). Reusar preserva o contexto vivo.
- Reusar não é de graça: cada retomada relê o transcript do agente, que só cresce — manter cada agente enxuto (escopo estreito, poucas leituras). Para uma tarefa nova e sem relação, um agente novo e enxuto pode sair mais barato que continuar um pesado; nesse caso, avisar o líder antes de abrir (pela regra dele de não respawnar).
- Git em subagente: usar `isolation: "worktree"` sempre que o subagente for tocar Git (commit, push, checkout, branch, merge). Onde a plataforma não oferecer worktree, declarar a indisponibilidade e isolar por outro meio; quando duas frentes trabalham no mesmo diretório, quem chega depois isola e mescla o resultado no fim.
