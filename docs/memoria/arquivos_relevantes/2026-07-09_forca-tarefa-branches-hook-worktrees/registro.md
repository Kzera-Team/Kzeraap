# Registro — força-tarefa de branches: hook, inventário completo e recuperação de memória (2026-07-09)

Executado por Bruno (DevOps/Infra), a pedido do líder, roteado por Max (Tech Lead). Complementa (não substitui) o inventário já registrado por outra instância minha, em paralelo, em `bruno/organizacao-branches-2026-07-09` (branch separada, ainda não mesclada em `nova_desenvolvimento_de_n1` no momento deste registro) — ver seção "Achado de processo" abaixo.

## 1. Achado de processo — duas sessões Bruno rodando a mesma tarefa em paralelo

Durante o inventário, encontrei a branch `bruno/organizacao-branches-2026-07-09` (não existia na minha primeira contagem, apareceu depois), criada por outra instância minha executando exatamente esta mesma força-tarefa, no mesmo intervalo de tempo. Evidência:
- Commit `b05bf60` nessa branch, timestamp `2026-07-09T06:15:20Z` — muito próximo dos meus próprios commits de hook (`c2e4051` 06:10, `117b84f` 06:15:59).
- O conteúdo dela (`docs/memoria/arquivos_relevantes/2026-07-09_organizacao-branches/registro.md`) é um inventário de mérito equivalente ao meu, com os mesmos 5 candidatos "seguros" que eu derivei de forma independente (ver seção 3).
- Isso explica as corridas reais que enfrentei no arquivo compartilhado `.claude/settings.json` durante a Tarefa 1 (o arquivo mudava de conteúdo entre minha leitura e minha escrita, mais de uma vez, sempre revertendo pra uma versão parcial que eu mesmo já tinha corrigido) — sintoma clássico de dois processos escrevendo no mesmo working tree físico (mesma raiz documentada em memória: sessões-mãe/subagentes no mesmo container compartilham `.git` e podem compartilhar working tree).
- Resolvido tecnicamente usando `git hash-object`/`git update-index`/`git commit-tree` (plumbing) em vez de `Edit`+`git add` direto, pra travar o conteúdo correto no índice antes de qualquer nova sobrescrita, e conferindo com `diff` pós-commit antes do push.
- Não tratei a outra branch como sabotagem — é trabalho legítimo, só duplicado. Não apaguei nem toquei nela. Ela segue com trabalho em andamento (`bruno/organizacao-branches-2026-07-09` = MANTEM_ATIVO na tabela abaixo).
- **Recomendação a Max**: considerar se a próxima força-tarefa desse tipo deveria ser explicitamente atribuída a uma única instância, ou se duplicação paralela é aceitável como redundância — nesse caso específico as duas convergiram para a mesma conclusão nos itens centrais, então não houve dano além do atrito de edição concorrente.

## 2. Tarefa 1 — hook de proteção de branch (`.claude/settings.json`)

Autorização: fala literal do líder dada nesta sessão ("Podem ajustar esse hook para que somente a desenvolvimento não possa ser alterada"), roteada por Max, categoria 5 (redução de bloqueio de criação de branch — exigia autorização prévia, veio; manutenção/acréscimo da proteção de `main` — não exige, é autonomia padrão do Max).

Dois commits, ambos pushados para `nova_desenvolvimento_de_n1`:

1. `c2e4051` — libera criação de branch (`checkout -b`/`branch`/`switch -c`/`push -u`/`--set-upstream`) por completo; restringe o bloqueio de push/merge/checkout direto só a `desenvolvimento`.
2. `117b84f` — correção recebida de Max (citando o líder: "que eu lembro nao temos main. Se tiver mantem nela tbm.") — devolve `main` ao padrão de proteção junto com `desenvolvimento` (acréscimo de segurança, autonomia padrão do Max, sem necessidade de nova autorização do líder). Criação de branch continua liberada.

