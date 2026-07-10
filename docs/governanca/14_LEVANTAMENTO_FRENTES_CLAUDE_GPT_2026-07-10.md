# Levantamento — Frentes paralelas Claude × GPT (Max, 2026-07-10, rev. 2)

**Registro de revisão:** a rev. 1 (commit `45e70c9`) saiu com a divisão INVERTIDA (Claude no Kzeraap, GPT no chatzera). Correção literal do líder em 2026-07-10: a equipe **Claude fica no chatzera** — prioridade nº 1 dele hoje, porque é a ferramenta com que ele vai conseguir gerenciar o pessoal do GPT ("aqui, como a gente já se acertou, eu consigo tocar o projeto; lá não, é impossível"). Esta rev. 2 substitui a divisão da rev. 1 por ordem dele; a base factual (inventários, achados, princípios, checklists) não mudou.

Pedido original: análise das branches restantes + divisão de trabalho no máximo de frentes paralelas, sem risco de conflito de merge, com roteiro de merge pra quem precisar e checklist de início/fim por frente.

## 1. Estado verificado dos repositórios

**chatzera** (5 branches, 2 PRs, 8 issues): limpo. Achado-chave: `bruno/adaptacao-kzera` está **100% contida** em `dev_claude` (0 commits exclusivos; 15 arquivos ⊂ 17 — `dev_claude` soma backend Postgres, recuperação SQLite e login do console). **PR #54 superado** — fechar em favor de PR único `dev_claude → main`. PR #63 (parecer de arquitetura, docs-only) independente.

**Kzeraap** (~57 branches): inventário completo em `docs/memoria/arquivos_relevantes/2026-07-09_forca-tarefa-branches-hook-worktrees/registro.md` — 16 DELETAR_SEGURO aguardando aprovação, ~14 presas a PRs abertos, ~20 com pendência real. PRs #132/#133 verdes, aguardando clique do líder.

## 2. Princípios anti-conflito (todas as frentes, dos dois lados)

