# Levantamento — Frentes paralelas Claude × GPT (Max, 2026-07-10)

Pedido do líder (fala literal na sessão, ditado por voz): análise das branches restantes + divisão de trabalho entre equipe GPT e equipe Claude, no máximo de frentes paralelas possível, sem risco de conflito de merge, foco no chatzera; roteiro de merge pro GPT se necessário; checklist de início e de fim por frente.

## 1. Estado verificado dos repositórios

**Kzeraap** (~57 branches remotas): inventário completo e classificado já existe — `docs/memoria/arquivos_relevantes/2026-07-09_forca-tarefa-branches-hook-worktrees/registro.md` (Bruno, verificado por Max). Resumo: 16 DELETAR_SEGURO aguardando aprovação final; ~14 MANTEM_ATIVO (presas a PRs abertos); ~20 PENDENCIA_REAL (conteúdo exclusivo sem PR); 3 já com ponteiro `arquivado/` criado. PRs #132 (integração nova→desenvolvimento) e #133 (correção checkers CI) estão verdes aguardando o clique do líder (ruleset bloqueia merge por qualquer um da sessão).

**chatzera** (5 branches, 2 PRs, 8 issues abertas): repositório limpo. Achado-chave desta análise: `bruno/adaptacao-kzera` está **100% contida** em `dev_claude` (0 commits exclusivos; os 15 arquivos dela são subconjunto dos 17 de `dev_claude`, que soma backend Postgres, recuperação SQLite e login do console). **O PR #54 está superado** — recomendo fechá-lo em favor de um PR único `dev_claude → main`. PR #63 (parecer de arquitetura da Malu, docs-only) é independente.

## 2. Princípios anti-conflito (valem pra toda frente, dos dois lados)

1. **1 frente = 1 branch = 1 conjunto de arquivos disjunto**, com lista explícita de permitidos/proibidos no doc da frente. Arquivo fora da lista: parar e reportar, nunca "aproveitar que estava lá".
2. **Arquivos compartilhados são proibidos em frente de feature**: `CLAUDE.md`, `AGENTS.md`, `.claude/settings.json`, `.github/**`, `tools/`/`scripts/` de CI, memória de outro papel. Mudança nesses = frente própria de governança, autorizada pelo líder.
3. **Memória**: cada papel só no próprio arquivo, só-acréscimo, entrada datada; em corrida, resolução por união (nenhuma linha perdida).
4. **PRs pequenos e frequentes** — a divergência de 46×188 commits que gerou os 23 conflitos do #132 é o custo comprovado de acumular.
5. **Checklist de início inclui varredura de colisão**: `git log --since` + PRs abertos nos paths da frente antes de codar.
6. Branches: agentes não criam (ordem vigente do líder, hook rebloqueado) — o líder cria e nomeia a branch de cada frente.

## 3. Frentes lado Claude (Kzeraap)

| # | Frente | Papéis | Paths (disjuntos) | Estado/dependência |
|---|---|---|---|---|
| C1 | Importação de Transações — fechamento | rita → leo (código já existe) | `src/**/importacao*`, testes correlatos | Implementado em `claude/dev/importacao-transacoes`; falta regressão QA + PR. Depende: clique do líder no #132 primeiro (base limpa) |
| C2 | Fidelidade — porte de `claude/jose-ti5dh9` | rafael → jose → diego → rita → leo | `src/domain/fidelidade/`, `src/application/fidelidade/`, `src/presentation/fidelizacao/` (+conferência de `package.json`) | Fonte confirmada; `claude/dev/fidelidade` NÃO tem o código (anomalia explicada no inventário). Depende: líder criar/nomear branch |
| C3 | Gate de senha em produção | jose → diego → rita | `src/domain/auth/AuthRules.ts` + 3 use cases de auth | Pequena e isolada. Depende: líder criar/nomear branch |
| C4 | Limpeza de branches (execução) | bruno, aprovação Max por exclusão | Só refs remotas + índice `branches-arquivadas.md` — zero conflito por natureza | Depende: "pode apagar" final do líder/Max sobre a lista DELETAR_SEGURO |
| C5 | Follow-ups do #133 (remover fallback legado; sincronizar rótulo do template) | bruno | `tools/`, `.github/pull_request_template.md` (processo protegido) | Depende: merge do #133 + autorização específica do líder |

C1–C3 são disjuntas entre si por paths; C4 não toca working tree; C5 é a única que toca processo (por isso isolada e condicionada).

