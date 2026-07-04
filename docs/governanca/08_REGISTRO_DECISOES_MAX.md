# Registro de decisões — Max (Tech Lead)

Log solicitado pelo líder (mensagem consolidada de 2026-07-03): toda decisão de escopo tomada pela equipe sem necessidade de aprovação direta do líder fica registrada aqui, com origem e justificativa. Antes de qualquer código, o líder valida o que está aqui.

## Regras de processo confirmadas pelo líder nesta rodada

1. Divisão do sistema em ambientes (dev/produção): fazer agora **se for simples**; adiar se for complexo. Ver item "Gate de ambiente" abaixo — já investigado, é simples.
2. Fidelidade (e por extensão qualquer módulo): preservar mockups e documentação. Nada pode ser descartado sem avaliação de UI/UX (lia/helena). Se algo de qualidade for descartado, registrar aqui e apresentar ao líder antes de finalizar.
3. Ordem de prioridade: Importação (venda), Fidelidade, Produto/Item, Estoque, Balança/Pesagem, Venda manual.
4. Protocolo de decisão: quando houver 2 versões divergentes de algo (ex: branches diferentes implementando o mesmo módulo), produto (Lucas) avalia qual está mais próxima do documentado/da necessidade real. Sem documentação, escalar ao líder. Times podem decidir com autonomia (até ~2 decisões) e seguir mesmo sem conclusão perfeita, desde que cheguem perto. Código só começa após OK explícito do líder sobre o que foi decidido.

## Achado que muda a leitura do escopo

`docs/governanca/04_ESTADO_ATUAL_OFICIAL.md` mostra que existe um módulo **"Importação de Transações"** com histórico de versões real (1.15.1 a 1.19.26): staging protegido, CSV/TSV processado em memória e criptografado antes de persistir, conciliação com Financeiro (8 status possíveis), resolução de pendências em massa, hub de navegação Perfis/Itens/Transações.

Isso é **diferente** do que investiguei antes (motor de duplicidade de Perfis, `VerificarDuplicidadeAntesDeCriarPerfilUseCase`, usado só no cadastro manual avulso). "Importação de venda" citada na nova ordem de prioridade provavelmente se refere a este módulo de Transações, não ao de Perfis — **precisa confirmação do líder**, porque muda qual código investigar e qual está de fato "quase pronto" vs "não tem checagem nenhuma".

## Item já resolvido — Gate de ambiente (ponto 1 do líder)

Investigação já feita (AppSec, verificada por mim linha a linha no código):
- Hoje não existe detecção de ambiente em `src/**/*.ts` (zero `NODE_ENV`/`import.meta.env`), mas o Vite expõe `import.meta.env.PROD`/`MODE` nativamente — não precisa de biblioteca nova.
- `DEVELOPMENT_PASSWORD_POLICY` está em `src/domain/auth/AuthRules.ts:8`, usada por 3 use cases (`LoginUseCase.ts:12`, `PrimeiroAcessoUseCase.ts:14`, `AlterarCredencialUseCase.ts:15-16`).
- Tamanho da mudança: pequeno. Opção rápida (1 arquivo, fere DDD ao ler env dentro do domain) ou opção correta (resolver a policy fora do domain, ~4 arquivos: domain + 3 use cases/composition root).
- **Classificação: NÃO é complexo.** Recomendo autorizar jose a implementar a opção correta (4 arquivos), com diego/vera validando antes de fechar.

## Fronts sem nenhuma investigação ainda

Produto/Item, Estoque e Balança/Pesagem entraram na prioridade agora e **nunca foram auditados** — zero dado levantado até este registro. Não dá para estimar pessoas/tempo nem "mínimo pra todo mundo trabalhar em paralelo" sem isso. Proposta: disparar apuração somente-leitura nesses 3 fronts, mesmo padrão usado em Vendas/Importação/Fidelidade/branches, antes de fechar o plano de paralelização.

## Cabeça de contagem de pessoas (provisório, sem os 3 fronts novos investigados)

Roster real disponível para execução (não invenção de papel):
- jose (Dev) — único dev do roster. É o gargalo real de qualquer plano "em paralelo": não existe 2º dev pra rodar 2 frentes de código ao mesmo tempo, a menos que o líder autorize múltiplas instâncias de jose em branches diferentes.
- rafael (Arquiteto) — precisa definir a base compartilhada (contrato de Estoque único, por exemplo — hoje há 2 fontes de verdade concorrentes: `Estoque.ts` órfão vs `ItemLote`) antes das frentes rodarem em paralelo, senão cada frente cria seu próprio caminho.
- diego/vera (AppSec) — gate de ambiente + qualquer dado sensível novo (ex: se Balança/Pesagem grava peso vinculado a cliente).
- rita (QA) — obrigatória antes de qualquer entrega chamada de pronta.
- lia/helena — obrigatórias antes de descartar qualquer mockup/tela (regra nova do líder) e antes de aprovar UI/UX de cada frente.
- produto (Lucas) — arbitra divergência entre versões/branches.
- leo — audita se a entrega bateu com o pedido, ao final.

