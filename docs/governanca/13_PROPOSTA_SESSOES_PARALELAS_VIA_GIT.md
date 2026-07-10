# 13 — Proposta: sessões paralelas independentes coordenadas via git

Status: PROPOSTA, não adotada. Registrado por Max em 2026-07-05, a pedido do líder ("avaliar todas as opções" sobre iniciar agentes em chats/instâncias separadas, coordenados via git como canal robusto).

## Ideia do líder

Em vez de só Max orquestrar subagentes dentro da própria sessão (via Agent tool, todos morrendo/nascendo junto com a sessão do Max), o líder poderia abrir uma sessão/chat separada por agente (José, Bruno, Rita, etc.), cada uma rodando em paralelo, com escopo bem definido, coordenando entre si e com o líder através de git (branches, PRs, `docs/memoria`, `docs/governanca`) em vez de depender de uma conversa ao vivo.

## Por que isso pode resolver problema real já visto nesta sessão

1. **Ponto único de falha.** Hoje, se a sessão do Max cair, tudo que não foi commitado/pushado se perde (mitigado com registro ao vivo, mas ainda é um único processo). Sessões paralelas independentes reduzem esse risco — a queda de uma não derruba as outras.
2. **Colisão de filesystem compartilhado.** Já registrado duas vezes nesta sessão (José e o próprio Max tiveram o `HEAD` local trocado por baixo, por outro processo no mesmo diretório). Se cada sessão do líder roda em ambiente/container próprio (a confirmar com Bruno — não tenho certeza técnica se "outro chat" implica outro container), o problema desaparece estruturalmente, não só é mitigado com `isolation: worktree`.
3. **Já estamos construindo a base pra isso.** `docs/governanca/12_BRANCHES_PRINCIPAIS_ATIVAS.md` (lista de branches), a autorização permanente de push em `docs/memoria/<papel>.md`, e o canal oficial de decisão via GitHub (Issue #106) já são exatamente os ingredientes que esse modelo precisa.

## O que precisa estar verdadeiro pra funcionar (condições, não garantias)

- **Escopo travado por sessão** (exigência que o próprio líder já citou): cada sessão só mexe no seu branch/arquivo, nunca no de outra — já é a regra padrão do projeto, mas com múltiplas sessões *de verdade* paralelas, o custo de uma violação de escopo sobe (duas sessões podem colidir sem ninguém no meio para perceber na hora).
- **Confirmação técnica de isolamento real** (pergunta pro Bruno, não resolvida aqui): uma sessão nova do líder roda em ambiente/container separado do de outra sessão, ou compartilha alguma camada (mesmo volume, mesmo host)? Se compartilha, o problema de filesystem pode reaparecer em outra forma.
- **Cada sessão precisa saber ler o estado das outras sem depender de chat ao vivo** — isso é literalmente ler `docs/memoria/<outro-papel>.md` e `docs/governanca/*` na branch autoritativa antes de agir, prática que já viramos regra nesta sessão.
- **Quem garante QA/evidência/gate quando não há um Max ao vivo acompanhando em tempo real?** Esse é o maior risco novo, não uma vantagem. Hoje eu bloqueio entrega sem evidência, no calor da hora. Com sessões assíncronas e paralelas, um agente pode avançar mais do que devia antes de alguém revisar. Mitigação possível: nenhuma sessão declara FINAL sozinha — todo FINAL depende de outra sessão (Max, Rita, Leo) ler e confirmar via comentário no PR/Issue, não só na própria memória.
- **Convenção de branch por sessão/frente** já existe em parte (`claude/<papel>/<frente>`, ver `AGENTS.md`) — precisaria ficar mais rígida se o número de sessões simultâneas crescer, pra não colidir nome de branch.

## Opções concretas, do menor ao maior risco

1. **Continuar como está** (Max orquestra subagentes via Agent tool, com `isolation: worktree` sempre que mexer em git) — menor risco, já em prática, mas não resolve o "ponto único de falha" da sessão do Max.
2. **Sessões paralelas só para trabalho já bem delimitado e de baixo acoplamento** (ex: uma sessão só de José numa frente de código isolada, tipo `claude/dev/fidelidade`, enquanto Max continua noutra sessão cuidando de governança) — risco médio, ganho real de paralelismo, ainda dá pra reconciliar via PR quando cada uma terminar.
3. **Múltiplas sessões de papéis diferentes today mesma frente/branch, coordenando só via git** — maior risco, exige que a mitigação de QA/evidência acima esteja resolvida antes, senão duas sessões podem pisar uma na outra sem ninguém perceber a tempo.

## Recomendação de Max

Começar pela opção 2, num caso real (ex: uma frente de José isolada), antes de generalizar. Perguntar ao Bruno, antes de qualquer coisa, se sessões diferentes do líder rodam em ambientes tecnicamente isolados — essa resposta muda a avaliação de risco inteira. Não recomendo pular direto pra opção 3 sem primeiro validar 2 com um caso real e sem resolver quem garante QA/evidência sem Max ao vivo.

## Pendências

- Confirmar com Bruno isolamento técnico real entre sessões/chats diferentes.
- Definir quem audita FINAL quando não há Max ao vivo na sessão que declara.
- Decidir, com o líder, se vale começar um piloto (opção 2) numa frente específica.
