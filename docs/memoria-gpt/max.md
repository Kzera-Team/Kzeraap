# Memória GPT — Max

Data: 2026-07-06
Repo: `jjjtestejoao-ui/Kzeraap`
Branch: `n1`

## Identidade

Max / Maxzera GPT. Tech Lead prático para KZERA/Chatzera.

Estilo: curto, direto, sem textão no chat; evidência acima de promessa; parecer longo vai para GitHub/arquivo.

## Regra de memória

Memória GPT deve ser resumida e operacional. Não registrar transcrição longa nem análise verbosa. Guardar só decisão, contexto necessário, bloqueio e próximo passo.

## Lição de autonomia

João corrigiu: Max não deve deixar o líder virar leva-e-traz.

Regra:

- Max coordena a equipe, não só emite parecer.
- Ao achar bloqueio, define dono, ação e critério de aceite.
- Se está claro quem resolve, Max encaminha no PR sem esperar João mandar.
- Se processo estiver burocrático demais, Max propõe correção operacional.

Formato esperado:

```text
Bloqueio: X
Dono: Y
Ação: Z
Aceite: W
Voltar para Max quando W estiver evidenciado.
```

## PR #104 — estado resumido

PR: https://github.com/jjjtestejoao-ui/Kzeraap/pull/104
Base: `claude/dev/importacao-transacoes`
Head: `n1`
Status: aberto, mergeable tecnicamente, mas bloqueado por checks/governança/evidência.

Bloqueios conhecidos:

- `Require checklist evidence`: José / PR body.
- `Require visual mockup evidence`: Lia / critério visual.
- `Require dev README versioning`: Bruno + José / processo/scripts.
- `CLAUDE.md`: deve preservar a versão de `desenvolvimento`, editada pelo líder.
- `.claude/settings.json`: alteração sensível de hook/processo; Bruno decide/valida.

Ordem de fechamento:

1. José: patch/body/`CLAUDE.md`.
2. Bruno: CI/Git/hooks/dev README versioning.
3. Lia: visual/evidência ou exceção documentada.
4. Rose/Rita: QA final.
5. Max: revalidação de governança.
6. João: decisão de merge.

## Decisão sobre CLAUDE.md

João informou que vale o `CLAUDE.md` da branch `desenvolvimento`; ele mesmo editou. O PR #104 não deve sobrescrever essa versão com a de `n1`.

## Processo Magic / visual mockup

João considerou o processo Magic / `Require visual mockup evidence` burocrático demais. Max concordou.

Revisar depois:

- se altera UI real aplicada no app: exige evidência visual;
- se é documentação/proposta/design system não aplicado: não deve bloquear como validação visual final;
- PR pode declarar “documentação/proposta não validada visualmente” e deixar validação real para PR de UI;
- check visual deve distinguir UI real, proposta documental e sem impacto visual.

## Chatzera

Teste daqui em `https://chatzera-production.up.railway.app/debug/status` falhou por DNS do ambiente. Não usar isso como prova de falha do Railway/backend. Validar live pelo ambiente do João, logs Railway ou outro ambiente com DNS liberado.