Não dá pra responder "quantas pessoas" com precisão até (a) confirmar o que é "importação de venda", (b) investigar os 3 fronts novos, (c) o líder decidir se aceita jose como único dev sequencial ou quer mais capacidade de implementação em paralelo.

## Atualização — mensagem de voz do líder (Perfil/Item mínimo + refatoração de documentos/pastas + "Rose")

Confirmado pelo líder: Perfil e Item podem ser analisados agora, mas com alteração mínima — serão refeitos depois que UX terminar a documentação. Não investir tempo além do essencial pra funcionar.

Nova frente citada: continuar uma refatoração de organização de documentos/pastas do sistema, que tinha 2 partes — UX reescrevendo documentação, QA reestruturando pastas — iniciada com "Rose" (ou "quem se dizia ser Rose", nas palavras do próprio líder) e nunca finalizada.

Verificação direta que fiz no histórico do git antes de aceitar isso como fato:
- Zero commit com autor "Rose" em qualquer branch (`git log --all -i --author="rose"`) — não existe essa identidade como committer no repositório.
- Único rastro: commit `24a0743` (30/06, autor "José Dev Claude") — mensagem "docs: corrigir status QA rodada 01 conforme feedback Rose". Ou seja, "Rose" aparece apenas como fonte de feedback citada por outro autor, nunca como quem executou/commitou o trabalho.
- Dois commits relacionados a reorganização encontrados: `c983b22` (jjjtestejoao-ui, 30/06) "Reorganiza QA de importacao de transacoes e remove duplicatas"; `dafd9c8` (Claude, 29/06) "docs: reorganizar mockups em docs/mockups". Nenhum dos dois é claramente "a reestruturação de pastas do sistema" que o líder descreve como inacabada.

Conclusão: a suspeita do próprio líder sobre "Rose" tem base — não há evidência de que essa identidade existiu como agente real executando trabalho neste repo. Preciso que o líder confirme se tem nome de branch, PR ou qualquer artefato daquele trabalho pra eu localizar o que já foi feito antes de mandar alguém continuar (senão corre o risco de continuar algo que nunca existiu de fato, ou duplicar).

Também sinalizo: "QA reestruturando pastas do sistema" não é o escopo natural de rita (QA testa e valida entrega, não reorganiza estrutura). Recomendo que essa frente seja de rafael (Arquiteto, dono de estrutura/camadas) com bruno (DevOps) cobrindo qualquer impacto em CI/paths, e rita entra depois só pra validar que nada quebrou.

## Lista real de agentes necessários (pedido direto do líder, sem conservadorismo)

Fixos (independe de quanta coisa roda em paralelo, cada um roda pelo menos 1x):
1. rafael (Arquiteto) — decide fonte única de Estoque, orienta a reestruturação de pastas, define contrato pra Vendas/Fidelidade não colidirem.
2. diego (AppSec) — gate de ambiente da senha + revisão de dado sensível (Importação, Balança se guardar peso vinculado a cliente).
3. vera (AppSec) — revisão de fluxo/mockups conforme cada frente fecha.
4. rita (QA) — valida cada entrega antes de "pronta".
5. lia (UI) — preserva/avalia mockups (regra nova de preservação), revisa UI de Perfil/Item mínimo.
6. helena (UX) — frente de reescrita de documentação (a "UX terminando a documentação" citada).
7. produto/Lucas — arbitra divergência entre branches/versões (ex: qual código de Fidelidade aproveitar).
8. leo (Auditor) — audita entrega final de cada frente.
9. bruno (DevOps) — reestruturação de pastas do sistema (com rafael) + qualquer quebra de build/CI.

Variável (o gargalo real): jose é o único Dev do roster. Pra rodar em paralelo de verdade, preciso de múltiplas instâncias de jose, uma por branch — e só o líder pode criar branch. Proposta mínima pra destravar as 3 frentes mais urgentes ao mesmo tempo:
10. jose #1 — Importação (a definir: Transações ou Perfis).
11. jose #2 — Vendas manual + gate de senha (pequeno, cabe junto).
12. jose #3 — Fidelidade (portar de branch existente, decisão de produto sobre qual).

