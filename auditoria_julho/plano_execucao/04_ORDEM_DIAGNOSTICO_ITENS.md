# ORDEM INDIVIDUAL — DESENVOLVEDOR DIAGNÓSTICO DE ITENS

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

- ITEM-DIAG-001A
- ITEM-DIAG-001B
- ITEM-DIAG-002

## Forma de trabalhar

1. Mapear arquivo, símbolo, comportamento atual e evidência.
2. Separar fato, hipótese, risco e decisão necessária.
3. Quando houver alternativa funcional, formular pergunta fechada ao Líder.
4. Não aplicar correção encontrada durante a análise.
5. Teste de caracterização, quando indispensável, é não bloqueante e não vira contrato.
6. Entregar relatório e matriz de evidências ao Integrador e ao QA.

## Parada obrigatória

Pare imediatamente se a continuação exigir mudar código, criar migration, escolher regra, alterar UI, reservar arquitetura ou transportar implementação histórica.

## ITEM-DIAG-001A

**Esta tarefa é diagnóstica. Não autoriza correção, mudança funcional, migration, novo contrato ou decisão de negócio.**

ID: ITEM-DIAG-001A  
Fase: FASE 2A  
Tarefa: Caracterizar o defeito técnico de ownership/cleanup da lista de rejeitados.  
Classificação na V4.1: DIAGNÓSTICA  
Pode iniciar agora?: SIM — exclusivamente em leitura.  
Responsável: Programador Diagnóstico de Itens  
Pré-condição: Evidência ancorada no snapshot `b91223b5fd4363c4969524399416dc37fb7623c8`; nenhuma mutação ou escolha funcional.  
Path: Fluxo atual de Importação de Itens; paths e símbolos devem ser descobertos no snapshot.  
Símbolo: A localizar e registrar; nenhum símbolo fica autorizado para alteração.  
Lock: leitura somente; superfícies funcionais permanecem congeladas.  
Teste: Se necessário, **Teste de caracterização não bloqueante. Não constitui contrato funcional, não bloqueia release e deve ser substituído por teste de regressão após decisão do líder.**  
Dependência: Nenhuma decisão é necessária para leitura; decisão do Líder será necessária para qualquer correção posterior.  
Decisão do líder: Não escolher nem executar; apenas formular pergunta fechada quando houver alternativa funcional.  
Risco: diagnóstico ser interpretado como autorização, contrato ou recomendação automática.  
Condição de parada: Parar ao surgir necessidade de corrigir, criar migration/contrato, escolher regra, alterar UI ou transportar código histórico.  
Critério de saída: Relatório com path, símbolo, sequência de ownership e reprodução; sem correção.  
Fonte dentro da V4.1: plano_corrigido_fase_2A_patches_autorizados.txt:58-68; matriz_v4_x_fontes_primarias.csv:13  
Confiança: ALTA

### Objetivo operacional

Localizar o compartilhamento de objetos, o cleanup destrutivo e o momento exato do defeito de ownership.

### Entrega esperada

Relatório com path, símbolo, sequência de ownership e reprodução; sem correção.

### Proibições específicas

- não corrigir durante o diagnóstico;
- não fazer branch, commit, push ou PR;
- não converter caracterização em gate;
- não bloquear release por teste de caracterização;
- não incluir tarefa condicional ou funcional no mesmo pacote de evidência.

## ITEM-DIAG-001B

**Esta tarefa é diagnóstica. Não autoriza correção, mudança funcional, migration, novo contrato ou decisão de negócio.**

