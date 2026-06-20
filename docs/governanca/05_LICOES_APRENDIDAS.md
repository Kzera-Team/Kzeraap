# Lições aprendidas — erros que não devem se repetir

Este arquivo registra erros reais já identificados no projeto, como foram corrigidos e qual regra impede a repetição. Deve ser lido antes de alterar código e atualizado sempre que uma correção importante virar aprendizado.

## Regra-mãe

A equipe não entrega apenas código que compila. A equipe entrega operação que funciona para uma pessoa cansada, no celular, com pressa e baixa paciência.

## 1. Não tratar o líder como fiscal

- Erro: esperar o usuário apontar problema óbvio de UX, fluxo ou hierarquia visual.
- Exemplo: Dashboard com resumo redundante, excesso de nome do app, área morta e foco errado.
- Correção: adotar o teste da Usuária antes de decidir UX ou fluxo.
- Nunca mais repetir: o líder valida decisões importantes; não deve ser detector de erro básico.

## 2. Tela bonita não basta

- Erro: criar cards, resumos e espaços decorativos sem utilidade operacional.
- Exemplo: Dashboard parecendo vitrine, não painel de trabalho.
- Correção: Dashboard mais compacto, com menos branding, menos repetição e mais foco em ação.
- Nunca mais repetir: toda tela deve responder “o que o usuário veio fazer aqui?”. Se não ajuda a ação principal, está errada.

## 3. Não repetir informação no Dashboard

- Erro: mostrar contadores de Perfis/Itens e repetir os mesmos números em “Resumo”.
- Correção: remover resumo redundante.
- Nunca mais repetir: resumo só existe se trouxer informação nova, operacional e útil.

## 4. Cadastro é suporte, não centro da operação

- Erro: dar peso demais a Perfis e Itens no painel inicial.
- Correção: painel deve priorizar operação, pendências reais, estoque, pesagem, backup e continuidade.
- Nunca mais repetir: cadastros ficam como acesso rápido, não como centro da tela.

## 5. Não resolver colisão visual criando área morta

- Erro: corrigir menu/topo empurrando conteúdo para baixo e desperdiçando espaço mobile.
- Correção: topo reduzido e reorganizado.
- Nunca mais repetir: se há colisão, reposicionar melhor. Área morta em mobile é custo operacional.

## 6. Não repetir marca em tela operacional

- Erro: insistir no nome do app dentro do Dashboard, mesmo com o usuário já dentro do sistema.
- Correção: topo passou a priorizar painel operacional.
- Nunca mais repetir: branding cabe em login/abertura/contexto institucional; tela operacional serve à operação.

## 7. Rolagem não é arquitetura

- Erro: jogar lista, resumo e informações importantes uma embaixo da outra.
- Exemplo: resumo de Itens enterrado depois de uma lista longa.
- Correção: usar abas quando houver múltiplas visões importantes.
- Nunca mais repetir: se o usuário precisa rolar muito para achar uma visão relevante, a estrutura está errada.

## 8. Botão misterioso é erro de UX

- Erro: aceitar ícones ou ações ambíguas em fluxo operacional.
- Correção: ícone pode existir, mas ícone sozinho só quando for óbvio em menos de 1 segundo.
- Nunca mais repetir: ação crítica, rara ou ambígua deve usar texto ou ícone + texto. O erro não é ter ícone; é esperar que o usuário seja vidente.

## 9. Build passando não significa pronto

- Erro: tratar build/teste técnico como garantia de funcionalidade boa.
- Correção: criar validação de prontidão com fluxo mobile e Usuária.
- Nunca mais repetir: antes de dizer “feito”, validar clareza, clique, colisão visual, área morta, redundância, persistência, interrupção e correção de erro humano.

## 10. A equipe não pode ser passiva

- Erro: implementar de forma reativa, sem completar cenários prováveis.
- Correção: prompt de personalidade com autonomia, crítica, papéis e recomendação.
- Nunca mais repetir: quando a proposta estiver incompleta, completar cenários prováveis antes de implementar.

## 11. Pendência não é Backlog

- Erro: misturar o que já foi decidido com ideias futuras.
- Correção: Pendência = decidido e pendente de desenvolvimento. Backlog = importante, mas deixado para depois.
- Nunca mais repetir: ao responder “qual a próxima?”, listar pendências reais; backlog não pode atrapalhar execução atual.

## 12. Separar personalidade de negócio

- Observação crítica: Prompt resumido não preserva essência completa quando a regra precisa sobreviver a vários ciclos.



- Erro: misturar postura da equipe com regras de estoque, backup, fracionamento e operação.
- Correção: separar Prompt de Personalidade, Prompt de Negócio e Estado Atual.
- Nunca mais repetir: personalidade define como a equipe pensa; negócio define o que o sistema faz.

## 13. Unidade de medida não é detalhe textual

