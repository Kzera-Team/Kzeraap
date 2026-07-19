# ORDEM INDIVIDUAL — INTEGRADOR

## Base obrigatória

- Branch operacional: `nova_desenvolvimento_de_n1`
- Snapshot funcional: `b91223b5fd4363c4969524399416dc37fb7623c8`
- A branch atual pode conter documentação posterior, mas nenhuma deriva funcional pode ser promovida sem validação do Integrador.
- Não transportar branch, PR, commit, binder ou implementação histórica em bloco.
- Não misturar importação de planilha com lote de estoque.
- Não inverter o fluxo de negócio `Transações → Financeiro`.
- Não tocar em superfície congelada.
- Não fazer commit, push ou PR sem ordem expressa do Líder e liberação do Integrador.


## Missão

Preparar a fundação, obter as decisões do Líder, construir o gate reproduzível, publicar locks, coordenar a execução e integrar somente patches autorizados.

## Começar agora

1. **F1-001:** registrar branch, HEAD, status, diff e relação com o snapshot.
2. **F1-002:** inventariar `package.json`, lockfiles, Node, package manager, scripts, `tsconfig.json`, Vite, TypeScript, runners e comandos disponíveis.
3. **F1-005:** confirmar e preservar `check:no-html-in-ts`.
4. **F1-006:** publicar locks nominais completos.
5. **F1-007:** publicar DAG real, sem fila global artificial.
6. Encaminhar ao Líder apenas as perguntas fechadas de toolchain.

## Depois das decisões do Líder

1. Executar F1-003 em patch separado: package manager, manifesto, lockfile e runner runtime conforme decisão expressa.
2. Executar F1-004 em patch separado: typecheck reproduzível, sem alterar o `tsconfig.json` por inferência.
3. Provar o gate completo com comandos, versões, exit codes e quantidade real de testes executados.
4. Enviar a todos a mensagem formal `GATE_LIBERADO`, contendo snapshot, comandos canônicos e locks ativos.

## Locks obrigatórios antes da implementação

- PERF-001: arquivo-fonte + arquivo de teste.
- FIN-001: arquivo-fonte + arquivo de teste.
- FIN-002: arquivo-fonte + arquivo de teste.
- FIN-003: arquivo-fonte + arquivo de teste.

O lock do teste não pode ampliar o comportamento autorizado.

## Ordem de integração

1. FIN-001 pode integrar separadamente.
2. PERF-001 é independente.
3. FIN-002 deve passar sozinho.
4. FIN-003 deve passar sozinho.
5. Integrar FIN-002 antes de FIN-003.
6. Depois de FIN-003, repetir os testes de FIN-002 e FIN-003.
7. Serializar apenas mesmo path, mesmo símbolo, mesmo contrato, mesma store, migration ou composition.

## Rejeitar automaticamente

- arquivo fora do lock;
- refatoração adjacente;
- mudança de contrato;
- migration;
- nova regra funcional;
- superfície congelada;
- tarefa condicionada misturada;
- branch/PR/commit histórico transportado em bloco;
- teste que roda zero casos;
- sucesso sem logs e exit code.

## Entregas

- registro de baseline;
- inventário de toolchain;
- decisões recebidas do Líder;
- gate reproduzível;
- locks ativos;
- manifesto por patch;
- relatório F4-INT-001..004;
- parecer técnico separado, sem decidir release.