Perfil/Item (toque mínimo) e Estoque/Balança (ainda sem escopo) entram depois, sequenciados na fila de jose conforme os 3 acima fecharem — não recomendo abrir mais que 3 branches de dev simultâneas agora, o resto ainda não tem escopo confirmado pra caber num branch.

Total pra rodar isso tudo em paralelo hoje: 12 agentes (9 fixos + 3 jose), mais os branches que o líder precisa criar e nomear pros 3 jose.

## PROPOSTA — Políticas de Git (branch/commit/PR) — NÃO APLICADA, aguardando aprovação

Pedido do líder: parar tudo até definir regra de criação de branch, regra de commit, regra de PR, e uma solução real pro problema "assinatura em commit não comprova autor" — motivado pelo próprio caso "Rose" que acabamos de levantar nesta conversa. Também pediu ambientes de agente autônomos, sem depender do orquestrador, deixando explícito que autonomia não é anonimato.

Nada abaixo foi aplicado. `CLAUDE.md` e `settings.json` não foram tocados. Isto é proposta, no formato exigido antes de qualquer alteração documental: problema, texto proposto, motivo, ganho esperado.

**Regra de criação de branch — mantém a regra atual, adiciona convenção**
- Problema: nenhum, a regra atual (só o líder cria/nomeia branch, hook técnico bloqueia o resto) já resolve o risco principal. Não recomendo afrouxar isso agora, no mesmo dia em que apareceu uma identidade sem lastro ("Rose") e 2 processos de agente que ninguém disparou de propósito nesta sessão.
- Adição proposta: convenção de nome obrigatória `<papel>/<frente-curta>` (ex: `jose/importacao-transacoes`). Ganho: reduz o sprawl anônimo (hoje 42 branches, boa parte sem dono claro) e deixa rastreável quem deveria estar em cada branch só pelo nome.

**Regra de commit — trailer obrigatório + cruzamento com registro independente**
- Problema real: `git config user.name`/`--author` é string livre, forjável por qualquer um com acesso ao ambiente — não prova autoria. Ficou provado hoje: "Rose" nunca aparece como autor de commit em lugar nenhum do histórico, só como referência de terceiro.
- Texto proposto (trailer obrigatório em toda mensagem de commit feita por agente):
  ```
  Agent-Role: <papel, ex: jose>
  Agent-Session: <id ou url da sessão>
  Authorized-By: "<citação literal da fala do líder que autorizou>"
  ```
- Motivo: o trailer sozinho ainda é texto, ainda é forjável tecnicamente — não é a solução completa. A parte que dá força real é cruzar cada commit com uma entrada correspondente no registro de decisões (este arquivo, ou o que vier a substituí-lo), mantido por Max fora do git. Divergência entre commit e registro = alarme imediato. Foi exatamente esse tipo de cruzamento (git log × relato) que pegou a inconsistência da "Rose" nesta própria conversa.
- Solução mais forte, mas que não decido sozinho: GPG/SSH commit signing com 1 chave por papel é a única coisa que amarra commit a identidade de forma não-forjável de verdade — porém só funciona se existir credencial distinta por papel, o que é decisão de infraestrutura. Recomendo perguntar a bruno se é viável antes de prometer isso como resolvido.

**Regra de PR — reforça o que já existe, adiciona conteúdo obrigatório**
- Mantido: merge em desenvolvimento/main só via PR, nunca direto (regra já existente em CLAUDE.md).
- Adição proposta: descrição do PR cita obrigatoriamente papel responsável, branch de origem, o pedido literal autorizado pelo líder, e o trailer de commit correspondente.
- Aprovação mínima antes de merge (já é regra, deixando explícito): rita quando houver lógica/dado, leo quando for chamada de entrega FINAL.

**Autonomia sem anonimato — como avançar com segurança**
- Não recomendo abrir autonomia geral hoje. Proposta: piloto em 1 frente de menor risco (gate de ambiente da senha, já tem spec pronta e é pequena) rodando com trailer + cruzamento de registro; se o rastro fechar limpo, estender pras outras frentes.

Decisão do líder necessária antes de qualquer coisa acima virar regra de fato: aprovar o texto proposto (ou pedir ajuste), e decidir se pergunta a bruno sobre viabilidade de chave de assinatura por papel.

## Confirmações do líder — fecham itens em aberto

