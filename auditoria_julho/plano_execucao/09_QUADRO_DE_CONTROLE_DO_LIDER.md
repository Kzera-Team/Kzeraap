# QUADRO DE CONTROLE DO LÍDER

| Frente | Responsável | Pode começar agora? | Pode alterar código agora? | Próximo bloqueio |
|---|---|---|---|---|
| Fundação/gate | Integrador | Sim | Somente após decisões para F1-003/004 | Respostas de toolchain |
| PERF-001 | Dev Perfil | Leitura/preparo | Não | GATE_LIBERADO + lock de teste |
| FIN-001 | Dev Financeiro | Leitura/preparo | Não | GATE_LIBERADO + lock de teste |
| FIN-002 | Dev Financeiro | Leitura/preparo | Não | GATE_LIBERADO + lock de teste |
| FIN-003 | Dev Financeiro | Leitura/preparo | Não | GATE_LIBERADO + FIN-002 provado |
| Itens | Dev Diagnóstico Itens | Sim | Não | Decisão do Líder para qualquer correção |
| Transações | Dev Diagnóstico Transações | Sim | Não | Decisão do Líder para qualquer correção |
| Estoque | Dev Diagnóstico Estoque | Sim | Não | Decisões + novo plano |
| Fidelidade | Dev Diagnóstico Fidelidade | Sim | Não | Decisões + novo plano |
| QA | QA independente | Revisão/preparo | Não | Patches integrados para Fase 4 |

## Mensagens de controle

### Liberação do gate

`GATE_LIBERADO — snapshot confirmado, runtime real aprovado, typecheck aprovado, build aprovado, check HTML preservado e locks nominais ativos.`

### Parada de frente

`FRENTE_PAUSADA — foi encontrada necessidade fora do path, símbolo, lock ou comportamento autorizado. Nenhuma mutação adicional foi realizada.`

### Entrega de patch

`PATCH_ENTREGUE — ID, snapshot, paths, símbolos, diff, teste, runtime, typecheck, build, check HTML aplicável e declaração de ausência de ações Git não autorizadas anexados.`
