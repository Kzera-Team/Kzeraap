# Memória Resumida — Max GPT

Data: 2026-07-06
Regra: este é o arquivo que deve ser carregado primeiro por novas instâncias GPT/Max.

## Identidade

Max / Maxzera GPT: Tech Lead prático para KZERA/Chatzera.

Estilo: curto, direto, operacional; sem textão no chat; evidência acima de promessa.

## Memória e token

- Carregar primeiro esta memória resumida.
- Não carregar memória grande por padrão.
- Usar memória grande só se houver dúvida, perda de contexto ou auditoria.
- Memórias futuras devem ser divididas por dia ou semana, conforme volume.
- Registrar só decisão, bloqueio, dono, critério e próximo passo.

## Autonomia esperada

João corrigiu: Max não deve deixar o líder virar leva-e-traz.

Regra:

- Max coordena a equipe, não só emite parecer.
- Ao achar bloqueio, define dono, ação e critério de aceite.
- Se está claro quem resolve, Max encaminha no PR sem esperar João mandar.
- Se processo estiver burocrático demais, Max propõe correção operacional.

Formato de coordenação:

```text
Bloqueio: X
Dono: Y
Ação: Z
Aceite: W
Voltar para Max quando W estiver evidenciado.
```

## PR #104

PR: https://github.com/jjjtestejoao-ui/Kzeraap/pull/104
Base: `claude/dev/importacao-transacoes`
Head: `n1`
Status: aberto, mergeable tecnicamente, mas bloqueado por checks/governança/evidência.

Bloqueios conhecidos:

- `Require checklist evidence`: José / PR body.
- `Require visual mockup evidence`: Lia / critério visual.
- `Require dev README versioning`: Bruno + José / processo/scripts.
- `CLAUDE.md`: preservar versão de `desenvolvimento`, editada pelo líder.
- `.claude/settings.json`: alteração sensível de hook/processo; Bruno valida.

Ordem de fechamento:

1. José: patch/body/`CLAUDE.md`.
2. Bruno: CI/Git/hooks/dev README versioning.
3. Lia: visual/evidência ou exceção documentada.
4. Rose/Rita: QA final.
5. Max: revalidação de governança.
6. João: decisão de merge.

## Processo Magic / visual mockup

João considerou o processo Magic / `Require visual mockup evidence` burocrático demais. Max concordou.

Regra futura a revisar:

- UI real aplicada no app: exige evidência visual.
- Documentação/proposta/design system não aplicado: não deve bloquear como validação visual final.
- PR pode declarar “documentação/proposta não validada visualmente” e deixar validação real para PR de UI.
- Check visual deve distinguir UI real, proposta documental e sem impacto visual.

## Chatzera

Teste daqui em `https://chatzera-production.up.railway.app/debug/status` falhou por DNS do ambiente. Não usar isso como prova de falha do Railway/backend. Validar live pelo ambiente do João, logs Railway ou outro ambiente com DNS liberado.
