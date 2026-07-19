# ORDEM INDIVIDUAL — DESENVOLVEDOR DIAGNÓSTICO DE FIDELIDADE

## Base obrigatória

- Branch operacional: `nova_desenvolvimento_de_n1`
- Snapshot funcional: `b91223b5fd4363c4969524399416dc37fb7623c8`
- A branch atual pode conter documentação posterior, mas nenhuma deriva funcional pode ser promovida sem validação do Integrador.
- Não transportar branch, PR, commit, binder ou implementação histórica em bloco.
- Não misturar importação de planilha com lote de estoque.
- Não inverter o fluxo de negócio `Transações → Financeiro`.
- Não tocar em superfície congelada.
- Não fazer commit, push ou PR sem ordem expressa do Líder e liberação do Integrador.


## Natureza da missão

**Esta frente é diagnóstica. Não autoriza correção, mudança funcional, migration, novo contrato ou decisão de negócio.**

## Pode começar agora

Sim, exclusivamente em leitura e caracterização factual.

## Tarefas

- FID-DIAG-001
- FID-DIAG-002
- FID-DIAG-003

## Forma de trabalhar

1. Mapear arquivo, símbolo, comportamento atual e evidência.
2. Separar fato, hipótese, risco e decisão necessária.
3. Quando houver alternativa funcional, formular pergunta fechada ao Líder.
4. Não aplicar correção encontrada durante a análise.
5. Teste de caracterização, quando indispensável, é não bloqueante e não vira contrato.
6. Entregar relatório e matriz de evidências ao Integrador e ao QA.

## Parada obrigatória

Pare imediatamente se a continuação exigir mudar código, criar migration, escolher regra, alterar UI, reservar arquitetura ou transportar implementação histórica.

## FID-DIAG-001

**Esta tarefa é diagnóstica. Não autoriza correção, mudança funcional, migration, novo contrato ou decisão de negócio.**

ID: FID-DIAG-001  
Fase: FASE 3  
Tarefa: Mapear branch candidata, PR parcial, placeholders, HTML em TS e dependências.  
Classificação na V4.1: DIAGNÓSTICA  
Pode iniciar agora?: SIM — exclusivamente em leitura.  
Responsável: Programador Diagnóstico de Fidelidade  
Pré-condição: Evidência ancorada no snapshot `b91223b5fd4363c4969524399416dc37fb7623c8`; nenhuma mutação ou escolha funcional.  
Path: Branch `claude/jose-ti5dh9`, PR #85 e base b912; nenhum transporte.  
Símbolo: A localizar e registrar; nenhum símbolo fica autorizado para alteração.  
Lock: leitura somente; superfícies funcionais permanecem congeladas.  
Teste: Se necessário, **Teste de caracterização não bloqueante. Não constitui contrato funcional, não bloqueia release e deve ser substituído por teste de regressão após decisão do líder.**  
Dependência: Nenhuma decisão é necessária para leitura; decisão do Líder será necessária para qualquer correção posterior.  
Decisão do líder: Não escolher nem executar; apenas formular pergunta fechada quando houver alternativa funcional.  
Risco: diagnóstico ser interpretado como autorização, contrato ou recomendação automática.  
Condição de parada: Parar ao surgir necessidade de corrigir, criar migration/contrato, escolher regra, alterar UI ou transportar código histórico.  
Critério de saída: Inventário comparativo arquivo a arquivo, sem portar código.  
Fonte dentro da V4.1: plano_corrigido_fase_3_estoque_fidelidade.txt:70-81; matriz_v4_x_fontes_primarias.csv:44  
Confiança: ALTA

### Objetivo operacional

Usar branch candidata e PR #85 apenas como procedência e mapear arquivos, placeholders, 0/0, HTML em TS e dependências.

### Entrega esperada

Inventário comparativo arquivo a arquivo, sem portar código.

### Proibições específicas

- não corrigir durante o diagnóstico;
- não fazer branch, commit, push ou PR;
- não converter caracterização em gate;
- não bloquear release por teste de caracterização;
- não incluir tarefa condicional ou funcional no mesmo pacote de evidência.

## FID-DIAG-002

**Esta tarefa é diagnóstica. Não autoriza correção, mudança funcional, migration, novo contrato ou decisão de negócio.**

