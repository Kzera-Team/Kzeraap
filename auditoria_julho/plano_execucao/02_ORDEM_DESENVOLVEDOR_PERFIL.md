# ORDEM INDIVIDUAL — DESENVOLVEDOR PERFIL

## Base obrigatória

- Branch operacional: `nova_desenvolvimento_de_n1`
- Snapshot funcional: `b91223b5fd4363c4969524399416dc37fb7623c8`
- A branch atual pode conter documentação posterior, mas nenhuma deriva funcional pode ser promovida sem validação do Integrador.
- Não transportar branch, PR, commit, binder ou implementação histórica em bloco.
- Não misturar importação de planilha com lote de estoque.
- Não inverter o fluxo de negócio `Transações → Financeiro`.
- Não tocar em superfície congelada.
- Não fazer commit, push ou PR sem ordem expressa do Líder e liberação do Integrador.


## Sua única tarefa funcional

**PERF-001.** Não inclua PERF-002, PERF-003 ou PERF-004.

## Agora, antes do gate

- Ler o arquivo e localizar exatamente o input atual, o listener e o handler existente.
- Preparar o desenho do teste de chamada única.
- Preparar um diff proposto, sem aplicar mutação no código.
- Informar ao Integrador qual arquivo de teste precisa de lock nominal.

## Depois de receber `GATE_LIBERADO`

- Implementar apenas PERF-001.
- Um patch leaf, um comportamento, um teste próprio.
- Entregar diff, teste, logs de runtime, typecheck, build e check de HTML quando aplicável.

## PERF-001

ID: PERF-001  
Fase: FASE 2A  
Tarefa: Reconectar listener de seleção/upload no caminho visual atual.  
Classificação na V4.1: AUTORIZADA_PELA_EVIDÊNCIA  
Pode iniciar agora?: NÃO — leitura e preparação do teste são permitidas; mutação aguarda gate.  
Responsável: Programador Perfil  
Pré-condição: Snapshot `b91223b5fd4363c4969524399416dc37fb7623c8` confirmado; decisões de toolchain concluídas; runtime/typecheck reproduzíveis; lock nominal ativo.  
Path: `src/presentation/perfil/binders/PerfilImportacaoBinder.ts`  
Símbolo: listener do input atual / chamada ao handler existente  
Lock: ALTERAÇÃO_AUTORIZADA_E_NOMINAL, porém inativa para mutação antes do gate.  
Teste: Teste runtime específico para uma chamada exata; deve provar ausência de dupla chamada e uso do input atual.  
Dependência: Gate reproduzível; lock PERF-001; arquivo no snapshot; lock complementar do arquivo de teste.  
Decisão do líder: Nenhuma decisão funcional adicional para este comportamento; toolchain continua obrigatória.  
Risco: ampliar o patch, alterar contrato ou usar código histórico como autorização.  
Condição de parada: Parar se o handler existente não puder ser identificado, se for necessário escolher renderer/confirmar UI, ou se o diff exigir outro arquivo funcional.  
Critério de saída: Seleção chama o handler existente exatamente uma vez; gates e revisão passam.  
Fonte dentro da V4.1: plano_corrigido_fase_2A_patches_autorizados.txt:26-52; matriz_v4_x_fontes_primarias.csv:9; `arquivos_exclusivos_integrador.txt`.  
Confiança: ALTA

### Ficha leaf

- **Responsável sugerido:** Programador Perfil
- **Objetivo:** Reconectar somente o input atual de seleção/upload ao handler de aplicação existente.
- **Pré-condições:** gate completo; snapshot; lock; path/símbolo conferidos; teste nominal reservado.
- **Path autorizado:** `src/presentation/perfil/binders/PerfilImportacaoBinder.ts`
- **Símbolo autorizado:** listener do input atual / chamada ao handler existente
- **Arquivos proibidos:** `src/app/createPerfilUiApp.ts`; binder antigo; qualquer outro arquivo funcional; PERF-002/003/004; renderer, confirmação, filtros, contadores, FAB, bottom sheet e reprocessamento.
- **Comportamento esperado:** Uma seleção válida no input/template atuais chama o handler já existente exatamente uma vez. Nenhum renderer ou fluxo adicional é escolhido.
- **Teste necessário:** Teste runtime específico para uma chamada exata; deve provar ausência de dupla chamada e uso do input atual.
- **Path do teste:** **NÃO NOMINALIZADO NA V4.1.** Antes de mutar qualquer arquivo de teste, o Integrador deve publicar lock complementar de teste sob o mesmo ID, sem ampliar o escopo funcional.
- **Comando de gate aplicável:** runtime = comando aprovado em F1-003; typecheck = comando aprovado em F1-004; build = script `build` pelo package manager canônico; HTML = script `check:no-html-in-ts` quando aplicável.
- **Critério de saída:** Seleção chama o handler existente exatamente uma vez; gates e revisão passam.
- **Dependências:** Gate reproduzível; lock PERF-001; arquivo no snapshot; lock complementar do arquivo de teste.
- **Possíveis conflitos:** Independente de FIN-001/002/003. Conflita com qualquer alteração simultânea no mesmo listener/símbolo ou tentativa de incluir PERF-002/003/004.
- **Solicitação ao Integrador:** Validar diff exclusivo no path/símbolo; publicar lock do teste; executar gate; rejeitar qualquer alteração em superfície congelada.
- **Condição de parada:** Parar se o handler existente não puder ser identificado, se for necessário escolher renderer/confirmar UI, ou se o diff exigir outro arquivo funcional.
- **Entrega esperada:** Patch leaf PERF-001, teste próprio, diff, logs de gate e declaração de ausência de commit/push/PR não autorizados.
