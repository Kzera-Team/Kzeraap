# Memória Grande — Max GPT — 2026-07-06

Uso: arquivo de consulta sob demanda. Não carregar por padrão.

## Regra de uso

A memória resumida é a fonte principal para carregar contexto:

`docs/memoria-gpt/max/memoria-resumida.md`

Este arquivo grande só deve ser consultado se:

- a instância perdeu contexto;
- houver dúvida sobre decisão anterior;
- precisar auditar o histórico;
- a memória resumida não for suficiente.

## Aprendizados do dia

1. Max precisa coordenar, não apenas parecerar.
2. João não deve virar leva-e-traz entre José, Bruno, Lia, QA e Max.
3. Quando houver bloqueio, Max deve apontar dono, ação, critério de aceite e próximo passo.
4. Comentários longos devem ir para PR/arquivo; chat deve ficar curto.
5. Memória GPT deve ser compacta por padrão.
6. Memória grande pode existir, mas separada e consultada só sob demanda.
7. Divisão futura deve ser por dia ou semana, conforme volume.
8. Processo Magic / visual mockup está burocrático demais e será revisto.

## PR #104 — contexto maior

PR: `jjjtestejoao-ui/Kzeraap#104`
Base: `claude/dev/importacao-transacoes`
Head: `n1`

O PR mistura governança, agentes, docs, design system, scripts, hooks, memória e processo. Por isso não deve ser tratado como implementação simples.

Bloqueios encontrados ao longo do dia:

- PR body com status não validado;
- `CLAUDE.md` divergente entre `n1` e `desenvolvimento`;
- líder definiu que vale `CLAUDE.md` da branch `desenvolvimento`;
- `.claude/settings.json` altera hook/processo Git;
- `Require checklist evidence` falhando;
- `Require visual mockup evidence` falhando;
- `Require dev README versioning` falhando;
- visual/mockup pode estar sendo exigido de forma excessiva para documentação/proposta;
- Bruno corrigiu que comentário sobre Chatzera/Grok foi no PR errado e não deve bloquear PR #104.

## Critério Magic / visual mockup a revisar

Avaliação Max:

- se altera UI real aplicada no app, evidência visual é necessária;
- se altera só documentação, proposta, HTML de referência ou design system não aplicado, não deveria bloquear como validação visual final;
- deve ser permitido declarar que a alteração é documentação/proposta não validada visualmente;
- validação visual real deve ocorrer no PR que aplica UI de fato;
- check visual deve distinguir UI real, proposta documental e sem impacto visual.

## Autonomia esperada de Max

João cobrou que a equipe é do Max e que ele não deve ficar esperando o líder ensinar o que fazer.

Regra operacional:

- detectar problema;
- decidir quem resolve;
- encaminhar diretamente no PR quando for claro;
- registrar critério de aceite;
- só voltar para João quando precisar decisão real de liderança ou merge.

## Estrutura de memória recomendada

- `docs/memoria-gpt/max.md`: loader curto apontando para resumida.
- `docs/memoria-gpt/max/memoria-resumida.md`: fonte principal.
- `docs/memoria-gpt/max/memoria-grande-YYYY-MM-DD.md`: arquivo grande por dia, só sob demanda.
- `docs/memoria-gpt/max/Memórias Max Pendentes.md`: pendências e decisões autorizadas pelo João.

## Chatzera

Endpoint testado:

`https://chatzera-production.up.railway.app/debug/status`

Neste ambiente GPT falhou por DNS. Isso não prova falha do Railway/backend. Validar por ambiente do João, logs Railway ou outro agente/ambiente com DNS liberado.
