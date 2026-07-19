# Causas comprovadas e classificação

## PERF-001

**Classificação: NÃO_CONFIRMADA.** Não foi possível reproduzir a lentidão sem tela, horário, dispositivo e dados representativos.

### Ponto de investigação priorizado (não é causa declarada)

`IndexedDbRepository.list()` usa `getAll()`. `FinanceiroProtegidoRepository.list()` em seguida descriptografa todos os registros via `Promise.all`. Em listas grandes, isso pode ampliar E/S, CPU e alocação. Porém não há métrica de volume, chamada, duração ou impacto visual; alterar isso agora seria otimização especulativa e potencialmente exigiria índices/schema não autorizados.

### Achados negativos

* Não foi localizado service worker registrado no código-fonte.
* Não foi localizado polling por `setInterval`.
* Não foi localizada autenticação de agentes nem fonte de credencial de agentes.