Conteúdo final validado com bateria de comandos simulados (branch nova = ALLOW; push/merge/checkout em `desenvolvimento`/`main` = BLOCK; push em branch de trabalho = ALLOW) e `jq . .claude/settings.json` (JSON válido). Evidência completa (diffs, testes) já reportada no chat da sessão.

## 3. Tarefa 2 — inventário e classificação (60 branches remotas no momento final, 59 na contagem inicial — a 60ª é a `bruno/organizacao-branches-2026-07-09` criada pela outra instância minha durante a força-tarefa)

Metodologia: para cada branch, (a) `git merge-base --is-ancestor <branch> desenvolvimento|nova_desenvolvimento_de_n1` (zero commit exclusivo = ancestral); (b) `git diff --shortstat <main>...<branch>` (três pontos — mudança NETA introduzida pela branch desde que divergiu; vazio = a branch não contribui nada de único, mesmo não sendo ancestral formal, porque o próprio conteúdo dela já é redundante); (c) cruzamento com os 13 PRs abertos hoje (API `GET /pulls?state=open`, `repo Kzera-Team/Kzeraap`); (d) cruzamento com `docs/memoria/max.md` ("Estado das frentes"/"Branches principais") e `docs/governanca/11_TRIAGEM_BRANCHES_PENTE_FINO.md`/`12_BRANCHES_PRINCIPAIS_ATIVAS.md`.

### DELETAR_SEGURO (candidatos — NADA apagado nesta rodada; aguardando aprovação do Max/líder)

| Branch | Evidência |
|---|---|
| `Prints1` | ancestral de `nova_desenvolvimento_de_n1` (`merge-base --is-ancestor` = sim; 0 commits exclusivos) |
| `auditoria_itens_templates` | diff 3-pontos vazio vs `desenvolvimento` E vs `nova_desenvolvimento_de_n1` |
| `claude/alterar-perfis` | diff 3-pontos vazio vs ambos |
| `claude/ana-t8q304` | diff 3-pontos vazio vs ambos |
| `claude/ana-ux-ai-intro-ns6epf` | diff 3-pontos vazio vs ambos |
| `claude/orquestrado_pilantra` | ancestral de `nova_desenvolvimento_de_n1` (contém histórico de apuração de governança, mas o conteúdo já está preservado no histórico de `n1_de_n1`, que é o merge-base — apagar o ponteiro não perde nada) |
| `dev` | diff 3-pontos vazio vs ambos |
| `importacao_trasacao_negocio` | diff 3-pontos vazio vs ambos |
| `jjjtestejoao-ui-patch-2` | ancestral de `nova_desenvolvimento_de_n1` |
| `jose/estoque-operacional-backend` | diff 3-pontos vazio vs ambos |
| `ux/importar-transacoes-mockup` | diff 3-pontos vazio vs ambos |
| `bruno/claude-md-agentes-regras-desenvolvimento` | ancestral de `desenvolvimento` |
| `docs/sync-memoria-governanca` | ancestral de `desenvolvimento` |
| `backup/pr-104-n1-20260705` | ancestral da branch `n1` (não de `desenvolvimento`/`n1_de_n1` diretamente — ressalva: só é "seguro" enquanto `n1` existir; reavaliar quando `n1` sair) |
| `worktree-agent-a13360d93c51d7b7c` | 2 commits exclusivos, todos meus (Bruno) — **já recuperados e preservados** em `docs/memoria/historico/bruno/02-recuperado-worktrees-2026-07-09.md` (commit `417d0fc`). Agora seguro. |
| `worktree-agent-a15332c63140e853f` | 11 commits exclusivos, todos meus (Bruno) — **já recuperados e preservados** no mesmo arquivo acima. Agora seguro. |

### MANTEM_ATIVO (não tocar)

