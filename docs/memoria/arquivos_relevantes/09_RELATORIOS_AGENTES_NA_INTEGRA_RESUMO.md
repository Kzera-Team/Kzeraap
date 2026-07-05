# Resumo — 09_RELATORIOS_AGENTES_NA_INTEGRA.md

Feito por Bruno (infra), depois de ler o arquivo na íntegra (movido de `docs/governanca/` pra esta pasta em 2026-07-04, a pedido direto do líder). Esta é a versão resumida; a versão completa e literal continua em `09_RELATORIOS_AGENTES_NA_INTEGRA.md`, nesta mesma pasta — as duas ficam salvas, nenhuma substitui a outra.

Compilação original de 7 relatórios de agentes, feita por Max durante a auditoria de 2026-07-03, com verificação técnica independente de cada um (marcado no arquivo original como "Verificação independente de Max").

## O que cada relatório encontrou (resumo, não substitui o original)

1. **Vendas (escopo mínimo)** — zero código de venda funcional no repo; `Transacao.ts`/`TransacaoRules.ts` são código morto. Corte mínimo viável: venda simples + cancelamento simples. Risco: acopla com Financeiro (violação de camada já conhecida) e com a senha mestra fraca.
2. **Importação (duplicado + dado pessoal)** — motor de duplicidade já existe no código mas só funciona no cadastro manual, nunca foi plugado na importação em lote. Rascunho de importação fica em IndexedDB criptografado, mas sem expiração automática.
3. **Gate de senha em produção** — especificação pronta, nada implementado ainda (por decisão do líder, adiado). Ponto de inserção identificado em `AuthRules.ts`.
4. **Fidelidade** — zero código-fonte no branch atual, só mockups estáticos. Depende de Vendas (que também não existe funcional).
5. **Bruno — raio-X de branches (1ª apuração)** — 42 branches remotos; identificou que o branch mais completo de código de Fidelidade é `claude/jose-ti5dh9` (bem atrasado, mas com mais conteúdo que os outros); `n1` (branch atual) é uma linha separada, sem o trabalho de Importação/Fidelidade dos demais.
6. **Bruno — branch protection no GitHub (2ª apuração)** — na época (2026-07-03), achou que `desenvolvimento`/`main` não tinham nenhuma proteção configurada, e que o token da sessão não tinha admin pra ler/configurar. **Atualização de hoje (2026-07-04, ver `2026-07-04_bypass-protecao-n1/registro.md`):** achado novo e diferente — `n1` especificamente **tem** proteção configurada, mas a integração desta sessão consegue bypassá-la no push mesmo sem ter permissão de leitura/gestão da regra. Não são achados contraditórios: são branches diferentes, com estados diferentes, e o achado de hoje complementa (não substitui) o de ontem.
7. **Rita — QA antigo ("Rose")** — a rodada de QA de importação existente (`RODADA_QA_01.md`) testou um branch (`fix_backup_import`) que tem handlers de resolução de pendência que não existem no branch atual (`n1`) — não vale como validação do código de hoje. Estoque/Fidelidade só têm esqueleto de pasta, zero teste real.

## Por que isso importa pra mim (infra)

- Confirma, de fonte independente e já verificada por outro agente (Max), o mesmo padrão que venho documentando: achados técnicos precisam ser conferidos no código/API real, não só aceitos por relato.
- O item 6 é literalmente meu relatório anterior — hoje eu mesmo o atualizei com um achado novo e mais específico sobre `n1`, sem apagar ou contradizer o que já estava escrito.

## Nota de integridade

Este resumo é interpretativo (bullets, condensado). Onde precisar da fala exata de qualquer agente, usar sempre `09_RELATORIOS_AGENTES_NA_INTEGRA.md` (a versão literal), nunca este resumo como fonte de citação.