ID: ITEM-DIAG-001B  
Fase: FASE 2A  
Tarefa: Caracterizar a política pendente de retomada, prévia e rejeitados após confirmação parcial.  
Classificação na V4.1: DIAGNÓSTICA  
Pode iniciar agora?: SIM — exclusivamente em leitura.  
Responsável: Programador Diagnóstico de Itens  
Pré-condição: Evidência ancorada no snapshot `b91223b5fd4363c4969524399416dc37fb7623c8`; nenhuma mutação ou escolha funcional.  
Path: Fluxo atual de retomada e persistência de Importação de Itens; leitura somente.  
Símbolo: A localizar e registrar; nenhum símbolo fica autorizado para alteração.  
Lock: leitura somente; superfícies funcionais permanecem congeladas.  
Teste: Se necessário, **Teste de caracterização não bloqueante. Não constitui contrato funcional, não bloqueia release e deve ser substituído por teste de regressão após decisão do líder.**  
Dependência: Nenhuma decisão é necessária para leitura; decisão do Líder será necessária para qualquer correção posterior.  
Decisão do líder: Não escolher nem executar; apenas formular pergunta fechada quando houver alternativa funcional.  
Risco: diagnóstico ser interpretado como autorização, contrato ou recomendação automática.  
Condição de parada: Parar ao surgir necessidade de corrigir, criar migration/contrato, escolher regra, alterar UI ou transportar código histórico.  
Critério de saída: Matriz de alternativas reais e pontos de decisão, sem escolher política.  
Fonte dentro da V4.1: plano_corrigido_fase_2A_patches_autorizados.txt:70-80; matriz_v4_x_fontes_primarias.csv:14  
Confiança: ALTA

### Objetivo operacional

Separar a política pendente de rascunho/continuar/prévia/rejeitados do defeito técnico de ownership.

### Entrega esperada

Matriz de alternativas reais e pontos de decisão, sem escolher política.

### Proibições específicas

- não corrigir durante o diagnóstico;
- não fazer branch, commit, push ou PR;
- não converter caracterização em gate;
- não bloquear release por teste de caracterização;
- não incluir tarefa condicional ou funcional no mesmo pacote de evidência.

## ITEM-DIAG-002

**Esta tarefa é diagnóstica. Não autoriza correção, mudança funcional, migration, novo contrato ou decisão de negócio.**

ID: ITEM-DIAG-002  
Fase: FASE 2A  
Tarefa: Caracterizar parser CSV/TSV, erros, colunas ignoradas e formatos atuais.  
Classificação na V4.1: DIAGNÓSTICA  
Pode iniciar agora?: SIM — exclusivamente em leitura.  
Responsável: Programador Diagnóstico de Itens  
Pré-condição: Evidência ancorada no snapshot `b91223b5fd4363c4969524399416dc37fb7623c8`; nenhuma mutação ou escolha funcional.  
Path: Parser/gateway/validações atuais de Importação de Itens; `createItemCatalogoUiApp.ts` e `ItemCatalogo.ts` congelados.  
Símbolo: A localizar e registrar; nenhum símbolo fica autorizado para alteração.  
Lock: leitura somente; superfícies funcionais permanecem congeladas.  
Teste: Se necessário, **Teste de caracterização não bloqueante. Não constitui contrato funcional, não bloqueia release e deve ser substituído por teste de regressão após decisão do líder.**  
Dependência: Nenhuma decisão é necessária para leitura; decisão do Líder será necessária para qualquer correção posterior.  
Decisão do líder: Não escolher nem executar; apenas formular pergunta fechada quando houver alternativa funcional.  
Risco: diagnóstico ser interpretado como autorização, contrato ou recomendação automática.  
Condição de parada: Parar ao surgir necessidade de corrigir, criar migration/contrato, escolher regra, alterar UI ou transportar código histórico.  
Critério de saída: Tabela factual de formatos aceitos/rejeitados e evidências; sem XLS/XLSX novo.  
Fonte dentro da V4.1: plano_corrigido_fase_2A_patches_autorizados.txt:82-99; matriz_v4_x_fontes_primarias.csv:15  
Confiança: ALTA

### Objetivo operacional

Caracterizar CSV, TSV, TXT, erros, colunas ignoradas e formatos atuais.

### Entrega esperada

Tabela factual de formatos aceitos/rejeitados e evidências; sem XLS/XLSX novo.

### Proibições específicas

- não corrigir durante o diagnóstico;
- não fazer branch, commit, push ou PR;
- não converter caracterização em gate;
- não bloquear release por teste de caracterização;
- não incluir tarefa condicional ou funcional no mesmo pacote de evidência.
