# ORDEM INDIVIDUAL — DESENVOLVEDOR DIAGNÓSTICO DE TRANSAÇÕES

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

- TRANS-DIAG-001
- TRANS-DIAG-002

## Forma de trabalhar

1. Mapear arquivo, símbolo, comportamento atual e evidência.
2. Separar fato, hipótese, risco e decisão necessária.
3. Quando houver alternativa funcional, formular pergunta fechada ao Líder.
4. Não aplicar correção encontrada durante a análise.
5. Teste de caracterização, quando indispensável, é não bloqueante e não vira contrato.
6. Entregar relatório e matriz de evidências ao Integrador e ao QA.

## Parada obrigatória

Pare imediatamente se a continuação exigir mudar código, criar migration, escolher regra, alterar UI, reservar arquitetura ou transportar implementação histórica.

## TRANS-DIAG-001

**Esta tarefa é diagnóstica. Não autoriza correção, mudança funcional, migration, novo contrato ou decisão de negócio.**

ID: TRANS-DIAG-001  
Fase: FASE 2A  
Tarefa: Mapear e reproduzir risco de listagens/conciliação/desfazer globais.  
Classificação na V4.1: DIAGNÓSTICA  
Pode iniciar agora?: SIM — exclusivamente em leitura.  
Responsável: Programador Diagnóstico de Transações  
Pré-condição: Evidência ancorada no snapshot `b91223b5fd4363c4969524399416dc37fb7623c8`; nenhuma mutação ou escolha funcional.  
Path: Fluxo atual de Importação de Transações e Financeiro; leitura somente.  
Símbolo: A localizar e registrar; nenhum símbolo fica autorizado para alteração.  
Lock: leitura somente; superfícies funcionais permanecem congeladas.  
Teste: Se necessário, **Teste de caracterização não bloqueante. Não constitui contrato funcional, não bloqueia release e deve ser substituído por teste de regressão após decisão do líder.**  
Dependência: Nenhuma decisão é necessária para leitura; decisão do Líder será necessária para qualquer correção posterior.  
Decisão do líder: Não escolher nem executar; apenas formular pergunta fechada quando houver alternativa funcional.  
Risco: diagnóstico ser interpretado como autorização, contrato ou recomendação automática.  
Condição de parada: Parar ao surgir necessidade de corrigir, criar migration/contrato, escolher regra, alterar UI ou transportar código histórico.  
Critério de saída: Mapa de escopo e lacunas, sem campo, filtro, migration ou contrato de isolamento.  
Fonte dentro da V4.1: plano_corrigido_fase_2A_patches_autorizados.txt:165-176; matriz_v4_x_fontes_primarias.csv:20  
Confiança: ALTA

### Objetivo operacional

Mapear escopo global de listagens, conciliação, confirmação e desfazer.

### Entrega esperada

Mapa de escopo e lacunas, sem campo, filtro, migration ou contrato de isolamento.

### Proibições específicas

- não corrigir durante o diagnóstico;
- não fazer branch, commit, push ou PR;
- não converter caracterização em gate;
- não bloquear release por teste de caracterização;
- não incluir tarefa condicional ou funcional no mesmo pacote de evidência.

## TRANS-DIAG-002

**Esta tarefa é diagnóstica. Não autoriza correção, mudança funcional, migration, novo contrato ou decisão de negócio.**

ID: TRANS-DIAG-002  
Fase: FASE 2A  
Tarefa: Caracterizar rollback/desfazer conforme o contrato atual.  
Classificação na V4.1: DIAGNÓSTICA  
Pode iniciar agora?: SIM — exclusivamente em leitura.  
Responsável: Programador Diagnóstico de Transações  
Pré-condição: Evidência ancorada no snapshot `b91223b5fd4363c4969524399416dc37fb7623c8`; nenhuma mutação ou escolha funcional.  
Path: Use case, repositories e View atuais, sem mutar `ImportacaoTransacoesFinanceiroView.ts`.  
Símbolo: A localizar e registrar; nenhum símbolo fica autorizado para alteração.  
Lock: leitura somente; superfícies funcionais permanecem congeladas.  
Teste: Se necessário, **Teste de caracterização não bloqueante. Não constitui contrato funcional, não bloqueia release e deve ser substituído por teste de regressão após decisão do líder.**  
Dependência: Nenhuma decisão é necessária para leitura; decisão do Líder será necessária para qualquer correção posterior.  
Decisão do líder: Não escolher nem executar; apenas formular pergunta fechada quando houver alternativa funcional.  
Risco: diagnóstico ser interpretado como autorização, contrato ou recomendação automática.  
Condição de parada: Parar ao surgir necessidade de corrigir, criar migration/contrato, escolher regra, alterar UI ou transportar código histórico.  
Critério de saída: Relatório por camada e caracterização não bloqueante, sem autorizar mudança.  
Fonte dentro da V4.1: plano_corrigido_fase_2A_patches_autorizados.txt:178-187; matriz_v4_x_fontes_primarias.csv:21  
Confiança: ALTA

### Objetivo operacional

Separar contrato existente de rollback/desfazer, wiring visual disponível e política manual.

### Entrega esperada

Relatório por camada e caracterização não bloqueante, sem autorizar mudança.

### Proibições específicas

- não corrigir durante o diagnóstico;
- não fazer branch, commit, push ou PR;
- não converter caracterização em gate;
- não bloquear release por teste de caracterização;
- não incluir tarefa condicional ou funcional no mesmo pacote de evidência.
