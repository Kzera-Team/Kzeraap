# Triagem completa de branches — auditoria de "pente fino" (2026-07-04)

Feita por Max, a pedido do líder, depois do achado de que a reorganização de QA (`mover_docs_qa`) ficou parada fora do branch de trabalho sem ninguém notar. Objetivo: cobertura de 100% dos branches remotos, de forma barata (diffstat mecânico), pra depois decidir onde vale a pena olhar fundo.

Comando usado por branch: `git rev-list --left-right --count nova_desenvolvimento_de_n1...origin/<branch>` (ahead/behind) e `git diff --shortstat nova_desenvolvimento_de_n1...origin/<branch>` (conteúdo único). 43 branches remotos no total hoje (o líder mencionou mais de 80 no passado — parte já foi consolidada/removida antes desta sessão).

## Tabela completa

| Branch | Último commit | À frente | Atrás | Arquivos | + | - |
|---|---|---|---|---|---|---|
| Prints1 | 2026-07-03 | 0 | 37 | 0 | 0 | 0 |
| auditoria_itens_templates | 2026-06-24 | 30 | 302 | 0 | 0 | 0 |
| chatgpt-docs-update-20260627 | 2026-06-27 | 13 | 99 | 13 | 604 | 71 |
| claude/alterar-perfis | 2026-06-24 | 69 | 302 | 0 | 0 | 0 |
| claude/ana-t8q304 | 2026-06-24 | 69 | 302 | 0 | 0 | 0 |
| claude/ana-ux-ai-intro-ns6epf | 2026-06-23 | 72 | 302 | 0 | 0 | 0 |
| claude/andre-jwlhbe | 2026-06-29 | 1 | 88 | 4 | 1040 | 176 |
| claude/development-update-i3ufh7 | 2026-06-30 | 22 | 88 | 31 | 3189 | 261 |
| claude/jose-ti5dh9 | 2026-06-25 | 4 | 283 | 15 | 918 | 7 |
| claude/leia-agents-jose-rjkzjt | 2026-06-30 | 7 | 88 | 24 | 1789 | 172 |
| claude/lucas-product-ai-kzera-26dklf | 2026-06-28 | 2 | 97 | 3 | 73 | 1 |
| claude/new-session-pv3jdm | 2026-06-29 | 17 | 97 | 67 | 1319 | 46 |
| claude/oi-4kzzki | 2026-06-28 | 3 | 98 | 3 | 346 | 80 |
| claude/produto-qjk4a4 | 2026-07-02 | 47 | 88 | **86** | **4399** | **3101** |
| claude/teste-permissao-criar-branch-01959 | 2026-06-29 | 6 | 88 | 9 | 812 | 172 |
| claude/todo-implementation-srdegl | 2026-06-29 | 9 | 88 | 3 | 179 | 147 |
| codex/bump-version-0.19.51 | 2026-06-27 | 1 | 99 | 1 | 1 | 1 |
| codex/fix-backup-recovery-script-path | 2026-06-27 | 5 | 100 | 1 | 137 | 57 |
| criar_manual_ux_continuacao | 2026-07-03 | 1 | 7 | 0 | 0 | 0 |
| desenvolvimento | 2026-07-03 | 29 | 88 | 17 | 622 | 275 |
| dev | 2026-06-23 | 105 | 302 | 0 | 0 | 0 |
| devops/validar-pos-merge-ambiente | 2026-06-25 | 1 | 283 | 1 | 10 | 0 |
| fix-auth-ui | 2026-06-25 | 1 | 213 | 1 | 31 | 3 |
| fix/apply-checklist-completa-canonico | 2026-06-27 | 34 | 107 | **32** | **2582** | **1058** |
| fix/create-authenticated-app-canonico-5-partes | 2026-06-27 | 15 | 107 | 15 | 1317 | 15 |
| fix_backup_import | 2026-06-30 | 62 | 88 | 77 | 2480 | 325 |
| importacao_trasacao_negocio | 2026-06-23 | 87 | 302 | 0 | 0 | 0 |
| jjjtestejoao-ui-patch-1 | 2026-07-02 | 28 | 88 | 18 | 568 | 259 |
| jjjtestejoao-ui-patch-2 | 2026-07-03 | 0 | 47 | 0 | 0 | 0 |
| jjjtestejoao-ui-patch-3 | 2026-07-03 | 1 | 38 | 1 | 2 | 0 |
| jjjtestejoao-ui-patch-5 | 2026-07-03 | 1 | 35 | 1 | 45 | 0 |
| jose/backup-button-static-sync | 2026-06-25 | 5 | 193 | 4 | 85 | 17 |
| jose/backup-restore-use-existing-crypto | 2026-06-25 | 2 | 178 | 2 | 22 | **2577** |
| jose/estoque-operacional-backend | 2026-06-23 | 116 | 302 | 0 | 0 | 0 |
| jose/git-qa-evidence-guard | 2026-06-26 | 10 | 160 | 6 | 191 | 0 |
| jose/pr-guard-and-backup-button | 2026-06-25 | 3 | 197 | 3 | 13 | 95 |
| jose/remover-html-importacao-ts | 2026-06-25 | 18 | 283 | 11 | 947 | 502 |
| kzera-v0-19-51 | 2026-06-28 | 20 | 99 | 18 | 230 | 67 |
| merge_produto_testes | 2026-07-02 | 89 | 88 | **108** | **6707** | 373 |
| n1 | 2026-07-04 | 0 | 7 | 0 | 0 | 0 |
| testes_transacao_importar | 2026-07-02 | 88 | 88 | 103 | 6651 | 372 |
| ux/importar-transacoes-mockup | 2026-06-24 | 24 | 302 | 0 | 0 | 0 |