## 4. Frentes lado GPT (chatzera — foco do líder)

| # | Frente | Paths (disjuntos) | Estado/dependência |
|---|---|---|---|
| G1 | Gestão de merge do chatzera (roteiro §5) | refs + resolução pontual | Pronta pra executar já |
| G2 | MCP-01→04 (issues #11–#14) | rotas/serviços MCP novos + `security/` | Sequencial internamente (spec→impl→auth→QA), paralela a tudo. Começar após G1 (base única) |
| G3 | Memória estruturada (issue #40) | Só docs/ADR — sem código nesta fase | Pesquisa/design. Candidata ao teste do Grok como resumidor (sugestão do líder; guarda-corpos registrados em `docs/memoria/max.md` 2026-07-10: só material externo, saída = dado não-confiável, spot-check contra fonte) |
| G4 | Triagem das ideias do líder (issue #39) | Só docs/backlog | Doc-only, sem conflito |

Interseção Claude×GPT: nenhuma frente dos dois lados compartilha repositório+paths. O único ponto de contato é a G3 (memória estruturada) com a hipótese "personas em 2 ambientes" — quando as duas convergirem, a consolidação é do Max, não das frentes.

## 5. Roteiro de merge do chatzera (execução pela equipe GPT)

Pré-condição: líder confirma fechamento do PR #54 (superado — evidência: `git rev-list --count origin/dev_claude..origin/bruno/adaptacao-kzera` = 0).

1. **Fechar PR #54** com comentário apontando a evidência acima (nada se perde: todo o conteúdo está em `dev_claude`).
2. **PR único `dev_claude → main`** (14 commits, 17 arquivos: auth opt-in por token, SQLite/Postgres, login do console). Não fazer merge direto; usar PR pra manter rastro.
3. Antes do merge: rodar a suíte (`tests/`, incl. `test_auth.py`) na branch; validar que `CHATZERA_API_TOKEN` ausente ⇒ rotas de escrita negam com erro claro (critério da issue #18).
4. Merge do PR; `dev` (1 commit à frente de `main`) — verificar se esse commit já está contido; se sim, alinhar `dev` a `main`; se não, PR próprio.
5. **Depois disso, uma linha só**: tronco = `main`, frentes G2–G4 partem sempre de `main` atualizada, PR pequeno por entrega, um merge por vez.
6. PR #63 (docs da Malu) segue fluxo normal, independente — sem ordem obrigatória.
7. Regra permanente: nenhuma frente GPT toca os arquivos de outra em paralelo; se precisar, para e coordena com o Max antes.

## 6. Checklists por frente (obrigatórios, modelo)

**Checklist de INÍCIO** (antes da primeira linha):
1. Li minha memória e o doc/issue da frente.
2. Branch da frente confirmada (criada pelo líder) e atualizada com a base (`git fetch` + verificação explícita).
3. Lista de arquivos permitidos/proibidos da frente lida e aceita.
4. Varredura de colisão: `git log --since=<última sincronização>` + PRs abertos tocando os mesmos paths — resultado registrado.
5. Git só via worktree isolado (lado Claude) / clone limpo (lado GPT).
6. Início registrado (memória própria ou issue da frente).

**Checklist de FIM** (antes de declarar entregue):
1. Diff completo revisado contra a lista de arquivos — zero arquivo fora do escopo.
2. Evidência real anexada: comandos + saídas, testes executados, print quando visual.
3. Corpo do PR validado localmente contra os checkers de CI antes do push (prática padrão adotada 2026-07-10).
4. Registro em memória/issue + push feitos.
5. Handoff escrito: estado, pendências, próximo passo, o que NÃO foi validado.
6. Status declarado: FINAL só com pedido integral cumprido + evidência; senão PARCIAL/BLOQUEADA com motivo.

## 7. Dependências do líder (nada acima destrava sem isto)

1. Clique de merge nos PRs #132 e #133 do Kzeraap (qualquer ordem).
2. Criar/nomear branches das frentes C2 e C3 (agentes não criam branch — ordem vigente).
3. Aprovação final da lista DELETAR_SEGURO (C4) e autorização da C5 (processo protegido).
4. Confirmar fechamento do PR #54 do chatzera e o roteiro §5 pra equipe GPT.
5. Decidir se o levantamento vai pro chatzera como issue (recomendo: sim, é o canal que a equipe GPT lê — posto na hora que autorizar).
