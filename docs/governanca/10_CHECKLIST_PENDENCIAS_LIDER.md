# Checklist de pendências do líder

Mantido por Max. Só itens onde a ação/decisão é sua — o resto (execução técnica, apuração, revisão) fica em `docs/memoria/<papel>.md` e não entra aqui. Eu marco/atualizo este arquivo conforme o que você responde no chat; você não precisa editar.

Detalhe completo de cada item, com evidência, está em `docs/memoria/max.md`.

## Aberto

- [ ] **Nomear os 2 branches pros jose** (Importação de Transações; Fidelidade) — convenção confirmada: `claude/dev/<frente-curta>` (ex: `claude/dev/importacao-transacoes`). Sem isso ninguém começa a codificar. Você já sinalizou "já volto com as branches".
- [ ] **Aplicar/corrigir branch protection no GitHub** — hoje a exigência de PR está pegando `n1` e `nova_desenvolvimento_de_n1` também, quando deveria valer só pra `desenvolvimento`. Ninguém da sessão tem admin pra mexer nisso; passo a passo já existe (ver `docs/memoria/arquivos_relevantes/09_RELATORIOS_AGENTES_NA_INTEGRA.md`, seção Bruno #2). Enquanto isso, os pushes seguem indo com bypass silencioso — você já aceitou isso por ora.
- [ ] **Decisão: portar a reorganização de QA junto com Importação?** Achei que a "QA anterior" reorganizou `CT-*.md`/`RODADA_QA_01` de Importação (branch `mover_docs_qa`, PR #84), mas isso só existe em `fix_backup_import` e derivados — não está no nosso branch atual. Minha recomendação: portar junto (rita ganha material real em vez de partir do zero), mas quero sua confirmação antes de incluir isso no escopo do porte.

## Resolvido nesta sessão (histórico, não precisa reler)

- [x] Importação de Transações: portar de `fix_backup_import` (não reimplementar), com QA de regressão e auditoria final obrigatórios.
- [x] Fidelidade: portar de `claude/jose-ti5dh9` (não greenfield, não `produto-qjk4a4`), garantindo que nada se perdeu (o cherry-pick anterior perdeu Dashboard + `package.json`).
- [x] Convenção de branch: `<provedor>/<papel-ou-função>/<frente-curta>` (`claude/`, `gpt/`) — já em `AGENTS.md`.
- [x] Trailer de commit do `AGENTS.md` (`Agent-Provider/Agent-Role/Agent-Session/Authorized-By`) — confirmado, em uso a partir de agora.
- [x] Autorização de commit automático (sem confirmar toda vez) em `docs/memoria/*.md` e `docs/governanca/*.md`.
- [x] Branch corrigida: `merge_n1_dev` (criada por engano, merge quebrado) descartada; trabalho segue em `nova_desenvolvimento_de_n1`.
- [x] Hook de proteção de branch corrigido (bloqueava qualquer nome contendo "desenvolvimento" como substring; agora casa nome exato).