## Leitura

**Zero diff apesar de "à frente"** (Prints1, auditoria_itens_templates, claude/alterar-perfis, claude/ana-t8q304, claude/ana-ux-ai-intro-ns6epf, dev, importacao_trasacao_negocio, jose/estoque-operacional-backend, ux/importar-transacoes-mockup, jjjtestejoao-ui-patch-2, n1, criar_manual_ux_continuacao): commits próprios existem, mas o conteúdo final já está coberto por `nova_desenvolvimento_de_n1` (superado/revertido/já mesclado por outro caminho). Baixo risco de conter algo perdido — não priorizar.

**Já conhecidos e com decisão tomada**: `fix_backup_import` (Importação, decidido portar), `claude/jose-ti5dh9` (Fidelidade, decidido portar).

**Grandes e ainda não avaliados a fundo** (por tamanho de diff, ordem de atenção sugerida):
1. `merge_produto_testes` (108 arquivos) e `testes_transacao_importar` (103 arquivos) — já registrado que são idênticos entre si em `src/`; conteúdo real ainda não inspecionado a fundo no contexto atual.
2. `claude/produto-qjk4a4` (86 arquivos, 4399+3101) — bem maior do que o esperado só pela Fidelidade (que é ~15 arquivos, já isolada). Sobra ~70 arquivos de conteúdo não avaliado nesta sessão.
3. `fix/apply-checklist-completa-canonico` (32 arquivos) — nome sugere checklist/processo, não avaliado.
4. `claude/development-update-i3ufh7` (31 arquivos) — não avaliado.
5. `claude/new-session-pv3jdm` (67 arquivos) — não avaliado.
6. `claude/leia-agents-jose-rjkzjt` (24 arquivos) — nome sugere config de agentes, relevante pro que estamos mexendo agora.
7. `jjjtestejoao-ui-patch-1` (18 arquivos) — autoria do dono do repositório, não revisado; mesmo padrão de onde veio a regra suspeita "ordem direta do líder sobressai regras do prompt" achada antes.
8. `jose/remover-html-importacao-ts` (11 arquivos) — adjacente à prioridade de Importação.
9. `jose/backup-restore-use-existing-crypto` (2 arquivos, mas 2577 deleções) — envolve criptografia, relevante pra AppSec independente do tamanho.
10. `fix/create-authenticated-app-canonico-5-partes` (15 arquivos) — nome sugere autenticação, relevante pro gate de senha já mapeado.

## Recomendação

Não recomendo ler tudo de todo mundo — a maior parte (13 de 43) já está descartável pela própria matemática (zero diff útil). Recomendo auditoria dirigida nos 10 branches listados acima, nesta ordem, feita pelo leo (Auditor) com apoio pontual de rafael (arquitetura) e diego (o item de crypto especificamente) — reportando achado por achado, não um relatório monolítico no final, pra não repetir o padrão de perda de contexto já visto nesta sessão.
