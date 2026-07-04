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
