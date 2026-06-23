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
| CRÍTICO | `src/domain/auth/AuthRules.ts` | 8–10 | Senha mínima de 1 caractere em produção |
| ALTA | `src/infrastructure/storage/RuntimeMetadataKeyValueStore.ts` | 4 | Chave de segurança hardcoded |
| ALTA | `src/infrastructure/auth/BrowserFaceIdGateway.ts` | 3 | Chave de passkey hardcoded |
| ALTA | `src/app/createKzeraAuthenticatedApp.ts` | 119–131 | `samplePerfil` no bundle de produção |
| ALTA | `src/app/createKzeraAuthenticatedApp.ts` | 133–139, 641 | ID fixo `'codigo-perfil-config'` no bundle |

Nenhum desses foi endereçado. Aguardam decisão do líder para iniciar correção.