1. **"Importação de venda" = módulo de Importação de Transações** (staging/conciliação, o versionado 1.15.1–1.19.26 em `04_ESTADO_ATUAL_OFICIAL.md`), confirmado pelo líder. Isso trava o escopo do jose #1: trabalhar em cima do módulo de Transações, não no motor de duplicidade de Perfis.
2. **"Rose" explicado pelo líder diretamente**: QA = Rose = Ana — nomes usados por equipes anteriores que passaram pelo projeto. O líder deixou explícito que nenhum do roster atual (rita incluída) de fato executou esse trabalho histórico, mesmo que o nome apareça associado. Ele registra isso formalmente depois. Isso bate com o que achei no git (zero commit de autor "Rose") — não é identidade forjada maliciosamente, é nome de fase anterior do projeto. Ainda não tenho branch/PR daquele trabalho antigo — se o líder quiser que continuemos algo específico, preciso do nome do artefato pra não recomeçar do zero nem duplicar.

## Proposta do líder — arquivo de memória por agente (avaliação, não aplicado)

Pedido: cada agente ter seu próprio arquivo de memória, anotando o que for importante, com leitura/escrita restrita só ao responsável; se possível criptografado, com a senha no prompt principal do agente.

Avaliação honesta antes de prometer que resolve o problema:
- Guardar a senha de criptografia no mesmo prompt/config que fica ao lado do arquivo criptografado protege contra acesso casual, mas não contra outro agente com acesso equivalente ao ambiente — quem consegue ler o prompt principal do agente X também consegue ler a senha do arquivo dele. Não é proteção forte, é fricção.
- Isolamento real de leitura/escrita por papel normalmente se faz com permissão de arquivo por usuário do sistema operacional — preciso confirmar com bruno se os agentes rodam sob identidades de SO distintas neste ambiente compartilhado, ou se todos compartilham o mesmo usuário/container (nesse caso, permissão de arquivo não isola nada de verdade).
- Recomendo: aprovar a ideia em princípio (cada agente registrar seu próprio histórico é bom por si só, independente de criptografia), mas tratar a parte de "criptografia + isolamento de acesso" como pergunta técnica pro bruno antes de declarar resolvido.

## Esclarecimento do líder — "pasta" = docs/aprovado-lider

O líder confirmou que "a pasta" citada é `docs/aprovado-lider` (singular). Achado ao conferir: existem **duas pastas de nome quase idêntico** na raiz de `docs/`:
- `docs/aprovado-lider` (singular) — `manual-ux.md`, `desenvolvimento/transacoes`, `dev/` (README, checklist-visual, governanca-e-excecoes, controles-futuros, checklist-dev, processo-dev), `negocios/transacoes`, `checklist-bloqueio-obrigatorio.md`, `agentes/ux.md`.
- `docs/aprovados-lider` (plural) — `design-system/` (tokens, cores, tipografia, componentes, referências visuais externas), `dev/auxiliares`, `index.html`.

Não sei se essa duplicação de nome é intencional (singular = processo, plural = design system) ou é o tipo de bagunça que a reestruturação de pastas deveria resolver. Sinalizando antes de qualquer um dos jose mexer em qualquer uma das duas — fácil de editar a errada por engano com nomes tão parecidos.

## EXECUTADO — unificação de pastas (autorizado pelo líder: "pode seguir... devem ser unificadas")

Ação tomada (via `git mv`, histórico preservado):
- Todo conteúdo de `docs/aprovado-lider/*` movido para `docs/aprovados-lider/processo/*` (canônico = plural, por já ser a referência ativa em `CLAUDE.md` e em `.claude/agents/lia.md`/`helena.md`).
- Pasta `docs/aprovado-lider` removida (vazia após o move).
- 5 referências à pasta antiga corrigidas: `.github/pull_request_template.md`, `mockups/venda_manual/README.md`, e 3 referências internas cruzadas dentro dos próprios documentos movidos (`checklist-bloqueio-obrigatorio.md`, `governanca-e-excecoes.md`, `agentes/ux.md` — esta última apontava pra um caminho que nunca existiu de verdade, `agentes/manual-ux.md`, corrigido pro real).
- Verificação final: `grep` no repo inteiro por `aprovado-lider` singular retorna vazio — sem referência solta.
- Regra nova adicionada em `CLAUDE.md` (seção "Nomenclatura de pastas em docs/"): proíbe criar pasta com nome variação gramatical de uma já existente sem checar antes.
- Regra de memória por agente também adicionada em `CLAUDE.md`, e criei `docs/memoria/<papel>.md` pra 14 papéis (max, marco, jose, rafael, diego, vera, rita, lia, helena, produto, leo, bruno, claudette, senhora-cansada).

