# Registro — Importação de Vendas/Transações

Data: 2026-07-09
Responsável operacional: Maxzera (`agent_maxzera_gpt_fone`)
Branch operacional: `agents/agent_maxzera_gpt_fone/pr-104-importacao-limpa`
Base: `nova_desenvolvimento_de_n1`
Fonte histórica: PR #104 / `n1` / `claude/dev/importacao-transacoes`

## Objetivo

Retomar e finalizar Importação de Vendas/Transações sem carregar o pacotão do PR #104.

A branch limpa deve conter apenas o miolo funcional da Importação de Transações/Vendas e o mínimo necessário para validação técnica.

## Fora de escopo nesta branch

- `CLAUDE.md`
- `.claude/settings.json`
- hooks e regras de governança
- agentes
- `CODEOWNERS` não mecânico
- design system geral
- CSS compartilhado não indispensável
- memórias grandes
- documentação grande fora do mínimo da importação

## Achados iniciais

1. `lider/pr-104-importacao-limpa` ainda não existe no GitHub pelo Bridge.
2. O Bridge só permite criar branch no padrão `agents/{agent_id}/{task}`.
3. Criada branch operacional: `agents/agent_maxzera_gpt_fone/pr-104-importacao-limpa`.
4. Comparação inicial:
   - `n1` e `claude/dev/importacao-transacoes` estão alinhadas no miolo de importação.
   - `nova_desenvolvimento_de_n1` está atrás em pontos importantes da Importação.
5. Arquivo principal divergente:
   - `src/presentation/importacao/ImportacaoTransacoesFinanceiroView.ts`
   - `nova_desenvolvimento_de_n1`: 14.650 bytes
   - `n1`: 21.433 bytes
6. Na versão de `n1` existem handlers de pendência que não aparecem na versão menor:
   - ignorar registro
   - marcar revisão
   - vincular financeiro
   - vincular financeiro em massa segura
7. Templates/CSS específicos da importação também divergem:
   - `src/presentation/importacao/templates/importacao-transacoes-financeiro-pendencias.html`
   - `src/presentation/importacao/templates/importacao-transacoes-financeiro.css`
   - `src/presentation/importacao/templates/importacao-transacoes-financeiro.html`

## Arquivos candidatos para portar primeiro

Portar de `n1` para a branch limpa:

1. `src/presentation/importacao/ImportacaoTransacoesFinanceiroView.ts`
2. `src/presentation/importacao/templates/importacao-transacoes-financeiro-pendencias.html`
3. `src/presentation/importacao/templates/importacao-transacoes-financeiro.css`
4. `src/presentation/importacao/templates/importacao-transacoes-financeiro.html`

## Arquivos explicitamente não incluídos neste primeiro corte

- `src/presentation/shared/styles/**`
- `docs/aprovados-lider/design-system/**`
- `reference/**`
- `CLAUDE.md`
- `.claude/settings.json`

## Status

Em andamento.

Ainda não validado:

- build
- typecheck
- testes
- fluxo visual em browser real
- PR final

## Próximo passo

Aplicar somente os arquivos candidatos de importação na branch operacional e depois rodar validação técnica mínima.