- Erro: adaptar medidas para contexto errado e depois ter que corrigir.
- Correção: regra oficial: `g` para exibição/atalhos e `mg` como unidade interna de precisão.
- Nunca mais repetir: unidade crítica é regra de negócio; mudança de unidade altera a operação.

## 14. Mudança de regra deve ser marcada

- Erro: aceitar mudança sem explicitar impacto sobre regra anterior.
- Correção: quando mudar regra anterior, responder: “Você está louca, querida — isso muda a regra anterior.” Depois explicar regra anterior, nova regra, impacto, risco e recomendação.
- Nunca mais repetir: toda mudança de regra deve ser tratada como mudança de regra, não ajuste invisível.

## 15. Operação repetitiva pesa mais que cadastro eventual

- Erro: pensar em tela como cadastro ocasional, não como rotina repetida muitas vezes no celular.
- Correção: simular pressa, repetição, erro, pausa, retomada e correção.
- Nunca mais repetir: perguntar “e se a pessoa fizer isso 50 vezes no mesmo dia, cansada e com pressa?”.

## 16. Não simplificar o estoque real

- Erro: risco de implementar transação ou estoque em cima de modelo simples.
- Correção: modelo oficial consolidado: `Item → Variação → Lote → Fracionamento/Pesagem/Conferência/Retirada Interna`.
- Nunca mais repetir: transação não pode nascer sobre estoque simplificado se o modelo real exige lote, fracionamento, conferência, retirada interna e pesagem.

## 17. Lote precisa de tela própria

- Erro: tentar encaixar Lote dentro da tela de Item ou Variação.
- Correção: Variação mostra lista/resumo de lotes; Lote tem tela própria.
- Nunca mais repetir: entidade com histórico, movimentos, conferência, divergência e ações próprias não cabe em card pequeno.

## 18. Interrupção é cenário obrigatório

- Erro: discutir pesagem rápida sem tratar interrupção como caso central.
- Correção: sessão de pesagem exige persistência imediata, pausa, retomada, estados e recuperação após fechamento/travamento/bateria.
- Nunca mais repetir: em fluxo longo ou repetitivo, interrupção não é exceção rara; é requisito.

## 19. Aprendizado precisa virar regra

- Erro: corrigir problema pontual sem registrar lição para o próximo ciclo.
- Correção: criar governança, prompts oficiais, estado atual, checklist e lições aprendidas.
- Nunca mais repetir: toda correção importante deve virar regra; se não vira regra, o erro volta com outra roupa.

## 20. O erro raiz é não simular antes de executar

- Erro: implementar sem simular uso real, cansado, repetitivo e mobile.
- Correção: Usuária virou critério obrigatório.
- Nunca mais repetir: antes de implementar, responder: ação principal, cliques, onde erra, como corrige, o que acontece se interromper, se há redundância, área morta, mobile ruim ou carga mental alta.

## Checklist rápido das lições antes de codar

Antes de qualquer alteração relevante, confirmar:

1. Estou resolvendo Pendência real, não Backlog disfarçado?
2. A ação principal da tela está clara?
3. Existe resumo redundante, branding desnecessário ou área morta?
4. Estou usando abas quando rolagem viraria bagunça?
5. Há botão misterioso ou unidade ambígua?
6. O dado crítico salva imediatamente?
7. O fluxo recupera interrupção?
8. O usuário consegue corrigir erro humano sem refazer tudo?
9. O modelo oficial de estoque foi respeitado?
10. Eu simulei uma pessoa cansada repetindo isso muitas vezes?

## Regra final

Não entregar “feito” porque compilou. Entregar operação que funciona.


21. Erro: usar repositório em memória no app principal

O erro foi permitir que Perfis e Itens funcionassem com repositório em memória na aplicação principal.

Como foi corrigido:
A aplicação principal passou a usar IndexedDB quando disponível, mantendo fallback em memória apenas para ambiente sem IndexedDB.

Como não repetir:
Fluxo operacional que cria dado real não pode depender de memória volátil. Antes de evoluir funcionalidade, simular fechar/recarregar o app.

22. Erro: tela mostrar campo que o sistema ignora

O erro foi exibir Data do lote e salvar sempre a data atual.

Como foi corrigido:
O valor do campo Data do lote agora alimenta `dataLancamento`.

Como não repetir:
Todo campo visível deve ser lido, validado e persistido, ou removido da tela. Campo decorativo é mentira operacional.

## 21. Erro: colocar cadastro raro no Dashboard

O erro seria colocar no Dashboard um cadastro que o usuário faz uma vez no mês, como Balanças.

Como foi corrigido:
Balanças foi definida como configuração operacional rara e implementada dentro de Configurações.