| Branch | Motivo |
|---|---|
| `n1` | base de PR #104 (`n1`→`claude/dev/importacao-transacoes`) e PR #98 (`n1`→`desenvolvimento`), ambos abertos hoje; também branch de saída de PR #114 |
| `claude/dev/importacao-transacoes` | frente ativa nomeada em `max.md`; base do PR #104; conteúdo exclusivo real e substancial (103 arquivos, +6932/-364 vs `n1_de_n1`) |
| `claude/dev/fidelidade` | frente ativa nomeada em `max.md` — **ACHADO A REPORTAR**: diff 3-pontos vs `nova_desenvolvimento_de_n1` está **vazio** hoje (zero contribuição líquida), o que contradiz a premissa de que ela ainda carrega conteúdo exclusivo de Fidelidade. Não reclassifiquei sozinho — mantive `MANTEM_ATIVO` por instrução explícita do Max ("não tocar antes do merge"), só sinalizo a anomalia pra vocês confirmarem se o trabalho real já está em outro lugar |
| `bruno/claude-md-agentes-regras-n1` | PR #114 aberto (head) |
| `bruno/claude-md-agentes-regras-nova_desenvolvimento_de_n1` | PR #113 aberto (head) |
| `jjjtestejoao-ui-patch-5` | PR #100 aberto (head) |
| `criar_manual_ux_continuacao` | PR #93 (head) e #87 (base) abertos |
| `testes_transacao_importar` | PR #86 aberto (head) |
| `claude/produto-qjk4a4` | PR #85 aberto (head) |
| `fix_backup_import` | PR #81 aberto (head); já "decidido portar" (governança 11) |
| `claude/new-session-pv3jdm` | PR #80 aberto (head) |
| `claude/leia-agents-jose-rjkzjt` | PR #80 aberto (base) |
| `chatgpt-docs-update-20260627` | PR #70 aberto (head) |
| `bruno/organizacao-branches-2026-07-09` | outra instância minha, trabalho em andamento agora mesmo (ver seção 1) |

**Correção de referência — `novas_configuracoes` não existe mais.** O texto da tarefa citava essa branch como exemplo de MANTEM_ATIVO com PR aberto. Verificado via API: PR #108 (`novas_configuracoes`→`desenvolvimento`) já foi **mesclado** em 2026-07-04 (`merge_commit_sha e1720778...`), e a branch já não existe no remoto (`git ls-remote --heads` não lista). Informação desatualizada — nada a fazer aqui, só corrigindo o registro.

### PENDENCIA_REAL (conteúdo exclusivo real, sem PR, sem nota de abandono)

| Branch | Conteúdo |
|---|---|
| `claude/andre-jwlhbe` | feature real (suporte a TSX com Preact — tsconfig/vite.config/package.json/pnpm-lock), não existe em nenhum outro lugar hoje |
| `claude/jose-ti5dh9` | fonte decidida da Fidelidade ("decidido portar", governança 11), 15 arquivos, ainda não portado pra `n1_de_n1` |
| `devops/validar-pos-merge-ambiente` | doc real (`docs/operacao/VALIDACAO_POS_MERGE_AMBIENTE.md`, 10 linhas), não implementado em nenhum workflow atual (`.github/workflows/` não tem equivalente) |
| `worktree-agent-a05424a7188201de8` | 3 commits reais, mas são memória de **Claudette** (`docs/memoria/claudette.md`), não minha — não copiei nem editei (não é meu arquivo). Sinalizo pra vocês rotearem a recuperação a ela |
| `worktree-agent-ad815c15c034a1f5b` | 1 commit real, memória de **Léo** (`docs/memoria/leo.md`), mesma ressalva — não é meu arquivo |
| `jose/backup-button-static-sync`, `jose/backup-restore-use-existing-crypto` ⚠️ (crypto, relevante pra AppSec), `jose/git-qa-evidence-guard`, `jose/remover-html-importacao-ts` | conteúdo real de produto, sem PR — requer avaliação de mérito de produto/AppSec, não é decisão de infra |
| `claude/development-update-i3ufh7`, `claude/file-propagation-all-zvpmab`, `claude/greeting-k23j1m`, `claude/lucas-product-ai-kzera-26dklf`, `claude/oi-4kzzki`, `claude/teste-permissao-criar-branch-01959`, `claude/todo-implementation-srdegl` | conteúdo real, sem PR — requer avaliação de mérito de produto |
| `fix/apply-checklist-completa-canonico`, `fix/create-authenticated-app-canonico-5-partes` | conteúdo real, sem PR — requer avaliação de mérito de produto |
| `kzera-v0-19-51`, `merge_produto_testes` | conteúdo real, sem PR — `merge_produto_testes` é grande (108 arquivos) e já sinalizado pela governança 11 como "não avaliado a fundo" |

