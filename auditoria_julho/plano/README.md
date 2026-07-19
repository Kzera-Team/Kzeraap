# PLANO DE AÇÃO — EQUIPE KZERAAP V4.1

## Quantidade de pessoas

| Papel | Quantidade | Função |
|---|---:|---|
| Integrador | 1 | Gate, locks, coordenação e integração |
| Desenvolvedor Perfil | 1 | PERF-001 após gate |
| Desenvolvedor Financeiro | 1 | FIN-001, FIN-002 e FIN-003 após gate |
| Desenvolvedor Diagnóstico de Itens | 1 | ITEM-DIAG-001A, 001B e 002 |
| Desenvolvedor Diagnóstico de Transações | 1 | TRANS-DIAG-001 e 002 |
| Desenvolvedor Diagnóstico de Estoque | 1 | EST-DIAG-001, 002 e 003 |
| Desenvolvedor Diagnóstico de Fidelidade | 1 | FID-DIAG-001, 002 e 003 |
| QA independente | 1 | Revisão independente e Fase 4 |
| Líder | 1 | Decide toolchain, regras funcionais e release |

**Equipe executora: 8 pessoas.**  
**Desenvolvedores propriamente ditos: 6.**  
**Com você como Líder: 9 pessoas envolvidas.**

## O que encaminhar

| Pessoa | Arquivo |
|---|---|
| Integrador | `01_ORDEM_INTEGRADOR.md` |
| Desenvolvedor Perfil | `02_ORDEM_DESENVOLVEDOR_PERFIL.md` |
| Desenvolvedor Financeiro | `03_ORDEM_DESENVOLVEDOR_FINANCEIRO.md` |
| Desenvolvedor Diagnóstico de Itens | `04_ORDEM_DIAGNOSTICO_ITENS.md` |
| Desenvolvedor Diagnóstico de Transações | `05_ORDEM_DIAGNOSTICO_TRANSACOES.md` |
| Desenvolvedor Diagnóstico de Estoque | `06_ORDEM_DIAGNOSTICO_ESTOQUE.md` |
| Desenvolvedor Diagnóstico de Fidelidade | `07_ORDEM_DIAGNOSTICO_FIDELIDADE.md` |
| QA independente | `08_ORDEM_QA_INDEPENDENTE.md` |

## Ondas de execução

### ONDA 1 — começa imediatamente

1. Integrador executa F1-001, F1-002, F1-005, F1-006 e F1-007.
2. Quatro desenvolvedores de diagnóstico trabalham em paralelo, somente em leitura.
3. Desenvolvedor Perfil prepara leitura, teste e diff proposto de PERF-001, mas não muta código.
4. Desenvolvedor Financeiro prepara leitura, testes e diffs propostos de FIN-001/002/003, mas não muta código.
5. QA revisa escopo, evidências e formato de entrega; não valida release.

### ONDA 2 — decisão do Líder

O Líder responde às decisões de toolchain. Sem isso, F1-003 e F1-004 continuam bloqueadas.

### ONDA 3 — gate

O Integrador cria e prova:

- instalação reproduzível;
- runner runtime real;
- typecheck real;
- build;
- `check:no-html-in-ts`;
- locks nominais dos arquivos de fonte e de teste.

### ONDA 4 — implementação funcional

Após a mensagem formal `GATE_LIBERADO` do Integrador:

- Perfil implementa PERF-001.
- Financeiro implementa FIN-001, FIN-002 e FIN-003 em patches leaf separados.
- PERF-001 e FIN-001 podem correr em paralelo.
- FIN-002 e FIN-003 podem ser preparados em paralelo, mas a integração é `FIN-002 → FIN-003`.
- Nenhuma fila global é criada para arquivos sem conflito real de path, símbolo ou contrato.

### ONDA 5 — integração e QA

1. Integrador valida cada patch isoladamente.
2. FIN-001 pode integrar sozinho.
3. PERF-001 pode integrar independentemente.
4. FIN-002 integra antes de FIN-003.
5. Após FIN-003, repetir os testes de FIN-002 e FIN-003.
6. Integrador executa F4-INT-001..004.
7. QA executa F4-QA-001..004.
8. Somente o Líder decide release.

## Regra de conflito

- Um único Desenvolvedor Financeiro fica com FIN-001/002/003. Não dividir FIN-002 e FIN-003 entre pessoas diferentes.
- Cada diagnóstico tem um responsável exclusivo.
- Integrador não reescreve patch de desenvolvedor; rejeita e devolve quando o escopo extrapola.
- QA não corrige código durante a validação.