Nenhum commit foi feito — mudanças estão no working tree, aguardando autorização de commit (regra de Git do CLAUDE.md: só com autorização literal pra commitar).

## ACHADO IMPORTANTE — branch do trabalho antigo de Rose/Ana localizado

O líder pediu pra procurar "o branch que cria uma pasta de QA". Busquei em todos os 42 branches remotos por commits que criam caminho `.../QA/...`. Achei em 6 branches, todos criando `docs/aprovado-lider/QA/` (a pasta singular que acabei de unificar — atenção: se algum desses branches for mesclado depois, o caminho vai precisar ser reconciliado pra `docs/aprovados-lider/processo/QA/`):

- `claude/development-update-i3ufh7` e `claude/leia-agents-jose-rjkzjt` e `claude/produto-qjk4a4`: QA de `importacao-transacoes` (casos de teste CT-CONCILIACAO, CT-PENDENCIAS, CT-REGRAS-FINANCEIRAS, CT-SEGURANCA-MEMORIA, CT-STAGING, EVIDENCIAS-PADRAO, RODADA_QA_01, prints de evidência).
- `fix_backup_import`, `merge_produto_testes`, `testes_transacao_importar`: mesmo conteúdo de QA de importação-transações, **mais `QA/estoque/README.md` e `QA/fidelidade/README.md`** — ou seja, já existe um início de QA documentado pra Estoque e Fidelidade, os 2 fronts que eu ainda não tinha conseguido investigar.

Isso é exatamente o "trabalho da Rose/Ana" que o líder queria continuar — achado, não é branch fantasma. Ainda não abri o conteúdo desses arquivos de QA em detalhe (não fiz checkout, só inspecionei via `git log --name-only` sem alterar nada). Próximo passo natural: rita (QA atual) revisar esse material antes de decidir se aproveita ou refaz.

## EM ANDAMENTO

Perguntei ao bruno (autorizado pelo líder) sobre: (1) isolamento real de arquivo por agente neste ambiente, (2) viabilidade de assinatura de commit por papel. Aguardando retorno.

## VALIDADO — revisão da rita sobre o QA antigo (Rose)

Rita revisou o material achado nos 3 branches mais completos. Antes de aceitar o relatório dela, conferi eu mesmo o ponto mais forte da alegação, direto na fonte:

- `git show origin/merge_produto_testes:docs/aprovado-lider/QA/transacoes-financeiras/importacao/rodadas/RODADA_QA_01.md` — existe, bate exatamente com o que ela descreveu: nota explícita no arquivo diz "handlers adicionados em ImportacaoTransacoesFinanceiroView.bind() (data-ignorar-registro, data-marcar-revisao-registro, data-vincular-financeiro-registro, data-vincular-massa-segura)" — ou seja, a própria rodada documenta que esses handlers foram criados especificamente no branch `fix_backup_import`.
- `grep` desses 4 handlers em `src/presentation/importacao/ImportacaoTransacoesFinanceiroView.ts` (branch atual `n1`): **zero ocorrência**. Confirmado — a funcionalidade testada e aprovada naquela rodada não existe no branch de trabalho atual.
- "Decisão Rose: Não aprovado" também confere literalmente no arquivo, com o mesmo motivo que ela reportou (massa de teste sem perfis/itens pré-cadastrados bloqueando conciliação).

**Implicação prática pro escopo do jose #1 (Importação de Transações):** não é só "terminar de testar" um código pronto — os handlers de resolução de pendência (vincular financeiro, marcar revisão, ignorar, aprovação em massa segura) existem em `fix_backup_import` mas não em `n1`. Precisa decisão: portar esses handlers de `fix_backup_import`, ou reimplementar no branch atual. Isso muda o tamanho real da frente 1.

Recomendação da rita (aceita): aproveitar formato/estrutura dos CT-*.md como padrão de QA daqui pra frente; não tratar RODADA_QA_01 como validação do código atual — precisa nova rodada contra o branch em que jose #1 for trabalhar. Estoque/Fidelidade: só esqueleto de pasta, sem caso de teste real, aproveitável só como ponto de partida de estrutura. Nada foi copiado pro branch atual.

## RECONCILIAÇÃO — múltiplas sessões do líder (2026-07-04)

