# Mudanças de Sessão — 2026-06-23

Pendências resolvidas e bloqueadores abertos ao encerrar esta sessão.

---

## Resolvidos nesta sessão

1. `claudette.md` — versão final comprimida com protocolo com Max mínimo e todos os itens restaurados
2. `claudette.md` — regra 4 mantida com escopo original ("qualquer entrega de tela")
3. `ana.md` — regra estrutural adicionada: "Jamais remover ou ignorar qualquer elemento da estrutura geral do app sem autorização explícita do líder"
4. `max.md` — 3 erros históricos da Claudette registrados na tabela
5. `claudette-registro.md` — ações rastreadas e isoladas neste arquivo
6. `para-claudette.md` — canal limpo, sem mistura de registros

---

## Bloqueadores de segurança — Diego (abertos, bloqueiam release)

| Severidade | Arquivo | Linha | Problema |
|------------|---------|-------|----------|
| CRÍTICO | `src/domain/auth/AuthRules.ts` | 8–10 | Senha mínima de 1 caractere em produção — **não impeditivo enquanto versão < 1.0.0. A partir de 1.0.0, build proibido sem correção prévia, sem exceção.** |

Nenhum desses foi endereçado. Aguardam decisão do líder para iniciar correção.

---

## Pendente — José (próxima entrega)

- `src/app/createKzeraAuthenticatedApp.ts` linhas 119–131 — remover `samplePerfil` hardcoded do bundle de produção e substituir por dado dinâmico ou genérico no preview da tela de configuração do Código do Perfil.
