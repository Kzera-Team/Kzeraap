# ORDEM INDIVIDUAL — DESENVOLVEDOR DIAGNÓSTICO DE ESTOQUE

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

- EST-DIAG-001
- EST-DIAG-002
- EST-DIAG-003

## Forma de trabalhar

1. Mapear arquivo, símbolo, comportamento atual e evidência.
2. Separar fato, hipótese, risco e decisão necessária.
3. Quando houver alternativa funcional, formular pergunta fechada ao Líder.
4. Não aplicar correção encontrada durante a análise.
5. Teste de caracterização, quando indispensável, é não bloqueante e não vira contrato.
6. Entregar relatório e matriz de evidências ao Integrador e ao QA.

## Parada obrigatória

Pare imediatamente se a continuação exigir mudar código, criar migration, escolher regra, alterar UI, reservar arquitetura ou transportar implementação histórica.

## EST-DIAG-001

**Esta tarefa é diagnóstica. Não autoriza correção, mudança funcional, migration, novo contrato ou decisão de negócio.**

ID: EST-DIAG-001  
Fase: FASE 3  
Tarefa: Mapear modelagem ativa ItemCatalogo/Variacao/Lote.  
Classificação na V4.1: DIAGNÓSTICA  
Pode iniciar agora?: SIM — exclusivamente em leitura.  
Responsável: Programador Diagnóstico de Estoque  
Pré-condição: Evidência ancorada no snapshot `b91223b5fd4363c4969524399416dc37fb7623c8`; nenhuma mutação ou escolha funcional.  
Path: Domínio e casos de uso ativos; não recuperar EstoqueSaldo/EstoqueMovimentacao.  
Símbolo: A localizar e registrar; nenhum símbolo fica autorizado para alteração.  
Lock: leitura somente; superfícies funcionais permanecem congeladas.  
Teste: Se necessário, **Teste de caracterização não bloqueante. Não constitui contrato funcional, não bloqueia release e deve ser substituído por teste de regressão após decisão do líder.**  
Dependência: Nenhuma decisão é necessária para leitura; decisão do Líder será necessária para qualquer correção posterior.  
Decisão do líder: Não escolher nem executar; apenas formular pergunta fechada quando houver alternativa funcional.  
Risco: diagnóstico ser interpretado como autorização, contrato ou recomendação automática.  
Condição de parada: Parar ao surgir necessidade de corrigir, criar migration/contrato, escolher regra, alterar UI ou transportar código histórico.  
Critério de saída: Mapa de modelagem real e referências ativas, sem escolher modelo canônico.  
Fonte dentro da V4.1: plano_corrigido_fase_3_estoque_fidelidade.txt:17-26; matriz_v4_x_fontes_primarias.csv:38  
Confiança: ALTA

### Objetivo operacional

Mapear modelagem ativa de ItemCatalogo, Variação, Lote e símbolos usados.

### Entrega esperada

Mapa de modelagem real e referências ativas, sem escolher modelo canônico.

### Proibições específicas

- não corrigir durante o diagnóstico;
- não fazer branch, commit, push ou PR;
- não converter caracterização em gate;
- não bloquear release por teste de caracterização;
- não incluir tarefa condicional ou funcional no mesmo pacote de evidência.

## EST-DIAG-002

**Esta tarefa é diagnóstica. Não autoriza correção, mudança funcional, migration, novo contrato ou decisão de negócio.**