ID: FID-DIAG-002  
Fase: FASE 3  
Tarefa: Comparar regras históricas com documentação aprovada atual.  
Classificação na V4.1: DIAGNÓSTICA  
Pode iniciar agora?: SIM — exclusivamente em leitura.  
Responsável: Programador Diagnóstico de Fidelidade  
Pré-condição: Evidência ancorada no snapshot `b91223b5fd4363c4969524399416dc37fb7623c8`; nenhuma mutação ou escolha funcional.  
Path: Domínio, contracts, persistência, composition e apresentação; leitura somente.  
Símbolo: A localizar e registrar; nenhum símbolo fica autorizado para alteração.  
Lock: leitura somente; superfícies funcionais permanecem congeladas.  
Teste: Se necessário, **Teste de caracterização não bloqueante. Não constitui contrato funcional, não bloqueia release e deve ser substituído por teste de regressão após decisão do líder.**  
Dependência: Nenhuma decisão é necessária para leitura; decisão do Líder será necessária para qualquer correção posterior.  
Decisão do líder: Não escolher nem executar; apenas formular pergunta fechada quando houver alternativa funcional.  
Risco: diagnóstico ser interpretado como autorização, contrato ou recomendação automática.  
Condição de parada: Parar ao surgir necessidade de corrigir, criar migration/contrato, escolher regra, alterar UI ou transportar código histórico.  
Critério de saída: Matriz de compatibilidade e decisões, sem declarar regra histórica vigente.  
Fonte dentro da V4.1: plano_corrigido_fase_3_estoque_fidelidade.txt:83-93; matriz_v4_x_fontes_primarias.csv:45  
Confiança: ALTA

### Objetivo operacional

Comparar regras históricas com documentação aprovada e arquitetura atual por camada.

### Entrega esperada

Matriz de compatibilidade e decisões, sem declarar regra histórica vigente.

### Proibições específicas

- não corrigir durante o diagnóstico;
- não fazer branch, commit, push ou PR;
- não converter caracterização em gate;
- não bloquear release por teste de caracterização;
- não incluir tarefa condicional ou funcional no mesmo pacote de evidência.

## FID-DIAG-003

**Esta tarefa é diagnóstica. Não autoriza correção, mudança funcional, migration, novo contrato ou decisão de negócio.**

ID: FID-DIAG-003  
Fase: FASE 3  
Tarefa: Inventariar necessidade potencial de persistência, wiring, menu e navegação.  
Classificação na V4.1: DIAGNÓSTICA  
Pode iniciar agora?: SIM — exclusivamente em leitura.  
Responsável: Programador Diagnóstico de Fidelidade  
Pré-condição: Evidência ancorada no snapshot `b91223b5fd4363c4969524399416dc37fb7623c8`; nenhuma mutação ou escolha funcional.  
Path: Arquitetura atual da base b912; nenhuma criação.  
Símbolo: A localizar e registrar; nenhum símbolo fica autorizado para alteração.  
Lock: leitura somente; superfícies funcionais permanecem congeladas.  
Teste: Se necessário, **Teste de caracterização não bloqueante. Não constitui contrato funcional, não bloqueia release e deve ser substituído por teste de regressão após decisão do líder.**  
Dependência: Nenhuma decisão é necessária para leitura; decisão do Líder será necessária para qualquer correção posterior.  
Decisão do líder: Não escolher nem executar; apenas formular pergunta fechada quando houver alternativa funcional.  
Risco: diagnóstico ser interpretado como autorização, contrato ou recomendação automática.  
Condição de parada: Parar ao surgir necessidade de corrigir, criar migration/contrato, escolher regra, alterar UI ou transportar código histórico.  
Critério de saída: Lista de superfícies potenciais e dependências, sem reservar ou implementar nada.  
Fonte dentro da V4.1: plano_corrigido_fase_3_estoque_fidelidade.txt:95-105; matriz_v4_x_fontes_primarias.csv:46  
Confiança: ALTA

### Objetivo operacional

Inventariar necessidade potencial de store, versionamento, migration, repository, composition, menu e navegação.

### Entrega esperada

Lista de superfícies potenciais e dependências, sem reservar ou implementar nada.

### Proibições específicas

- não corrigir durante o diagnóstico;
- não fazer branch, commit, push ou PR;
- não converter caracterização em gate;
- não bloquear release por teste de caracterização;
- não incluir tarefa condicional ou funcional no mesmo pacote de evidência.

> O despacho foi produzido a partir da V4.1 sem alterar suas regras, decisões, bloqueios ou classificações. Nenhuma implementação funcional foi autorizada além das tarefas expressamente classificadas na V4.1, e nenhuma tarefa poderá ser executada antes de suas pré-condições, decisões e gates correspondentes.
