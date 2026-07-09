# Registro — organização de branches (força-tarefa 2026-07-09)

## Pedido do líder

Fala literal: "Precisamos organizar as branches. Mas não quero que o projeto fique parado esperando soluções minhas. Eu quero que os agentes façam uma força tarefa pra diminuir o número de branches e o que for pendência, fique isolado em uma branch nova e destrave o fluxo."

Coordenação (Max, `docs/memoria/max.md`, entrada 2026-07-09): rotear pra Bruno "hook + inventário das 59 branches + isolamento de pendência real, **sem exclusão nesta rodada**". Este documento cobre a parte de inventário/isolamento. A parte do hook está registrada em `docs/memoria/bruno.md` (entrada 2026-07-09) e no commit `c2e4051`.

Nenhuma branch foi apagada nesta rodada — isso ficou explicitamente fora de escopo por decisão do Max, até o time (ou o líder) revisar o mérito de cada uma.

## Estado em 2026-07-09 (repo `Kzera-Team/Kzeraap`)

`git fetch --all --prune` + `git branch -r` → **59 branches remotas**.

### Grupo 1 — redundantes, 100% já mescladas (candidatas seguras a apagar, mas NÃO apagadas nesta rodada)

Conteúdo já existe integralmente em `desenvolvimento` ou `nova_desenvolvimento_de_n1` (checado com `git branch -r --merged`). Apagar o ponteiro da branch não perde nenhum commit — o histórico continua alcançável pela branch de destino. Nenhuma tem PR aberto associado (checado via API `GET /pulls?state=open`).

| Branch | Mesclada em |
|---|---|
| `Prints1` | `nova_desenvolvimento_de_n1` |
| `claude/orquestrado_pilantra` | `nova_desenvolvimento_de_n1` |
| `jjjtestejoao-ui-patch-2` | `nova_desenvolvimento_de_n1` |
| `bruno/claude-md-agentes-regras-desenvolvimento` | `desenvolvimento` |
| `docs/sync-memoria-governanca` | `desenvolvimento` |

Nota sobre `claude/orquestrado_pilantra`: o histórico de commits dela é, em boa parte, registro de apurações de governança (tentativas de manipulação, achados de sessão anterior). Isso não é motivo para preservar o *ponteiro* da branch — o conteúdo já está preservado no histórico de `nova_desenvolvimento_de_n1` (mesclado, não apagado ao remover a branch). Registro aqui só para quem for decidir a exclusão não se assustar com o nome/conteúdo.

### Grupo 2 — 54 branches com commits únicos, não mescladas em nenhum dos dois destinos

Isso **exige avaliação de mérito de conteúdo** (o que é trabalho real pendente vs. sessão efêmera descartável) — não é decisão de infra, é decisão de Tech Lead/dono do produto. Agrupadas por padrão para facilitar a triagem:

**a) Sessões efêmeras de agente (`worktree-agent-*`)** — 4 branches, todas de `Claude`, commits entre 2026-07-05, 1 a 11 commits de diferença: `worktree-agent-a05424a7188201de8`, `worktree-agent-a13360d93c51d7b7c`, `worktree-agent-a15332c63140e853f`, `worktree-agent-ad815c15c034a1f5b`. Padrão de nome sugere worktree técnico de sessão, não branch de feature nomeada por humano.

**b) Patches do owner (`jjjtestejoao-ui-patch-*`)** — `jjjtestejoao-ui-patch-1` (28 commits), `-3` (1 commit), `-5` (1 commit, tem PR #100 aberto pra `n1`). `-patch-2` já está no grupo 1 (redundante).

**c) Branches `bruno/*` de governança em aberto** — `bruno/claude-md-agentes-regras-n1` (PR #114 aberto, base `n1`), `bruno/claude-md-agentes-regras-nova_desenvolvimento_de_n1` (PR #113 aberto, base `nova_desenvolvimento_de_n1`), `bruno/pr-104-n1-check` (sem PR aberto encontrado). Essas são minhas (Bruno) — não decido sozinho fechá-las, mas sinalizo que 2 têm PR aberto real.

**d) Branches `jose/*`** — 6 branches (`backup-button-static-sync`, `backup-restore-use-existing-crypto`, `estoque-operacional-backend`, `git-qa-evidence-guard`, `pr-guard-and-backup-button`, `remover-html-importacao-ts`), datadas de 2026-06-25/26, parecem feature/fix de produto real (backup, estoque, PR guard). `pr-guard-and-backup-button` já tem rastro em `.pr-check/pr-guard-and-backup-button.md` na base atual — pode já estar superada pelo que já foi mesclado (não confirmei linha a linha, é trabalho de triagem, não de infra).