ID: EST-DIAG-002  
Fase: FASE 3  
Tarefa: Caracterizar inventário, retirada, unidades e cálculo de pesagem.  
Classificação na V4.1: DIAGNÓSTICA  
Pode iniciar agora?: SIM — exclusivamente em leitura.  
Responsável: Programador Diagnóstico de Estoque  
Pré-condição: Evidência ancorada no snapshot `b91223b5fd4363c4969524399416dc37fb7623c8`; nenhuma mutação ou escolha funcional.  
Path: Domínio/aplicação de item/estoque; `ItemCatalogo.ts` congelado.  
Símbolo: A localizar e registrar; nenhum símbolo fica autorizado para alteração.  
Lock: leitura somente; superfícies funcionais permanecem congeladas.  
Teste: Se necessário, **Teste de caracterização não bloqueante. Não constitui contrato funcional, não bloqueia release e deve ser substituído por teste de regressão após decisão do líder.**  
Dependência: Nenhuma decisão é necessária para leitura; decisão do Líder será necessária para qualquer correção posterior.  
Decisão do líder: Não escolher nem executar; apenas formular pergunta fechada quando houver alternativa funcional.  
Risco: diagnóstico ser interpretado como autorização, contrato ou recomendação automática.  
Condição de parada: Parar ao surgir necessidade de corrigir, criar migration/contrato, escolher regra, alterar UI ou transportar código histórico.  
Critério de saída: Tabela factual de comportamento e dúvidas, sem escolher conversão ou semântica.  
Fonte dentro da V4.1: plano_corrigido_fase_3_estoque_fidelidade.txt:28-43; matriz_v4_x_fontes_primarias.csv:39  
Confiança: ALTA

### Objetivo operacional

Caracterizar inventário, retirada, unidades, conversões, cálculo de fração, unidade da balança e estoque baixo.

### Entrega esperada

Tabela factual de comportamento e dúvidas, sem escolher conversão ou semântica.

### Proibições específicas

- não corrigir durante o diagnóstico;
- não fazer branch, commit, push ou PR;
- não converter caracterização em gate;
- não bloquear release por teste de caracterização;
- não incluir tarefa condicional ou funcional no mesmo pacote de evidência.

## EST-DIAG-003

**Esta tarefa é diagnóstica. Não autoriza correção, mudança funcional, migration, novo contrato ou decisão de negócio.**

ID: EST-DIAG-003  
Fase: FASE 3  
Tarefa: Mapear pontos de UI para inventário/retirada sem alterar UI.  
Classificação na V4.1: DIAGNÓSTICA  
Pode iniciar agora?: SIM — exclusivamente em leitura.  
Responsável: Programador Diagnóstico de Estoque  
Pré-condição: Evidência ancorada no snapshot `b91223b5fd4363c4969524399416dc37fb7623c8`; nenhuma mutação ou escolha funcional.  
Path: Apresentação atual de item/estoque e mockups existentes; leitura somente.  
Símbolo: A localizar e registrar; nenhum símbolo fica autorizado para alteração.  
Lock: leitura somente; superfícies funcionais permanecem congeladas.  
Teste: Se necessário, **Teste de caracterização não bloqueante. Não constitui contrato funcional, não bloqueia release e deve ser substituído por teste de regressão após decisão do líder.**  
Dependência: Nenhuma decisão é necessária para leitura; decisão do Líder será necessária para qualquer correção posterior.  
Decisão do líder: Não escolher nem executar; apenas formular pergunta fechada quando houver alternativa funcional.  
Risco: diagnóstico ser interpretado como autorização, contrato ou recomendação automática.  
Condição de parada: Parar ao surgir necessidade de corrigir, criar migration/contrato, escolher regra, alterar UI ou transportar código histórico.  
Critério de saída: Mapa de UI e lacunas, sem alteração visual.  
Fonte dentro da V4.1: plano_corrigido_fase_3_estoque_fidelidade.txt:45-53; matriz_v4_x_fontes_primarias.csv:40  
Confiança: ALTA

### Objetivo operacional

Mapear UI, permissões, telas e mockups de inventário/retirada.

### Entrega esperada

Mapa de UI e lacunas, sem alteração visual.

### Proibições específicas

- não corrigir durante o diagnóstico;
- não fazer branch, commit, push ou PR;
- não converter caracterização em gate;
- não bloquear release por teste de caracterização;
- não incluir tarefa condicional ou funcional no mesmo pacote de evidência.
