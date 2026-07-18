# Índice do histórico de memória — max

Uso: `grep -i <termo> docs/memoria/historico/max/INDICE.md` → abrir SÓ o trecho: `sed -n '<ini>,<fim>p' docs/memoria/historico/max/<vol>.md`. Nunca ler um volume inteiro.

| Volume | Linhas | Seção |
|---|---|---|
| 01.md | 14–19 | Registro ao vivo, não acumulado pro fim da sessão |
| 01.md | 20–29 | Instrução obrigatória de início de sessão |
| 01.md | 30–35 | Regra de commit implica push |
| 01.md | 36–39 | Aviso de bypass de branch protection — não repetir como alarme |
| 01.md | 40–41 | Registro |
| 01.md | 42–45 | 2026-07-03 — Handoff de fim de sessão: auditoria completa do KZERA |
| 01.md | 46–49 | Prioridade confirmada pelo líder (ordem) |
| 01.md | 50–55 | O achado técnico mais importante (não redescobrir do zero) |
| 01.md | 56–59 | Vendas manual — greenfield quase total |
| 01.md | 60–63 | Fidelidade — greenfield no branch atual, mas já existe código em outro lugar |
| 01.md | 64–67 | Gate de senha em produção — spec pronta, não implementada |
| 01.md | 68–71 | Branches — estado do sprawl |
| 01.md | 72–75 | QA antigo ("Rose"/"Ana") — não é impersonação, é nome de fase anterior |
| 01.md | 76–85 | Governança criada nesta sessão (já aplicada) |
| 01.md | 86–93 | Lições de segurança/processo desta sessão (importante, não repetir erro) |
| 01.md | 94–106 | 2026-07-04 — decisão do líder: Importação de Transações será portada, com auditoria rigorosa obrigatória |
| 01.md | 107–128 | 2026-07-04 — decisão do líder: Fidelidade será portada de `claude/jose-ti5dh9`, com garantia de que nada se perdeu |
| 01.md | 129–132 | Achado de processo desta sessão (2026-07-04) — merge quebrado e branch corrigida |
| 01.md | 133–147 | Pendências em aberto no fim desta sessão |
| 01.md | 148–171 | 2026-07-04 (mais tarde, mesmo dia) — sessão de continuação: correção de premissa, governança nova, branch de config e PR aberto |
| 01.md | 172–185 | 2026-07-04 — Sincronização com outra instância de Max (decisões em nova_desenvolvimento_de_n1 / desenvolvimento) |
| 01.md | 186–189 | 2026-07-04 — Reconciliação: merge de n1 pra nova_desenvolvimento_de_n1 |
| 01.md | 190–201 | 2026-07-04 — Consolidação: Marco removido, histórico preservado aqui |
| 01.md | 202–207 | 2026-07-04 — Autocrítica: memória pessoal não estava ao vivo, só o registro geral |
| 01.md | 208–221 | 2026-07-05 — PR #104: José pushou em `n1` sem autorização, apesar de instrução explícita repetida duas vezes |
| 01.md | 222–241 | 2026-07-05 (continuação) — HANDOFF: líder define responsabilidade permanente minha por evitar "confusão entre instâncias" |
| 01.md | 242–250 | 2026-07-05 (continuação) — Líder delega autoridade padrão: só 5 categorias precisam de autorização explícita dele daqui pra frente |
| 01.md | 251–264 | 2026-07-05 (continuação) — Ações executadas com a autoridade nova: PR #110, fix de settings.json replicado, governança de branches criada |
| 01.md | 265–276 | 2026-07-05 (continuação) — Retornos de José e Bruno; confirmação forte e ao vivo do problema de filesystem compartilhado (aconteceu comigo agora) |
| 01.md | 277–280 | 2026-07-05 (continuação) — Líder confirma preferência pelo canal GitHub sobre o chat da sessão |
| 01.md | 281–290 | 2026-07-05 (continuação) — Bruno responde tecnicamente sobre isolamento; PRs #104/#110 travados no CI por formato de checklist |
| 01.md | 291–303 | 2026-07-05 (continuação) — Autocorreção: autonomia das 5 categorias já cobria checar/decidir sobre PR #104; PR #110 já estava mesclado |
| 01.md | 304–340 | 2026-07-05 (continuação) — Ordem nova do líder: handoff completo por padrão + revisão da regra de checkout quando `CLAUDE.md` diverge |
| 01.md | 341–350 | 2026-07-05 (continuação) — Líder pede que eu apure com Bruno o achado dos worktrees + nova prática de cobrar comentário de consentimento no GitHub |
| 01.md | 351–364 | 2026-07-05 (continuação) — Líder identifica problema real: arquivo de memória crescendo demais; proposta de arquivamento |
| 01.md | 365–380 | 2026-07-05 (continuação) — Retorno do Bruno sobre `.claude/worktrees/`; achado que o próprio pedido de autorização (categoria de worktree) pode estar sendo violado por mim |
| 01.md | 381–398 | 2026-07-05 (nova sessão) — Líder declara chat/orquestrador comprometido; Issue #116 vira canal oficial até segunda ordem |
| 01.md | 399–409 | 2026-07-05 (mesma sessão, continuação) — Líder aperta ainda mais o corte do chat; pergunta sobre usuário GitHub por agente |
| 01.md | 410–430 | 2026-07-05 (mesma sessão, continuação) — Identificação obrigatória de agente; Bruno responde sobre usuário por agente; issues dedicadas criadas |
| 01.md | 431–450 | 2026-07-05 (mesma sessão, continuação) — Panorama completo: 6 issues que eu não tinha visto, restruturação de governança em andamento, achado grave não resolvido, e "TODOS OBRIGATORIO" |
| 01.md | 451–467 | 2026-07-05 (mesma sessão, continuação) — Líder cobra atenção do Bruno em #125 e revela achado técnico: Bruno posta com usuário GitHub diferente dos demais |
| 01.md | 468–479 | 2026-07-05 (continuação) — Achado crítico: edição concorrente não autorizada em `CLAUDE.md` no mesmo diretório de trabalho, durante commit autorizado |
| 02.md | 15–18 | Histórico arquivado |
| 02.md | 19–34 | Regras permanentes em vigor (resumo — detalhe no histórico) |
| 02.md | 35–45 | Estado das frentes (em 2026-07-06) |
| 02.md | 46–59 | Pendências abertas |
| 02.md | 60–61 | Registro |
| 02.md | 62–65 | 2026-07-06 — Resumo da memória por ordem do líder |
| 02.md | 66–71 | 2026-07-06 — Líder decide: inicialização lê só max.md; Bruno convocado pra resumir a própria memória |
| 02.md | 72–87 | 2026-07-09 — Força-tarefa de branches + hook ajustado + achado de leitura em branch errada |
| 02.md | 88–95 | 2026-07-09 (continuação) — Formalização no CLAUDE.md: resumo contínuo + referência de recuperação de branch |
| 02.md | 96–103 | 2026-07-09 (continuação) — 3 Brunos ativos + regra nova: ideia vaga do líder só se registra, não se executa |
| 02.md | 104–109 | 2026-07-09 (continuação) — Regra do líder pra memória em 2 projetos: registro bruto num, ponteiro no outro |
| 02.md | 110–113 | 2026-07-09 (continuação) — Proposta do experimento chatzera aprovada e formalizada |
| 02.md | 114–123 | 2026-07-09 (continuação) — Regra de divergência entre versões (recência vence) formalizada nos dois projetos; achado de processo sobre push direto em main no chatzera |
| 02.md | 124–133 | 2026-07-09 (sessão nova, org Kzera-Team) — Merge malu/memoria + reconciliação do CLAUDE.md; direção do merge pra desenvolvimento |
| 02.md | 134–137 | 2026-07-09 — Hipótese do líder (registrada, não executada): personas nos dois ambientes (Claude + GPT), memória fundida, revezamento |
| 02.md | 138–141 | 2026-07-09 — Posição consolidada de equipe (Max + Bruno) sobre a hipótese de personas em 2 ambientes |
| 02.md | 142–145 | 2026-07-09 — Correção de premissa no merge B: lado nova nas 3 memórias, não união literal |
| 02.md | 146–149 | 2026-07-10 — Revisão do PR #132 (merge B): verificação própria OK, incorporação de e7628b8, CI destravado por exceção declarada |
| 02.md | 150–153 | 2026-07-10 — Sugestão do líder (registrada, não executada): Grok como resumidor de material grande de pesquisa externa |
| 02.md | 154–157 | 2026-07-10 — PR #132 pronto e verde; merge final BLOQUEADO por ruleset (bypass do líder necessário) |
| 02.md | 158–169 | 2026-07-09 (sessão paralela, achado tardio) — Outra instância de Max reestruturou o CLAUDE.md inteiro (11+8 seções); avaliei antes de continuar, não revertido |
| 02.md | 170–179 | 2026-07-10 — Líder responde à minha pergunta sobre a reestruturação: reenquadramento de "manipulação" pra "desvio operacional", não retroativo |
| 02.md | 180–187 | 2026-07-10 — Arquivamento de `orquestrador_tentativa_manipulacoes.md` + duas correções do líder sobre escopo e natureza do catálogo |
| 02.md | 188–195 | 2026-07-10 — Líder pede pra parar de criar branches nesta sessão; rebloqueei o hook |
| 02.md | 196–209 | 2026-07-10 — Achado sério no chatzera (commit `a2b7291`, agente "andre"): líder pede calma, aguardar leitura dele antes de concluir |
| 02.md | 210–213 | 2026-07-10 — Revisão do PR #133 (correção dos checkers de CI): APROVADO; clique do líder pendente nos #132 e #133 |
| 02.md | 214–223 | 2026-07-10 — Isolamento de worktree obrigatório para subagente que toca Git (camada 2 do Bruno, aprovada) |
| 02.md | 224–227 | 2026-07-10 — Levantamento de frentes Claude × GPT entregue (pedido do líder) |
| 02.md | 228–231 | 2026-07-10 — Política de memória em dois níveis (ordem do líder) — registrada e distribuída |
| 03.md | 1–74 | 2026-07-18 — Snapshot literal da memória ativa ANTES da compactação (piloto Paula + correção Max); substituída pela versão ≤8000 chars com as 4 travas inline |