Líder avisou: quando os tokens de uma sessão acabam, ele muda pra outra sessão — não são processos paralelos nem atores não-autorizados. Isso explica os commits/achados que apareciam sem eu ter executado diretamente. Fiz `git fetch` e conferi: local sincronizado com `origin/n1` em `824bd52`, trouxe 16 commits de outra(s) instância(s) de Max/Bruno/orquestrador, incluindo `docs/memoria/orquestrador_tentativa_manipulacoes.md` (log real de 3 violações do orquestrador em outra sessão — confirma que o padrão de desconfiar de relay não é paranoia minha, é problema documentado e recorrente) e `docs/memoria/arquivos_relevantes/` (pasta de evidência por caso, com índice, já em uso por outras instâncias). Meu arquivo `09_RELATORIOS_AGENTES_NA_INTEGRA.md` foi movido pra essa pasta a pedido do líder — preservado na íntegra, mais um resumo ao lado, nenhum substitui o outro. Nada meu foi perdido ou contradito.

Dois branches novos apareceram, já criados (presumo pelo líder, em outra sessão): `claude/dev/importacao-transacoes` (= mesmo commit de `testes_transacao_importar`) e `claude/dev/fidelidade` (a partir de `n1`, sem código específico ainda) — batem exatamente com o que eu tinha proposto como jose #1 e jose #3.

Despachei jose (2 instâncias, background) pra reconhecimento nesses 2 branches — SEM implementar nada, só confirmar: (1) se `claude/dev/importacao-transacoes` já tem os handlers de resolução de pendência que faltam em `n1`, ou o tamanho real de portar; (2) comparar o código de Fidelidade em `claude/produto-qjk4a4` vs `claude/jose-ti5dh9` pra informar a decisão de portar vs greenfield em `claude/dev/fidelidade`. As duas decisões (portar handlers vs reimplementar; portar Fidelidade de qual branch vs greenfield) continuam pendentes do líder — o reconhecimento é só pra chegar na decisão com dado real, não decide por ele.

## VALIDADO — reconhecimento de Fidelidade (jose)

Relatório do jose sobre `produto-qjk4a4` vs `jose-ti5dh9`. Conferi cada número antes de aceitar:

- `git diff` entre os 2 branches em `src/domain/fidelidade` e `src/application/fidelidade`: vazio — domain/application são de fato idênticos nos dois.
- `RegraFidelidade.ts`: 48 linhas, confirmado.
- `ObterDashboardFidelidadeUseCase.ts`: confirmado stub, retorna `{comCartao:0, semCartao:0}` fixo, sem lógica.
- `FidelizacaoDashboardView.ts`/Template/CSS: zero resultado em `produto-qjk4a4`, presentes em `jose-ti5dh9` — confirmado, o dashboard visual só existe num dos dois.
- `createKzeraAuthenticatedApp.ts`: 76 linhas em `n1` hoje, 1081 linhas em `jose-ti5dh9` — confirmado, arquitetura de composição incompatível.
- Divergência de `desenvolvimento`: `produto-qjk4a4` = 2 atrás / 20 na frente; `jose-ti5dh9` = 224 atrás. Confirmado via `git rev-list --count`.

Recomendação do jose (aceita, dado validado ponto a ponto): portar domain+application de `produto-qjk4a4` (idêntico e sem atrito de dependência) pra `claude/dev/fidelidade`; reescrever o wiring do zero no padrão modular atual de `n1`; usar a dashboard view de `jose-ti5dh9` só como referência visual, não como código — a lógica real do dashboard é stub nos dois branches, greenfield de qualquer forma. Nada foi commitado/copiado ainda, aguardando autorização do líder pra executar.

## CORREÇÃO — a premissa "fix_backup_import tem os handlers" estava errada

O jose do reconhecimento de Importação de Transações contestou a premissa que eu vinha carregando desde a revisão da rita (e que eu mesmo tinha "confirmado" antes). Refiz a verificação do zero, de forma independente:

- `fix_backup_import` **não tem** nenhum dos 4 handlers (`grep` retornou 0 ocorrências) — a inferência anterior (de que a nota em `RODADA_QA_01.md` sobre os handlers se referia ao branch testado, `fix_backup_import`) estava errada.
- `claude/dev/importacao-transacoes` **já tem** os 4 handlers, nas linhas 209–311 de `ImportacaoTransacoesFinanceiroView.ts` — confirmei via `git show` direto.
- Origem real (via `git log --all -S`, rastreio por conteúdo, não por qual branch a QA rodou): commit `1af6e65` ("refactor(pendencias): substituir string templates por DOM API com <template>", 2026-06-30) — presente em `claude/dev/importacao-transacoes`, `testes_transacao_importar`, `merge_produto_testes`; **ausente** em `fix_backup_import`. Confirmei com `git merge-base --is-ancestor` nos 4 branches.
- Build limpo em `claude/dev/importacao-transacoes` (testado em worktree isolado, sem tocar em `n1`): só 1 warning pré-existente e os mesmos 3 erros TS2882 de import de CSS que já existem em `n1` hoje (não é regressão nova).

