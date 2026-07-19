# Matriz de testes

| Grupo | Estado | Evidência/condição |
|---|---|---|
| Build | passou | `pnpm run build` |
| Sem HTML em TS | passou | `pnpm run check:no-html-in-ts` |
| Typecheck | bloqueado por base | imports CSS sem declarações de tipo |
| Suite declarada | não executa testes | `pnpm test` apenas imprime que testes estão desabilitados |
| Inventário de testes CJS | falha na base | versões e documentos esperados divergentes/ausentes |
| Login humano/agentes, permissões, sessão e logout | não executável | não há identidades/agentes nem segredo seguro |
| Cenários de performance | não executável | faltam dados representativos e browser instrumentado |

Testes futuros obrigatórios: os 15 casos do pedido devem injetar um segredo descartável no ambiente do servidor de teste, nunca no bundle/repositório, e devem cobrir identidades distintas com permissões distintas.