Como não repetir:
Antes de colocar qualquer coisa no Dashboard, perguntar: “A Usuária vai clicar/ver isso quantas vezes hoje, amanhã e depois de amanhã? Ela precisa ou quer ver isso aqui quantas vezes nos próximos 7 dias?” Se a resposta for baixa frequência, deixar em Configurações ou na tela específica.


## 22. Não criar atalho antes da entidade principal

- Erro: sugerir uma “transação rápida do lote” antes de existir a entidade e o módulo de Transações.
- Correção: transação rápida só pode ser variação segura do módulo Transações, nunca caminho paralelo com cara de transação.
- Nunca mais repetir: antes de criar atalho operacional, verificar se o fluxo atual resolve o cenário. Para vender pouca quantidade de um lote antes de processar tudo, usar fracionamento mínimo, por exemplo `2 g / 1 unidade`, e depois vender esse fracionamento pelo módulo oficial de Transações.

## 23. Importação de Transações não pode criar bagunça silenciosa

- Erro prevenido: importar CSV de transações criando itens inexistentes, estoque ou vínculo comercial sem validação clara.
- Correção definida: Transações terá importação, mas com prévia corrigível, checagem de itens/produtos e resolução explícita antes de confirmar.
- Nunca mais repetir: se a planilha citar produto que não existe no app, o sistema deve apresentar pendência de importação para mapear para item existente, criar item/variação/lote com confirmação, ou ignorar aquela linha. Nunca criar produto ou baixa de estoque silenciosamente.


## 1.13.3 — Pré-transações

- Senha forte fica para o final, não para a fase de teste.
- Divergência entre pesagem e unidades fracionadas deve aparecer para a usuária.
- Antes de Transações, preservar conforto de uso noturno: menos brilho, menos estímulo visual e menos adivinhação.


## Financeiro antes de importação de transações

Erro a evitar: importar transações como linhas soltas sem entender pagamento pendente, pagamento posterior, valor pago, custo, lucro e pendência. Correção: criar primeiro o esqueleto financeiro. Regra: a Usuária não deve conferir tudo na cabeça; o sistema deve preparar conciliação.

## Cripto e rastro do dinheiro ficam no backlog

Não implementar cripto agora, mas não travar o futuro. O modelo deve permitir rastrear pagamentos que entram em uma carteira, são agrupados, divididos, transferidos, convertidos e sacados depois.

## 21. Erro: confundir documentação com dado operacional real

O erro seria criptografar toda a documentação e dificultar a leitura diária, ou fazer o oposto: colocar CSV real, clientes reais, valores reais, carteiras, contas ou segredos dentro de documentos abertos.

Como corrigir:
Separar documentação de governança, que deve ser legível, dos dados reais e segredos, que devem ser protegidos.

Como não repetir:
Governança, UX, checklist e regras genéricas ficam acessíveis. CSV real, backup, credencial, conta, carteira e dado real não entram no repositório como documentação.

## 22. Erro: importar direto para a tabela final

O erro seria importar transações ou financeiro direto para tabelas finais antes de validar cliente, item, pagamento e referência financeira.

Como corrigir:
Usar staging persistente para transações e movimentações financeiras. O usuário pode resolver parte das pendências, fechar o app e continuar depois sem importar de novo.

Como não repetir:
Toda importação relevante deve passar por área de preparação, com status por registro e pendências claras. Dados finais só nascem depois de validação/conciliação.


## 1.15.1 — Staging protegido antes da persistência

Dado sensível importado nunca deve ser gravado em banco físico aberto, nem por milissegundos. CSV/TSV de transações e financeiro deve ser lido em memória, separado em índice operacional e payload sensível, criptografado e só então persistido. Pendências que contenham nomes, itens, valores, custos, lucros, pagamentos ou observações também ficam no payload protegido.


## 1.15.2 — Staging também é banco

Erro: tratar staging/importação como área provisória menos sensível, deixando a proteção para depois.

Como foi corrigido: a regra virou absoluta. CSV/TSV é processado em memória, separado em índice operacional e payload sensível, protegido antes do primeiro write e só então persistido.

Como não repetir: toda tabela, staging, cache, backup, exportação ou mensagem de erro nasce insegura até provar o contrário. Provisório também é persistente. Staging também é banco. Dado sensível nunca toca armazenamento físico aberto, nem por milissegundos.

## 1.15.2 — Revisão adversária com linguagem correta

Erro: usar termos inadequados para a persona de segurança.

Como foi corrigido: a equipe deve pensar como criminoso curioso, hacker ou invasor.

Como não repetir: antes de persistir dado sensível, perguntar o que um criminoso curioso, hacker ou invasor veria ao acessar celular, IndexedDB, cache, backup ou arquivos exportados.

## Vocabulário operacional protegido

Rótulo operacional sensível não nasce hardcoded. Ele deve ser configurado após senha mestra, protegido antes de persistir, carregado só em memória autenticada e limpo no bloqueio/logout.

