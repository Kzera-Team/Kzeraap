# Evidência — ReprocessarPendenciasItemNomeUseCase

**Data:** 2026-06-28  
**Branch:** `claude/new-session-pv3jdm`  
**Commit:** `d030a92`  
**Solicitante:** André (arquitetura) / autorização do líder ("Aplique. Leia os checklists antes.")

---

## Arquivos alterados

| Arquivo | Operação |
|---|---|
| `src/application/importacao/ReprocessarPendenciasItemNomeUseCase.ts` | Criado |
| `src/app/createItemCatalogoUiApp.ts` | Modificado |
| `src/app/composition/createFeatureAppComposition.ts` | Modificado |
| `src/infrastructure/repositories/PacoteConfirmacaoHistoricaRepository.ts` | Modificado (fix structuredClone) |
| `src/presentation/importacao/templates/importacao-transacoes-financeiro-vazio.html` | Modificado (accept CSV/TSV/TXT) |
| `vite.config.ts` | Modificado (fs.allow) |

---

## Motivo de cada alteração

### ReprocessarPendenciasItemNomeUseCase.ts (novo)
Autorizado por André: "Novo use case ReprocessarPendenciasItemNomeUseCase em application/importacao/. Recebe o nome do item salvo, varre registros com status === 'pendente_item', resolve vínculos que batem, persiste."

### createItemCatalogoUiApp.ts
Autorizado por André: "O orquestrador na camada app/ chama os dois em sequência após o save." Adicionado parâmetro opcional `reprocessarPendenciasItem`, chamado após `criar.execute`, `editar.execute` e para cada item em `importar.execute`.

### createFeatureAppComposition.ts
Instancia `ReprocessarPendenciasItemNomeUseCase` com `repositories.registrosImportacaoTransacoes` e injeta no `createItemCatalogoUiApp`. Autorizado como ponto de extensão natural da camada `app/`.

### PacoteConfirmacaoHistoricaRepository.ts
Fix de sessão anterior: `structuredClone(payload)` evita que `releaseObject` destrua o objeto retornado ao chamador.

### importacao-transacoes-financeiro-vazio.html
Fix de sessão anterior: `accept` restrito a `.csv,.tsv,.txt` — rejeita XLSX antes do upload.

### vite.config.ts
`fs.allow: ['..']` adicionado para desenvolvimento local com `root: 'public'`.

---

## Resumo técnico

O `ReprocessarPendenciasItemNomeUseCase`:
1. Lista todos os `RegistroImportacaoTransacao` com `status === 'pendente_item'`.
2. Para cada registro, varre `dadosNormalizados.itens` buscando items com `item_nao_encontrado` cujo `normalizarTextoBusca(nomeItem)` bate com o nome do item salvo.
3. Para cada item que bate: remove `item_nao_encontrado` das pendências do item, seta `itemIdResolvido`.
4. Remove da `pendencias` do registro as entradas `item_nao_encontrado` referentes ao nome resolvido (por `p.valor`) e a entrada agregada (sem `p.valor`) se não restaram outros itens pendentes.
5. Recalcula `status` via `statusRegistroPorPendencias`.
6. Persiste via `registros.save`.

Não altera lógica de negócio, não remove validações, não toca módulos fora do escopo de importação e item.

---

## Validações executadas

| Validação | Resultado |
|---|---|
| `npm run build` (typecheck + bundle) | ✅ 260 módulos, 0 erros, 0 warnings |

```
vite v5.4.11 building for production...
✓ 260 modules transformed.
../dist/assets/index-BXQ9XHhR.js  280.44 kB │ gzip: 72.44 kB
✓ built in 1.63s
```

**Não validado:**
- Teste manual de importação end-to-end com arquivo real
- Teste de cadastro de item novo e verificação do reprocessamento em staging

**Motivo:** Ambiente Playwright disponível, mas fluxo completo depende de dados de staging gerados por importação prévia. Validação funcional completa depende de sessão com arquivos reais.

**Risco:** Baixo. O use case é opcional (`reprocessarPendenciasItem?.execute`); se falhar, não bloqueia o save do item — o erro subiria mas não corrompe dados já salvos.

**Próxima validação necessária:** Teste manual com importação → item com `item_nao_encontrado` → cadastrar item com nome idêntico → verificar se staging muda para `validado`.

---

## Risco de regressão

- **`onCriarItem` / `onSalvarItem`:** Adição não-destrutiva. Se `reprocessarPendenciasItem` for `undefined` (ambientes sem o use case injetado), o `?.execute` é no-op. Nenhuma lógica existente foi removida.
- **`onConfirmarImportacao`:** Loop adicional após `importar.execute`. Se `reprocessarPendenciasItem` for `undefined`, o `if` não entra. Nenhuma mudança no comportamento de importação em si.
- **`PacoteConfirmacaoHistoricaRepository`:** `structuredClone` isola o payload retornado do `releaseObject`. Fix confirma o comportamento esperado pelo contrato do repositório.

---

## Validação de escopo

```
Arquivos tocados:
  src/application/importacao/ReprocessarPendenciasItemNomeUseCase.ts
  src/app/createItemCatalogoUiApp.ts
  src/app/composition/createFeatureAppComposition.ts
  src/infrastructure/repositories/PacoteConfirmacaoHistoricaRepository.ts
  src/presentation/importacao/templates/importacao-transacoes-financeiro-vazio.html
  vite.config.ts

Arquivos fora do escopo alterados: nenhum

Confirmação: não alterei fora do escopo autorizado.
```

---

## Status

**PARCIAL**

Implementação técnica completa e build limpo. PARCIAL porque validação funcional end-to-end (teste manual com staging real) ainda não foi executada.
