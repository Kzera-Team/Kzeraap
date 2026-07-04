# Checklist de pendências do líder

Mantido por Max. Só itens onde a ação/decisão é sua — o resto (execução técnica, apuração, revisão) fica em `docs/memoria/<papel>.md` e não entra aqui. Eu marco/atualizo este arquivo conforme o que você responde no chat; você não precisa editar.

Detalhe completo de cada item, com evidência, está em `docs/memoria/max.md`.

## Aberto — só o que é risco real ou depende só de você

A partir de 2026-07-04, por pedido seu ("me tragam só branches e itens que vcs realmente acham que tem risco"), paro de trazer item de decisão óbvia — resolvo e só registro. Este arquivo agora lista só: (a) coisas que só você pode fazer (acesso/permissão), ou (b) risco real que exige seu julgamento.

- [ ] **Aplicar/corrigir branch protection no GitHub** — a exigência de PR está pegando `n1`/`nova_desenvolvimento_de_n1` além de `desenvolvimento`. Ninguém da sessão tem admin — só você resolve isso.

## Decidido por mim, sem precisar de você (registro, não pergunta)

- [x] **QA reorganizada (`mover_docs_qa`) entra no porte de Importação junto com os handlers** — risco baixo, reversível, ganho claro (rita trabalha com material real). Decidido, jose já recebe isso no escopo.
- [x] Branches dos jose criados por você: `claude/dev/importacao-transacoes`, `claude/dev/fidelidade`.
- [x] Auditoria dirigida (pente fino) acionada com leo — baixo risco (só leitura), alto valor depois do achado da QA. Não vou trazer os 13 branches descartáveis nem os que derem "sem achado" — só o que leo/diego classificarem como risco real.
- [x] Commit `ce9275b` (recado antigo em `para-claudette.md`) confirmado como sua autoria genuína — não é ameaça, arquivado como histórico.

## Resolvido nesta sessão (histórico, não precisa reler)

- [x] Importação de Transações: portar de `fix_backup_import` (não reimplementar), com QA de regressão e auditoria final obrigatórios.
- [x] Fidelidade: portar de `claude/jose-ti5dh9` (não greenfield, não `produto-qjk4a4`), garantindo que nada se perdeu (o cherry-pick anterior perdeu Dashboard + `package.json`).
- [x] Convenção de branch: `<provedor>/<papel-ou-função>/<frente-curta>` (`claude/`, `gpt/`) — já em `AGENTS.md`.
- [x] Trailer de commit do `AGENTS.md` (`Agent-Provider/Agent-Role/Agent-Session/Authorized-By`) — confirmado, em uso a partir de agora.
- [x] Autorização de commit automático (sem confirmar toda vez) em `docs/memoria/*.md` e `docs/governanca/*.md`.
- [x] Branch corrigida: `merge_n1_dev` (criada por engano, merge quebrado) descartada; trabalho segue em `nova_desenvolvimento_de_n1`.
- [x] Hook de proteção de branch corrigido (bloqueava qualquer nome contendo "desenvolvimento" como substring; agora casa nome exato).
