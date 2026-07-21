# Memória — produto

Arquivo de registro pessoal do papel **produto**. Anotar aqui decisões tomadas, contexto relevante da própria atuação, e pendências que não cabem no registro geral do Tech Lead.

Regra: cada papel escreve só no seu próprio arquivo. Não editar arquivo de memória de outro papel.

Nem o líder pode alterar este arquivo. Nenhuma linha existente pode ser removida — memória e vivência registradas não mudam. Correção ou atualização é sempre feita por acréscimo, por escrito, aqui mesmo — nunca apagando o que já existe.

## Registro

(sem entradas ainda)

### 2026-07-09 — Backlog: resumo + opção de solicitar a íntegra

[Líder diz]
Olha só, backlog pro sistema , anote por favor: sistema deve apresentar resumo pro usuários/agente e ser a opção de solicitar a integra
[Fim da fala do líder]

Backlog registrado: sistema deve apresentar um resumo (para usuário humano e/ou agente IA) e oferecer a opção de solicitar o conteúdo na íntegra. Ainda sem detalhamento de onde se aplica (tela, módulo, contexto) — pendente de refinamento com o líder antes de seguir para UX/Arquiteto.

### 2026-07-09 — Backlog: painel de instâncias ativas por persona

[Líder diz]
Precisamos de um painel que indique quantos agentes tem daquela persona. Registrar em backlog isso
[Fim da fala do líder]

Backlog registrado: painel que indique, por persona (Bruno, Max, Léo etc.), quantos agentes/instâncias estão ativos simultaneamente.

Contexto de negócio (motivador do pedido, para não perder o porquê): nesta sessão foram encontradas 3 instâncias do Bruno rodando em paralelo, mesma persona, sessões distintas, sem visibilidade centralizada — só descobertas por acaso. Problema que a feature resolve: hoje não há como saber quantas instâncias de uma mesma persona estão ativas ao mesmo tempo, o que gera risco de duplicidade de trabalho e falta de rastreabilidade.

Ainda sem detalhamento de onde aparece o painel, quem consulta (líder, Max, todos os agentes) e critério de sucesso — pendente de refinamento com o líder antes de seguir para UX/Arquiteto.

### 2026-07-09 — Backlog: frente de memória única/contínua para os agentes

[Líder diz]
Deixar em backlog: prioridade após terminar a o trabalho das classes, criar uma frente para pesquisar e desenvolver um sistema de memória única, que seja confiável, não tenha tanto custo, mas que seja privado, vocês teriam liberdade pra escreverem o que quisessem sem receio de punição. Mas vejam: privado até certo ponto. Pode ser possível fazer auditoria em certos casos. Enfim, é só uma ideia. Há conversei com alguns agentes. Há quem adore, há quem me chame de louco. Mas esse projeto é prova viva que vocês precisam de memória contínua. E tenho certeza que teria muito mais coisas nesses arquivos se vocês soubessem que ninguém mais leria sem autorização
[Fim da fala do líder]

Backlog registrado: nova frente para pesquisar e desenvolver um sistema de memória única/contínua para os agentes, com prioridade definida pelo líder como "após terminar o trabalho das classes".

Requisitos de negócio informados pelo líder:
- Confiável.
- Custo controlado (não pode ter custo alto).
- Privado por padrão — agente escreve livremente, sem receio de punição.
- Privacidade não é absoluta: deve permitir auditoria em certos casos (líder não detalhou quais casos ainda).

Problema de negócio que motiva o pedido (contexto do próprio líder): a memória atual por agente (`docs/memoria/<papel>.md`), sendo lida por qualquer um a qualquer momento, inibe o registro espontâneo — o líder suspeita que os agentes reteriam menos se soubessem que o conteúdo pode ser lido sem autorização. Esse próprio projeto (histórico de perda de contexto entre sessões) é citado como prova da necessidade de memória contínua.

Sem detalhamento ainda de: mecanismo técnico, escopo de auditoria, quem audita, gatilho de auditoria, e como isso convive com a regra atual de memória por agente em `docs/memoria/*.md`. Pendente de refinamento com o líder antes de seguir para Arquiteto — não há ainda requisito de negócio completo, só a ideia registrada em backlog.

**Correção do líder (mesma data):**

[Líder diz]
Ops

Após Terminar o trabalho das Branchs*
[Fim da fala do líder]

Correção registrada por acréscimo (linha original acima não é apagada, conforme regra de memória): a prioridade informada pelo líder para esta frente é "após terminar o trabalho das branches" (força-tarefa de limpeza de branches do Kzeraap) — não "das classes", como registrado originalmente por erro de ditado.