**e) Branches `claude/*` de sessão nomeada** — 17 branches (ex.: `claude/dev/fidelidade`, `claude/dev/importacao-transacoes`, `claude/produto-qjk4a4`, `claude/leia-agents-jose-rjkzjt`, etc.), datadas de 2026-06-23 a 2026-07-05. Várias têm PR aberto (ver lista de PRs abaixo) — essas claramente não são descartáveis sem decisão de mérito.

**f) Demais soltas** — `auditoria_itens_templates`, `backup/pr-104-n1-20260705`, `chatgpt-docs-update-20260627`, `codex/bump-version-0.19.51`, `codex/fix-backup-recovery-script-path`, `criar_manual_ux_continuacao` (PR #93 aberto), `dev`, `devops/validar-pos-merge-ambiente`, `fix-auth-ui`, `fix/apply-checklist-completa-canonico`, `fix/create-authenticated-app-canonico-5-partes`, `fix/pr-104-dev-readme-path`, `fix_backup_import` (PR #81 aberto), `importacao_trasacao_negocio`, `kzera-v0-19-51`, `merge_produto_testes`, `n1` (PR #104 e #98 abertos), `testes_transacao_importar` (PR #86 aberto), `ux/importar-transacoes-mockup`.

### PRs abertos hoje (13, via API — não tocar nenhuma branch listada aqui sem checar esta lista primeiro)

```
114 | bruno/claude-md-agentes-regras-n1 -> n1
113 | bruno/claude-md-agentes-regras-nova_desenvolvimento_de_n1 -> nova_desenvolvimento_de_n1
107 | nova_desenvolvimento_de_n1 -> desenvolvimento
104 | n1 -> claude/dev/importacao-transacoes
100 | jjjtestejoao-ui-patch-5 -> n1
98  | n1 -> desenvolvimento
93  | criar_manual_ux_continuacao -> desenvolvimento
87  | desenvolvimento -> criar_manual_ux_continuacao
86  | testes_transacao_importar -> desenvolvimento
85  | claude/produto-qjk4a4 -> desenvolvimento
81  | fix_backup_import -> desenvolvimento
80  | claude/new-session-pv3jdm -> claude/leia-agents-jose-rjkzjt
70  | chatgpt-docs-update-20260627 -> desenvolvimento
```

## O que falta (não é decisão de infra, fica registrado como pendência pro time)

1. Alguém com visão de produto (Tech Lead/dono) precisa passar pelo Grupo 2 e marcar, por branch: "mesclar", "já superada/descartar" ou "manter aberta". Sem isso, apagar qualquer uma delas pode jogar fora trabalho real.
2. Depois dessa triagem, quem for autorizado apaga as branches marcadas como descartadas/já mescladas (inclusive as 5 do Grupo 1, que já são seguras hoje).
3. As 13 branches com PR aberto não devem ser apagadas enquanto o PR estiver aberto — fechar/mesclar o PR primeiro.

## O que foi feito nesta rodada (Bruno, infra)

- Inventário completo e categorizado das 59 branches (este documento).
- Cross-check com PRs abertos via API, pra não sinalizar como "descartável" nada que tenha PR vivo.
- Branch nova criada pra abrigar este registro e servir de ponto único de consulta, conforme pedido do líder ("o que for pendência, fique isolado em uma branch nova"): `bruno/organizacao-branches-2026-07-09`.
- Nenhuma branch apagada, nenhum merge feito, nenhuma decisão de mérito tomada por conta própria.
