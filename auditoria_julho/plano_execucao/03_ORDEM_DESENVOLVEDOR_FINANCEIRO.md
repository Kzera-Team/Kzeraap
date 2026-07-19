# ORDEM INDIVIDUAL — DESENVOLVEDOR FINANCEIRO

## Base obrigatória

- Branch operacional: `nova_desenvolvimento_de_n1`
- Snapshot funcional: `b91223b5fd4363c4969524399416dc37fb7623c8`
- A branch atual pode conter documentação posterior, mas nenhuma deriva funcional pode ser promovida sem validação do Integrador.
- Não transportar branch, PR, commit, binder ou implementação histórica em bloco.
- Não misturar importação de planilha com lote de estoque.
- Não inverter o fluxo de negócio `Transações → Financeiro`.
- Não tocar em superfície congelada.
- Não fazer commit, push ou PR sem ordem expressa do Líder e liberação do Integrador.


## Suas tarefas funcionais

- FIN-001
- FIN-002
- FIN-003

Você é o único responsável por esses três patches. **Não repasse FIN-002 ou FIN-003 a outro desenvolvedor**, porque a integração é coordenada e ambos exigem provas independentes.

## Agora, antes do gate

- Ler os três paths autorizados.
- Preparar três testes independentes e três diffs propostos, sem aplicar mutação.
- Informar ao Integrador os três arquivos de teste que precisam de lock.
- Não combinar os comportamentos no mesmo patch.

## Depois de receber `GATE_LIBERADO`

1. Implementar FIN-001 e provar isoladamente.
2. Implementar FIN-002 e provar isoladamente.
3. Implementar FIN-003 e provar isoladamente.
4. Solicitar integração coordenada `FIN-002 → FIN-003`.
5. Reexecutar as provas dos dois após a integração.

## Ordem e paralelismo

- FIN-001 é independente.
- FIN-002 e FIN-003 podem ser preparados em paralelo pelo mesmo desenvolvedor.
- FIN-002 integra antes de FIN-003.
- Cada ID deve ter diff, teste e evidência próprios.

## FIN-001

ID: FIN-001  
Fase: FASE 2A  
Tarefa: Corrigir alias destrutivo em FinanceiroProtegidoRepository.getById/list.  
Classificação na V4.1: AUTORIZADA_PELA_EVIDÊNCIA  
Pode iniciar agora?: NÃO — leitura e preparação do teste são permitidas; mutação aguarda gate.  
Responsável: Programador Financeiro  
Pré-condição: Snapshot `b91223b5fd4363c4969524399416dc37fb7623c8` confirmado; decisões de toolchain concluídas; runtime/typecheck reproduzíveis; lock nominal ativo.  
Path: `src/infrastructure/repositories/FinanceiroProtegidoRepository.ts`  
Símbolo: getById / list / ownership do payload retornado  
Lock: ALTERAÇÃO_AUTORIZADA_E_NOMINAL, porém inativa para mutação antes do gate.  
Teste: Teste próprio de ownership para `getById` e `list`, cobrindo integridade após cleanup e independência entre retorno e temporário.  
Dependência: Gate reproduzível; lock FIN-001; lock complementar do teste.  
Decisão do líder: Nenhuma decisão funcional adicional para este comportamento; toolchain continua obrigatória.  
Risco: ampliar o patch, alterar contrato ou usar código histórico como autorização.  
Condição de parada: Parar se a correção exigir alterar contrato, cleanup global, provider criptográfico ou repositório genérico.  
Critério de saída: Retorno íntegro após cleanup; prova específica, typecheck e build passam.  
Fonte dentro da V4.1: plano_corrigido_fase_2A_patches_autorizados.txt:104-119; matriz_v4_x_fontes_primarias.csv:16; `arquivos_exclusivos_integrador.txt`.  
Confiança: ALTA

### Ficha leaf

