# Integrador — Fundação F1

Data: 2026-07-18  
Papel: Integrador  
Snapshot funcional obrigatório: `b91223b5fd4363c4969524399416dc37fb7623c8`

## F1-001 — Registro de baseline

- Branch atual: `work`.
- HEAD atual: `ed2fe881ad47ee3530a439a5c1b2618e3ca94c5a`.
- Relação com snapshot: `b91223b5fd4363c4969524399416dc37fb7623c8` é ancestral de `HEAD` (`git merge-base --is-ancestor` retornou exit code 0).
- Commits entre snapshot e HEAD:
  - `be52c6a docs: adiciona auditoria forense de perfil de julho`
  - `b1fabcd temporary`
  - `9d72772 Memórias Jose`
  - `ed2fe88 Update jose.md Adicionado pelo Lider`
- Diff versionado entre snapshot e HEAD: apenas documentação/memória/auditoria posterior; 17 arquivos, 2091 inserções, sem alteração funcional em `src/`, `public/`, `package.json`, `tsconfig.json` ou `vite.config.ts`.
- Working tree no início do registro: `pnpm-lock.yaml` modificado antes desta fundação, com 402 inserções e 198 remoções. Este arquivo não foi normalizado nem promovido como decisão de toolchain nesta etapa.

## F1-002 — Inventário de toolchain

### Manifesto e locks

- `package.json`: presente; projeto privado `kzera`, versão `0.19.50`, `type: module`, engine `node >=20`.
- Lockfiles detectados no escopo raiz: `pnpm-lock.yaml`.
- Lockfiles não detectados no escopo raiz: `package-lock.json`, `yarn.lock`, `bun.lockb`.
- Package manager inferido por lock existente: `pnpm`; ainda requer decisão expressa do Líder antes de F1-003.

### Versões do ambiente atual

- Node: `v24.15.0`.
- pnpm: `10.28.1`.
- npm: `11.4.2` (com aviso de ambiente: `Unknown env config "http-proxy"`).
- yarn: `4.14.1`.
- bun: `1.2.14`.

### Scripts disponíveis

- `npm test`: `echo "Testes temporariamente desabilitados neste branch"`.
- `npm run check`: `npm run check:no-html-in-ts && npm run check:dev-readme-versioning && npm test`.
- `npm run dev`: `vite --host 0.0.0.0`.
- `npm run build`: `vite build`.
- `npm run preview`: `vite preview --host 0.0.0.0`.
- `npm run check:no-html-in-ts`: `node tools/check-no-html-in-ts.mjs`.
- `npm run check:index-html-pr-only`: `node tools/check-index-html-pr-only.mjs`.
- `npm run check:pr-checklist-evidence`: `node tools/check-pr-checklist-evidence.mjs`.
- `npm run check:protected-process-changes`: `node tools/check-protected-process-changes.mjs`.
- `npm run check:visual-mockup-evidence`: `node tools/check-visual-mockup-evidence.mjs`.
- `npm run check:dev-readme-versioning`: `node tools/check-dev-readme-versioning.mjs`.

### TypeScript, Vite, runners

- `tsconfig.json`: presente; `target ES2022`, `module ESNext`, `moduleResolution Bundler`, `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `rootDir src`, `outDir dist`, `declaration`, `skipLibCheck`, libs `ES2022` e `DOM`, include `src/**/*.ts`.
- TypeScript: não está declarado em `devDependencies` do `package.json`; não há script canônico de typecheck ainda.
- Vite: `devDependency` `vite: 5.4.11`; `vite.config.ts` usa `root: public`, `publicDir: static`, `outDir: ../dist`, `base: /Kzeraap/`, `define.__APP_VERSION__` com a versão do `package.json`.
- Runner de testes real: não há runner real ativo no script `test`; o comando atual imprime mensagem e executa zero casos.
- Arquivos `tests/*.test.cjs` existem, mas não estão ligados ao script `test` nesta branch.

## F1-005 — Preservação de `check:no-html-in-ts`

- Script presente e preservado: `check:no-html-in-ts` aponta para `node tools/check-no-html-in-ts.mjs`.
- Workflow presente: `.github/workflows/block-html-in-ts.yml` executa `npm run check:no-html-in-ts`.
- Execução local em 2026-07-18: `npm run check:no-html-in-ts` retornou exit code 0.

## F1-006 — Locks nominais completos

Até decisão expressa do Líder, estes locks são nominais e bloqueiam implementação fora do arquivo-fonte e teste indicado.

| Lock | Arquivo-fonte nominal | Arquivo de teste nominal | Observação de integrador |
| --- | --- | --- | --- |
| PERF-001 | `src/application/perfil/BuscarPerfisUseCase.ts` | `tests/perfil-busca-avancada.test.cjs` | Independente de FIN; não tocar importação de planilha nem superfície congelada. |
| FIN-001 | `src/domain/financeiro/Financeiro.ts` | `tests/financeiro-base-1140.test.cjs` | Pode integrar separadamente; sem migration e sem mudança de contrato externo. |
| FIN-002 | `src/application/importacao/PrepararImportacaoTransacoesUseCase.ts` | `tests/importacao-transacoes-financeiro-1150.test.cjs` | Deve passar sozinho; preservar fluxo `Transações → Financeiro`. |
| FIN-003 | `src/application/importacao/ConfirmarImportacaoHistoricaFinanceiraUseCase.ts` | `tests/confirmacao-historico-financeiro-1186.test.cjs` | Deve integrar depois de FIN-002; depois repetir testes de FIN-002 e FIN-003. |

Regra ativa: o teste do lock não pode ampliar comportamento autorizado; qualquer arquivo fora do par nominal exige decisão fechada antes de execução.

## F1-007 — DAG real sem fila global artificial

```text
Snapshot b91223b5fd4363c4969524399416dc37fb7623c8
  └─ Fundação F1
      ├─ F1-003: decisão de package manager + manifesto + lockfile + runner runtime
      │   └─ F1-004: typecheck reproduzível sem inferir alteração de tsconfig
      │       └─ GATE_LIBERADO
      │           ├─ FIN-001
      │           ├─ PERF-001
      │           └─ FIN-002
      │               └─ FIN-003
      │                   └─ repetir testes FIN-002 + FIN-003
      └─ Locks nominais publicados antes da implementação
```

Paralelismo permitido após gate: FIN-001 e PERF-001 são independentes; FIN-002 precede FIN-003; serializar apenas mesmo path, mesmo símbolo, mesmo contrato, mesma store, migration ou composition.

## Perguntas fechadas de toolchain ao Líder

1. Package manager canônico para F1-003: `pnpm`, `npm`, `yarn` ou `bun`?
2. O lockfile ativo deve ser somente `pnpm-lock.yaml` caso a escolha seja `pnpm`?
3. Runner runtime canônico para testes `*.test.cjs`: `node` com lista explícita, `node --test`, Vitest, ou outro?
4. Typecheck reproduzível em F1-004 deve instalar/declarar `typescript` em `devDependencies` sem alterar `tsconfig.json`?
5. O script `test` deve deixar de ser stub nesta etapa e passar a falhar quando executar zero casos?

## Estado do gate neste momento

- Gate completo: ainda não liberado.
- Motivo: F1-003 e F1-004 dependem de decisão expressa do Líder.
- Check isolado preservado: `check:no-html-in-ts` passou com exit code 0.
- `npm run check:dev-readme-versioning` falhou com exit code 1 porque tenta ler `docs/aprovado-lider/dev/README.md`, caminho inexistente na árvore atual; existe `docs/aprovados-lider/`.