### INCERTO (evidência técnica não é suficiente pra classificar com segurança)

| Branch | Por quê |
|---|---|
| `bruno/pr-104-n1-check` | diff residual de só 2 linhas vs a branch `n1`, sem PR encontrado — parece artefato do saga do PR #104, mas não é ancestral nem diff literalmente vazio |
| `fix/pr-104-dev-readme-path` | diff residual de só 1 linha vs `n1`, sem PR — mesma situação |
| `codex/bump-version-0.19.51` | o bump (0.19.50→0.19.51) já ocorreu e foi revertido na própria história de `nova_desenvolvimento_de_n1` (passou por 0.19.52 e voltou a 0.19.50) — parece superado, mas o diff tip-a-tip não é literalmente vazio |
| `fix-auth-ui` | a feature (botão "recuperar backup") já foi resolvida por uma implementação **diferente e mais madura**, já presente em `n1_de_n1` (comparei as duas implementações linha a linha — abordagens incompatíveis, não é a mesma coisa reescrita) — parece superado, mas não é diff vazio |
| `jose/pr-guard-and-backup-button` | mesmo padrão do item acima: o workflow/scripts de PR guard já estão mesclados (rastro idêntico em `.pr-check/pr-guard-and-backup-button.md` na base atual); resta só a mesma implementação antiga de `backup-recovery-trigger.js` (superada) + 2 arquivos triviais |

## 4. Tarefa 3 — isolamento de pendência real

**Decisão: não consolidei tudo numa branch só.** O conjunto de `PENDENCIA_REAL` é heterogêneo demais pra juntar com segurança sem confundir dono/decisão:
- feature de código (Preact/TSX, sem dono declarado);
- fonte de frente já decidida e ativamente em posse do José (Fidelidade, Importação — essas eu nem toquei, são trabalho em andamento de outra pessoa, não "pendência esquecida");
- memória de outros agentes (Claudette, Léo) — não é meu escopo mexer;
- docs/propostas isoladas (validação pós-merge, checklist, auth canônica) sem dono claro;
- item de AppSec (crypto do José).

Forçar tudo numa `pendencias/consolidado-2026-07-09` misturaria essas categorias sem sentido e sem dono. Prefiro entregar a lista classificada (acima) e deixar Max decidir o corte — por exemplo, uma branch só para os itens "sem dono, sem PR, avaliação de produto pendente" (a maior parte da lista), mantendo José/Claudette/Léo de fora porque já têm dono ou já são de outro agente.

## 5. Achado à parte — memória recuperada (detalhe no arquivo principal)

13 commits meus de 2026-07-05, encalhados em `worktree-agent-a13360d93c51d7b7c` e `worktree-agent-a15332c63140e853f`, nunca alcançaram `nova_desenvolvimento_de_n1`. Recuperados sem edição em `docs/memoria/historico/bruno/02-recuperado-worktrees-2026-07-09.md` (commit `417d0fc`, pushado). Detalhe completo em `docs/memoria/bruno.md`, entrada 2026-07-09.

## 6. Nada apagado nesta rodada