- **Responsável sugerido:** Programador Financeiro
- **Objetivo:** Corrigir o alias destrutivo em `getById` e `list` do repositório protegido.
- **Pré-condições:** gate completo; snapshot; lock; path/símbolo conferidos; teste nominal reservado.
- **Path autorizado:** `src/infrastructure/repositories/FinanceiroProtegidoRepository.ts`
- **Símbolo autorizado:** getById / list / ownership do payload retornado
- **Arquivos proibidos:** `src/application/ports/Repository.ts`; repositórios genéricos; `RuntimeCleanup.ts`; `TransferScope.ts`; qualquer arquivo adjacente; commit `9424ff6` em bloco.
- **Comportamento esperado:** O objeto devolvido ao chamador permanece íntegro depois que a referência temporária é submetida ao cleanup, sem mudança de contrato.
- **Teste necessário:** Teste próprio de ownership para `getById` e `list`, cobrindo integridade após cleanup e independência entre retorno e temporário.
- **Path do teste:** **NÃO NOMINALIZADO NA V4.1.** Antes de mutar qualquer arquivo de teste, o Integrador deve publicar lock complementar de teste sob o mesmo ID, sem ampliar o escopo funcional.
- **Comando de gate aplicável:** runtime = comando aprovado em F1-003; typecheck = comando aprovado em F1-004; build = script `build` pelo package manager canônico; HTML = script `check:no-html-in-ts` quando aplicável.
- **Critério de saída:** Retorno íntegro após cleanup; prova específica, typecheck e build passam.
- **Dependências:** Gate reproduzível; lock FIN-001; lock complementar do teste.
- **Possíveis conflitos:** Pode avançar separado de FIN-002 e FIN-003. Só exige coordenação se outro patch tocar os mesmos métodos ou o contrato Repository.
- **Solicitação ao Integrador:** Integrar isoladamente, rejeitando refactor adjacente e transporte integral de commit histórico.
- **Condição de parada:** Parar se a correção exigir alterar contrato, cleanup global, provider criptográfico ou repositório genérico.
- **Entrega esperada:** Patch leaf FIN-001, teste próprio, diff mínimo, logs de gate e declaração de ausência de ações Git não autorizadas.

## FIN-002

ID: FIN-002  
Fase: FASE 2A  
Tarefa: Corrigir alias destrutivo em PacoteConfirmacaoHistoricaRepository.  
Classificação na V4.1: AUTORIZADA_PELA_EVIDÊNCIA  
Pode iniciar agora?: NÃO — leitura e preparação do teste são permitidas; mutação aguarda gate.  
Responsável: Programador Financeiro  
Pré-condição: Snapshot `b91223b5fd4363c4969524399416dc37fb7623c8` confirmado; decisões de toolchain concluídas; runtime/typecheck reproduzíveis; lock nominal ativo.  
Path: `src/infrastructure/repositories/PacoteConfirmacaoHistoricaRepository.ts`  
Símbolo: retorno de pacote / ownership da referência temporária  
Lock: ALTERAÇÃO_AUTORIZADA_E_NOMINAL, porém inativa para mutação antes do gate.  
Teste: Teste próprio de ownership de `getById` e `list`, independente do teste de FIN-003.  
Dependência: Gate reproduzível; lock FIN-002; lock complementar do teste.  
Decisão do líder: Nenhuma decisão funcional adicional para este comportamento; toolchain continua obrigatória.  
Risco: ampliar o patch, alterar contrato ou usar código histórico como autorização.  
Condição de parada: Parar se for necessário alterar contrato, PR #76, domínio, schema ou política de confirmação.  
Critério de saída: Pacote retornado íntegro após cleanup; teste próprio, typecheck e build passam.  
Fonte dentro da V4.1: plano_corrigido_fase_2A_patches_autorizados.txt:121-131; matriz_v4_x_fontes_primarias.csv:17; `arquivos_exclusivos_integrador.txt`.  
Confiança: ALTA

### Ficha leaf

- **Responsável sugerido:** Programador Financeiro
- **Objetivo:** Desacoplar o payload do pacote retornado da referência temporária que será liberada.
- **Pré-condições:** gate completo; snapshot; lock; path/símbolo conferidos; teste nominal reservado.
- **Path autorizado:** `src/infrastructure/repositories/PacoteConfirmacaoHistoricaRepository.ts`
- **Símbolo autorizado:** retorno de pacote / ownership da referência temporária
- **Arquivos proibidos:** PR #76; `RuntimeCleanup.ts`; contratos de domínio; repositórios genéricos; FIN-001 no mesmo patch; qualquer alteração de schema.
- **Comportamento esperado:** O pacote e seu payload devolvidos permanecem íntegros após cleanup da referência temporária, sem mudança de contrato.
- **Teste necessário:** Teste próprio de ownership de `getById` e `list`, independente do teste de FIN-003.
- **Path do teste:** **NÃO NOMINALIZADO NA V4.1.** Antes de mutar qualquer arquivo de teste, o Integrador deve publicar lock complementar de teste sob o mesmo ID, sem ampliar o escopo funcional.
- **Comando de gate aplicável:** runtime = comando aprovado em F1-003; typecheck = comando aprovado em F1-004; build = script `build` pelo package manager canônico; HTML = script `check:no-html-in-ts` quando aplicável.
- **Critério de saída:** Pacote retornado íntegro após cleanup; teste próprio, typecheck e build passam.
- **Dependências:** Gate reproduzível; lock FIN-002; lock complementar do teste.
- **Possíveis conflitos:** Preparação paralela segura com FIN-003, mas integração coordenada e ordenada FIN-002 → FIN-003 após provas independentes.
- **Solicitação ao Integrador:** Validar FIN-002 sozinho, preservar sua prova própria e reservar a integração conjunta com FIN-003 somente depois dos dois gates.
- **Condição de parada:** Parar se for necessário alterar contrato, PR #76, domínio, schema ou política de confirmação.
- **Entrega esperada:** Patch leaf FIN-002, teste próprio, diff, logs de gate e solicitação de integração coordenada com FIN-003.

