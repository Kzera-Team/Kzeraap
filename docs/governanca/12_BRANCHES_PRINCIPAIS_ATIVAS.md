# 12 — Branches principais ativas

Fonte única de verdade sobre quais branches são "principais" para efeito de:
- leitura obrigatória de memória (`docs/memoria/<papel>.md`) — todo agente deve considerar o conteúdo dessas branches, não só a que está com checkout local;
- sincronização de `docs/memoria/*` e `docs/governanca/*` entre branches (ver plano em `docs/memoria/bruno.md`, entrada 2026-07-05);
- decisão de onde replicar correção de processo/config (ex: hook de `.claude/settings.json`) quando aprovada pelo líder num contexto e precisa valer em outro.

Esta lista muda com o tempo. Antes de assumir que está atualizada, confirmar com `git ls-remote --heads origin` e/ou perguntar ao líder se algo relevante mudou.

## Lista atual (2026-07-05)

| Branch | Papel | Observação |
|---|---|---|
| `desenvolvimento` | Branch padrão do repositório; toda sessão nova nasce daqui. | Recebeu `docs/memoria/*` e parte da governança via PR #110 (2026-07-05) — antes disso não tinha nada. |
| `nova_desenvolvimento_de_n1` | Branch de trabalho **obrigatório** hoje (nota "Branch obrigatório (temporário)" em `.claude/agents/*.md` de `desenvolvimento`). | Deve ser tratada como autoritativa para `CLAUDE.md`/`.claude/agents/*.md`/`docs/memoria/*` enquanto essa nota existir. |
| `n1` | **Temporário — o líder já avisou que vai sair em breve** (sem data confirmada). | Não investir em sincronização de longo prazo aqui. Confirmar se ainda existe antes de tratar como principal. |
| `claude/dev/*` ativas (ex: `claude/dev/importacao-transacoes`, `claude/dev/fidelidade`) | Branches de frente de trabalho de José, uma por entrega em andamento. | Lista muda conforme frentes abrem/fecham — checar quais existem de fato via `git ls-remote`, não confiar em lista antiga. |

## Quando `n1` sair

A lista passa a ser: `desenvolvimento` + `nova_desenvolvimento_de_n1` + `claude/dev/*` ativas no momento. Atualizar esta tabela quando isso acontecer (aditivo — riscar a linha de `n1` com nota de encerramento, não apagar a linha, para manter o histórico de que ela existiu).

## Como manter atualizado

Qualquer agente pode propor atualização desta lista (é `docs/governanca/*.md`, autorização permanente de adicionar conteúdo). Remoção de uma branch da lista (não a exclusão da linha, só a mudança de status para "encerrada") deve vir com evidência de que ela de fato saiu de uso (líder confirmou, ou branch não existe mais no remoto).