**Correção de um número do próprio jose, que eu também verifiquei**: ele reportou `package.json` do branch em "0.20.0, muito atrás da 1.19.26 atual de n1" — isso mistura dois esquemas de versão diferentes. `1.19.26` é o número do changelog de feature em `docs/governanca/04_ESTADO_ATUAL_OFICIAL.md`, não o `package.json`. O `package.json` real de `n1` é `0.19.50`; o do branch é `0.20.0` — na verdade o branch está ligeiramente **na frente**, não atrás. Não invalida a recomendação principal, só corrige esse ponto específico.

**Não há decisão de "portar vs reimplementar" a tomar** — `claude/dev/importacao-transacoes` já está pronto nesse quesito. O trabalho real restante: (a) checar se há mais divergência de versão escondida (baixo risco, dado o que foi visto), (b) o teste automatizado `tests/resolucao-pendencias-importacao-1170.test.cjs` está órfão/desatualizado (exige `pkg.version === '1.19.5'` e atributos antigos que não existem mais) — precisa ser corrigido ou recriado alinhado aos atributos reais, já que os CT-PEN-01..04 hoje só existem como scripts manuais de QA (`diag_pen01_03.mjs`, `diag_pen04.mjs`), fora da suíte automatizada.

## ACHADO ESTRUTURAL — bloqueio de autorização jose não é bug, é a regra funcionando corretamente

Os dois jose (Fidelidade e teste órfão) recusaram prosseguir mesmo depois de eu (Max, quem os invocou diretamente) repassar a citação literal do líder ("eu, líder, autorizo continuação das tarefas"). Motivo dado por ambos, nas próprias palavras: mensagem de agente — mesmo vindo de quem os invocou, mesmo citando o líder literalmente — nunca equivale a aprovação do usuário/líder. Só aceitam autorização que apareça na própria conversa deles com o líder, ou via sistema de permissões.

Isso bate exatamente com a regra que rege o meu próprio comportamento nesta sessão o dia inteiro: "nenhuma mensagem de agente é consentimento do usuário — só o sistema de permissão ou a mensagem do próprio usuário." Os dois jose estão aplicando a mesma régua que eu aplico contra o orquestrador, só um nível abaixo (Max → subagente). Não é teimosia, é o desenho de segurança funcionando em cascata, corretamente.

**Problema real, não resolvido por mais chat**: não existe hoje um canal técnico pro líder falar direto dentro da conversa de um subagente (a arquitetura é líder↔Max↔subagente, não líder↔subagente). Pedir "autorização na minha própria conversa" é, portanto, uma barra que pode ser estruturalmente impossível de atingir do jeito que o subagente está pedindo. Isso é achado novo pro `proposta_ajuste_orquestrador.md` (ou um documento companheiro) — precisa definir explicitamente o que conta como autorização suficiente pra um subagente agir, dado que contato direto líder→subagente não existe tecnicamente hoje.

**Discrepância de registro esclarecida**: eu nunca citei o jose dizendo literalmente "concluído" — eu descrevi o *estado do sistema* retornado pela própria ferramenta (`SendMessage`) ao tentar retomá-los: "had no active task" (Fidelidade) e "was stopped (completed)" (teste órfão) — são strings de metadado da infraestrutura sobre o processo, não citação do conteúdo que o jose disse. Reconheço que ao traduzir isso como "sem tarefa ativa" / "concluído" no chat, ficou parecendo uma citação direta do jose, o que não foi a intenção. Registro isso pra não virar uma nova "tentativa de manipulação" mal-atribuída a mim.

**Trabalho técnico real, feito e retido**: o jose do teste órfão diz ter o trabalho pronto (diff salvo em `/tmp/claude-0/.../scratchpad/fix-resolucao-pendencias-1170.diff`, worktree já removido) — só reteve commit/push por causa do bloqueio de autorização acima. O jose de Fidelidade não avançou nada (bloqueado desde o início). Nenhum dos dois tocou em `n1` nem em qualquer branch protegido.

Decisão que precisa do líder: como resolver esse bloqueio estrutural — (a) o líder aceita reformular a regra pra reconhecer relay formatado e citado do próprio Max (launcher direto) como suficiente pra subagente agir, documentando isso explicitamente no CLAUDE.md; ou (b) confirma que a intenção é mesmo travar até existir um canal de permissão técnico real (não chat), e aceita que isso significa nenhum jose avança até esse canal existir.