## FIN-003

ID: FIN-003  
Fase: FASE 2A  
Tarefa: Proteger pacote legado/vazio sem planejadas ou aprovados.  
Classificação na V4.1: AUTORIZADA_PELA_EVIDÊNCIA  
Pode iniciar agora?: NÃO — leitura e preparação do teste são permitidas; mutação aguarda gate.  
Responsável: Programador Financeiro  
Pré-condição: Snapshot `b91223b5fd4363c4969524399416dc37fb7623c8` confirmado; decisões de toolchain concluídas; runtime/typecheck reproduzíveis; lock nominal ativo.  
Path: `src/application/importacao/ConfirmarImportacaoHistoricaFinanceiraUseCase.ts`  
Símbolo: tratamento de pacote legado/vazio/sem aprovados  
Lock: ALTERAÇÃO_AUTORIZADA_E_NOMINAL, porém inativa para mutação antes do gate.  
Teste: Teste próprio para legado, vazio e zero aprovados; verificar ausência de escrita parcial e resultado não enganoso.  
Dependência: Gate reproduzível; lock FIN-003; FIN-002 com prova independente; lock complementar do teste.  
Decisão do líder: Nenhuma decisão funcional adicional para este comportamento; toolchain continua obrigatória.  
Risco: ampliar o patch, alterar contrato ou usar código histórico como autorização.  
Condição de parada: Parar se o cenário exigir definir nova política, journal, UnitOfWork, rollback, migration ou mudar contrato externo.  
Critério de saída: Sem crash, sucesso falso ou efeito parcial nos cenários autorizados; prova específica e gates passam.  
Fonte dentro da V4.1: plano_corrigido_fase_2A_patches_autorizados.txt:133-147; matriz_v4_x_fontes_primarias.csv:18; `arquivos_exclusivos_integrador.txt`.  
Confiança: ALTA

### Ficha leaf

- **Responsável sugerido:** Programador Financeiro
- **Objetivo:** Proteger o fluxo atual contra pacote legado, vazio ou com zero aprovados.
- **Pré-condições:** gate completo; snapshot; lock; path/símbolo conferidos; teste nominal reservado.
- **Path autorizado:** `src/application/importacao/ConfirmarImportacaoHistoricaFinanceiraUseCase.ts`
- **Símbolo autorizado:** tratamento de pacote legado/vazio/sem aprovados
- **Arquivos proibidos:** UnitOfWork; journal genérico; nova política de rollback; migration; contrato novo; PR #76; alteração em View ou lista/detalhe financeiro.
- **Comportamento esperado:** Os três cenários autorizados não causam crash, não declaram sucesso falso e não deixam efeito parcial.
- **Teste necessário:** Teste próprio para legado, vazio e zero aprovados; verificar ausência de escrita parcial e resultado não enganoso.
- **Path do teste:** **NÃO NOMINALIZADO NA V4.1.** Antes de mutar qualquer arquivo de teste, o Integrador deve publicar lock complementar de teste sob o mesmo ID, sem ampliar o escopo funcional.
- **Comando de gate aplicável:** runtime = comando aprovado em F1-003; typecheck = comando aprovado em F1-004; build = script `build` pelo package manager canônico; HTML = script `check:no-html-in-ts` quando aplicável.
- **Critério de saída:** Sem crash, sucesso falso ou efeito parcial nos cenários autorizados; prova específica e gates passam.
- **Dependências:** Gate reproduzível; lock FIN-003; FIN-002 com prova independente; lock complementar do teste.
- **Possíveis conflitos:** Preparação paralela com FIN-002; integração coordenada e ordenada depois de FIN-002. Não autoriza executar simultaneamente Importação de Transações e Importação Financeira.
- **Solicitação ao Integrador:** Executar prova isolada, confirmar ausência de efeitos parciais e integrar somente após FIN-002 validado.
- **Condição de parada:** Parar se o cenário exigir definir nova política, journal, UnitOfWork, rollback, migration ou mudar contrato externo.
- **Entrega esperada:** Patch leaf FIN-003, teste próprio, diff, logs de gate e evidência de integração coordenada com FIN-002.
