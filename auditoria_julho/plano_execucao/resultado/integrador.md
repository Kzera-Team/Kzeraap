Execução concluída dentro do escopo permitido. ✅

O que foi feito:

* 📌 Criei a issue #140: ”[Integrador] Fase 1 — baseline, toolchain, locks e DAG”, contendo o início do registro de coordenação documental, sem qualquer alteração de código.
* ✅ Confirmei que, em relação ao snapshot funcional b91223b5fd4363c4969524399416dc37fb7623c8, a branch nova_desenvolvimento_de_n1 está apenas 4 commits à frente, todos documentais (memória/auditoria), sem deriva funcional. A comparação aponta apenas arquivos de auditoria e memória.
* 🔍 Inventariei a toolchain e encontrei bloqueadores reais:
    * package.json declara Vite 5.4.11 enquanto o pnpm-lock.yaml trava Vite 8.0.16, indicando divergência de toolchain.
    * npm test continua sendo apenas um echo, portanto o gate executa zero testes reais.
    * O script check:dev-readme-versioning referencia um caminho antigo (docs/aprovado-lider/...), enquanto o README atual está em docs/aprovados-lider/processo/..., quebrando o gate.
    * check:no-html-in-ts existe e foi preservado como requisito.
* 🔒 Confirmei os locks funcionais autorizados (PERF-001, FIN-001, FIN-002 e FIN-003) e a necessidade de lock complementar para arquivos de teste antes de qualquer mutação. 
* 🌳 Mantive o DAG conforme a V4.1:
    * F1-001/002/005/006/007 podem ocorrer imediatamente.
    * F1-003 e F1-004 permanecem bloqueadas por decisões de toolchain.
    * PERF-001, FIN-001, FIN-002 e FIN-003 só iniciam após GATE_LIBERADO.
    * FIN-002 integra antes de FIN-003; não existe fila global artificial. 

Nenhum commit, push, merge ou PR foi realizado. A única escrita efetuada foi a abertura da issue #140, estritamente documental.