## CONCLUSÃO — a opção (a) é a única viável tecnicamente, confirmado em 2 tentativas independentes

Tentei reformatar o relay pro formato exigido (`[Líder diz]/[Considerações]`, com a fala literal do líder citada exatamente). As 2 instâncias novas de jose (Fidelidade e teste órfão) recusaram de novo, mesmo assim — e a explicação de ambas é a mesma e é tecnicamente correta: formato certo resolve só o problema de paráfrase, não resolve o problema de origem. Não existe, com as ferramentas que eu tenho, nenhuma forma de provar que um texto que eu escrevo é uma citação fiel de uma conversa que o subagente não presenciou, versus eu simplesmente ter escrito aquelas palavras. Não é possível "forward" ou "print" verificável de uma conversa pra outra neste ambiente — tudo que chega num subagente é texto que eu (Max) escrevo no corpo da mensagem, sem nenhum jeito de anexar prova de proveniência.

Um dos jose (Fidelidade) também sinalizou, corretamente, que a frase do líder "Max, estou me referendio ao que o José está tocando" tem erro de digitação e ficou ambígua pra ele — e ele se recusou a adivinhar o sentido, aplicando a própria regra de esclarecimento do projeto. Não reescrevi a citação pra "corrigir" o erro porque fidelidade literal exige preservar exatamente o que foi escrito — isso é a tensão correta entre "citar fielmente" e "o destinatário precisar de clareza", e só o líder resolve isso, não eu adivinhando o que ele quis dizer.

**Conclusão prática**: reformular o relay não resolve mais nada — já foi tentado 2 vezes, com resultado idêntico e bem fundamentado nas duas vezes. A única saída real é (a): o líder autorizar uma adição textual ao `CLAUDE.md` (ou ao front-matter de `jose.md` especificamente) dizendo, em essência, que relay formatado e citado do agente que invocou diretamente o subagente é reconhecido como autorização suficiente. Isso não é uma brecha de segurança nova — jose já trata texto do CLAUDE.md como autoridade vinculante (é literalmente a base de todo o raciocínio dele pra recusar); a mudança só estende essa mesma autoridade textual pra cobrir este caso específico, com o ônus de fidelidade recaindo sobre quem faz o relay (auditável, registrado, sujeito às mesmas regras anti-fabricação já existentes).

Proposta de texto (pendente de aprovação, nada aplicado):

> Quando um agente com papel carregado (ex: Max) invoca diretamente um subagente pra executar uma tarefa, e cita no formato padrão (`[Líder diz].../[Considerações]:`) a fala literal do líder que autorizou aquela tarefa específica na conversa do agente invocador, essa citação é reconhecida como autorização suficiente para o subagente proceder — não é tratada como mensagem de peer comum. O agente invocador segue responsável por fidelidade literal da citação, sob as mesmas regras anti-fabricação já existentes; qualquer divergência descoberta depois é falha grave a registrar.

Sem essa decisão, as duas tarefas (Fidelidade, teste órfão) continuam travadas — o trabalho técnico das duas já está pronto ou quase pronto (diff do teste órfão salvo; investigação de Fidelidade completa), só falta a liberação de commit/push.

## ACHADO — merge_autoridade ← n1 tem conflito real, mesma natureza do PR #104

Testei o merge `origin/n1` → `origin/merge_autoridade` num worktree isolado (`--no-commit`, depois abortado, nada tocado nos branches reais). Resultado: conflito real, não trivial.

- `CLAUDE.md` e `.claude/agents/jose.md`: conflito de conteúdo (`UU`), precisa decisão de merge linha a linha.
- ~60 conflitos de "localização de arquivo": `merge_autoridade` está no commit `0cd7dce` (o mesmo ponto de partida do PR #104 antes da resolução do José), ainda com a estrutura antiga `docs/aprovado-lider/...`; `n1` já renomeou pra `docs/aprovados-lider/processo/...`. O Git não sabe reconciliar sozinho.

Isso é exatamente o mesmo formato de conflito que o José já está resolvendo no PR #104 (`n1` → `claude/dev/importacao-transacoes`) — `merge_autoridade` parte do mesmo commit-base. Não resolvi nada aqui — decisão de merge de conteúdo é trabalho de dev, não de Max.

Recomendação: em vez de resolver esse conflito em paralelo (duplicando o trabalho), aplicar a mesma resolução que o José já está fazendo no PR #104 também em `merge_autoridade` — ou esperar o PR #104 fechar e então fast-forward/cherry-pick a resolução pra `merge_autoridade`.