1. **1 frente = 1 branch = 1 conjunto de arquivos disjunto**, com lista de permitidos/proibidos. Arquivo fora da lista: parar e reportar.
2. **Arquivos compartilhados proibidos em frente de feature**: `CLAUDE.md`, `AGENTS.md`, `.claude/settings.json`, `.github/**`, tools/scripts de CI, memória de outro papel. Mudança nesses = frente própria de governança autorizada pelo líder.
3. **Memória**: só o próprio arquivo, só-acréscimo, entrada datada; corrida se resolve por união.
4. **PRs pequenos e frequentes** (custo comprovado de acumular: 23 conflitos e 46×188 commits no #132).
5. **Varredura de colisão no início**: `git log --since` + PRs abertos nos paths, antes da primeira linha.
6. Branch de frente: quem cria/nomeia é o líder (ordem vigente; hook rebloqueado no Kzeraap).

## 3. Frentes CLAUDE — chatzera (prioridade nº 1 do líder)

| # | Frente | Papéis Claude | Paths (disjuntos) | Estado/dependência |
|---|---|---|---|---|
| CZ1 | Unificação de branch: fechar PR #54 (superado) + PR único `dev_claude → main` + alinhar `dev` | bruno executa, max revisa | refs + resolução pontual | Pronta; depende só da confirmação do líder sobre o #54 |
| CZ2 | MCP-01→04 (issues #11–#14): spec → impl read-only → auth mínima → QA | rafael (spec) → jose (impl) → diego (auth) → rita (QA) | rotas/serviços MCP novos + `security/` + `tests/` correlatos | Após CZ1 (base única em `main`) |
| CZ3 | Memória estruturada (issue #40) — pesquisa + proposta/ADR | max coordena; pesquisa delegável; convergência com hipótese "personas em 2 ambientes" | docs/ADR only nesta fase | Paralela desde já; candidata ao teste do Grok como resumidor (guarda-corpos registrados) |
| CZ4 | Triagem das ideias do líder (issue #39) → backlog classificado | helena/produto + max | `docs/backlog/` | Paralela desde já, doc-only |
| CZ5 | Operacional/estabilidade: validação Postgres + deploy | bruno | `infrastructure/`, config de deploy | Limite conhecido: rede da sessão é default-deny (Railway inalcançável de dentro) — validação exige ambiente do líder ou CI |

CZ2–CZ5 têm paths disjuntos entre si; CZ1 vem antes de CZ2 pra todo mundo partir de `main` única.

## 4. Frentes GPT — Kzeraap (com roteiro rígido; revisão final sempre do Max via PR)

O controle que o líder tem "aqui" se mantém: toda frente GPT no Kzeraap entra por PR revisado pelo Max antes de merge — nenhum merge direto.

| # | Frente | Paths (disjuntos) | Roteiro |
|---|---|---|---|
| KZ1 | Limpeza de branches (lista DELETAR_SEGURO) | Só refs remotas + índice `branches-arquivadas.md` | Mecânica: tag `arquivado/<nome>-<data>` confirmada no remoto → apagar original → registrar no índice. Zero conflito por natureza. Depende: aprovação final do líder/Max da lista |
| KZ2 | Fidelidade — porte de `claude/jose-ti5dh9` | `src/domain/fidelidade/`, `src/application/fidelidade/`, `src/presentation/fidelizacao/`, conferência de `package.json` | Copiar da fonte, conferir arquivo a arquivo contra a origem (hash), PR com evidência. `claude/dev/fidelidade` NÃO tem o código (anomalia documentada no inventário) |
| KZ3 | Importação de Transações — regressão QA + PR de fechamento | `src/**/importacao*` + testes | Código pronto em `claude/dev/importacao-transacoes`; roteiro = rodar suíte, registrar evidência, PR. Depende: clique do líder no #132 primeiro |
| KZ4 | Gate de senha em produção | `src/domain/auth/AuthRules.ts` + 3 use cases | Pequena e isolada; espec já registrada (crítico só em produção) |

Em espera (não delegar ainda): C5 da rev. 1 (follow-ups do #133 — processo protegido, precisa de autorização específica; recomendo manter no Bruno/Claude quando autorizada, é CI nosso).

Interseção Claude×GPT: nenhuma — repositórios diferentes por equipe. Ponto de contato único: CZ3 (memória estruturada) informa a hipótese "personas em 2 ambientes"; consolidação é do Max.

## 5. Roteiro de merge do chatzera (execução CLAUDE — CZ1)

1. Confirmação do líder: fechar PR #54 (evidência: `git rev-list --count origin/dev_claude..origin/bruno/adaptacao-kzera` = 0 — nada se perde).
2. PR único `dev_claude → main` (14 commits, 17 arquivos: auth opt-in por token, SQLite/Postgres, login do console). Nunca merge direto.
3. Antes do merge: suíte `tests/` (incl. `test_auth.py`) verde na branch; validar que sem `CHATZERA_API_TOKEN` as rotas de escrita negam com erro claro (critério da issue #18).
4. Merge; verificar se o commit único de `dev` já está contido em `main`; alinhar ou abrir PR próprio.
5. Daí em diante: tronco = `main`; CZ2–CZ5 partem sempre de `main` atualizada; um merge por vez; PR #63 segue fluxo normal independente.

## 6. Checklists por frente (obrigatórios — início e fim)

**INÍCIO**: (1) li minha memória + doc/issue da frente; (2) branch da frente confirmada (criada pelo líder) e atualizada com a base; (3) lista de permitidos/proibidos lida e aceita; (4) varredura de colisão nos paths (log + PRs abertos) registrada; (5) git só via worktree isolado (Claude) / clone limpo (GPT); (6) início registrado em memória/issue.

**FIM**: (1) diff completo contra a lista — zero arquivo fora do escopo; (2) evidência real (comandos+saídas, testes, print se visual); (3) corpo do PR validado localmente contra os checkers antes do push; (4) memória/issue atualizadas e pushadas; (5) handoff escrito (estado, pendências, próximo passo, o que NÃO foi validado); (6) status honesto: FINAL só com pedido integral + evidência; senão PARCIAL/BLOQUEADA com motivo.

## 7. Dependências do líder

1. Confirmar fechamento do PR #54 do chatzera (destrava CZ1 → CZ2).
2. Clique nos PRs #132 e #133 do Kzeraap (destrava KZ3 e os follow-ups).
3. Aprovação final da lista DELETAR_SEGURO (KZ1).
4. Criar/nomear branches das frentes (CZ2, KZ2, KZ4) — agentes não criam.
5. Levar às frentes GPT o roteiro do §4 (ou autorizar o Max a publicar como issue no Kzeraap/chatzera pra equipe GPT ler).