Nenhuma branch foi excluída. Nenhuma branch além do trabalho já descrito foi criada por mim (não usei a liberação do hook pra criar branch de isolamento, dado a decisão da seção 4). Aguardando aprovação do Max pra qualquer exclusão da lista `DELETAR_SEGURO`.

## 7. Addendum — evidência pedida por Max: 3 exclusões condicionadas + explicação da anomalia `claude/dev/fidelidade`

Líder aprovou (via Max) apagar `fix-auth-ui`, `jose/pr-guard-and-backup-button`, `codex/bump-version-0.19.51`, condicionado a referência de recuperação confirmada. Feito, **nenhuma original apagada ainda** — só o ponteiro de recuperação, aguardando o "pode apagar" final do Max:

| Branch original | SHA | Ponteiro `arquivado/` criado | SHA do ponteiro |
|---|---|---|---|
| `fix-auth-ui` | `dadc59954ae40abaac973cc253e85ca5e99533bf` | `arquivado/fix-auth-ui-20260709` | idêntico |
| `jose/pr-guard-and-backup-button` | `62956223058ebfb732b2e605aeab8645be923d67` | `arquivado/jose-pr-guard-and-backup-button-20260709` | idêntico |
| `codex/bump-version-0.19.51` | `1a2d2c7ff053114b986fc03f4b47305342f362f4` | `arquivado/codex-bump-version-0.19.51-20260709` | idêntico |

Criados via `git push origin refs/remotes/origin/<branch>:refs/heads/arquivado/<nome>-20260709` (sem checkout, sem tocar HEAD compartilhado) e confirmados via `git rev-parse` nos dois lados (SHA igual). Recuperação, se precisar: `git checkout -b <nome-original> arquivado/<nome>-20260709`.

**Anomalia de `claude/dev/fidelidade` — explicação completa (não tocado, só investigado):**

- Tip da branch: `fe6eb1d` (2026-07-04 14:40:33 -0300), mensagem "Merge pull request #103 from jjjtestejoao-ui/n1" — é um merge de conteúdo de governança (`CLAUDE.md`, `docs/governanca/08_REGISTRO_DECISOES_MAX.md`, `proposta_ajuste_orquestrador.md`), **não** de feature.
- Único commit exclusivo da branch vs `nova_desenvolvimento_de_n1` é esse próprio merge, e o diff de três pontos (`git diff --shortstat n1_de_n1...claude/dev/fidelidade`) é **vazio** — o merge não introduz nenhuma mudança líquida além do que `n1_de_n1` já tem.
- Verifiquei a árvore completa da branch em busca de código de Fidelidade: só existem os 5 mockups HTML (`docs/mockups/fidelidade/*.html`) — e esses 5 arquivos são **byte a byte idênticos** aos já presentes em `nova_desenvolvimento_de_n1` (confirmado por hash de blob, `git rev-parse <branch>:<arquivo>` igual nos dois lados). Nenhum arquivo de código (`src/`) relacionado a fidelidade existe nesta branch.
- Comparando com `claude/jose-ti5dh9` (a fonte que `max.md` registra como "decidido portar" pra Fidelidade): ela SIM tem a implementação real, ausente em `claude/dev/fidelidade` — `src/domain/fidelidade/RegraFidelidade.ts`, 4 use cases em `src/application/fidelidade/`, 2 views + 2 templates + 2 CSS em `src/presentation/fidelizacao/`.
- **Conclusão**: `claude/dev/fidelidade` nunca recebeu o código real da feature — só os mockups (já sincronizados) e um merge de governança vazio de conteúdo. O trabalho valioso que o Max lembra ("handlers de resolução de pendência já implementados/testados") está em `claude/jose-ti5dh9`, ainda não portado — é essa branch que carrega a pendência real, não `claude/dev/fidelidade`. Não decidi nem toquei em nenhuma das duas — só devolvo a explicação pro Max decidir o que fazer com cada uma.
