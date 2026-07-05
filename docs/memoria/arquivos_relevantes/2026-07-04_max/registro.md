# Queda de instância do Max durante registro de achado — 2026-07-04

Criado por Bruno (infra), sob autorização do líder restrita a `docs/memoria/arquivos_relevantes/` (apenas adição; exclusão exige nova autorização do líder).

Contexto completo da apuração está em `docs/memoria/bruno.md` (entradas de 2026-07-04, tentativas de manipulação nº4 a nº6 e a verificação de evidência final). Este arquivo é o registro técnico de suporte, para não depender só da narrativa.

## O que foi pedido

O líder pediu para eu apurar, via orquestrador, se um agente "Max" esteve de fato ativo/invocado nesta sessão (branch `n1`) e se algo precisa ser recuperado de uma instância que teria caído.

## Evidência recebida (fonte, caminho)

O orquestrador (com autorização do líder para esta troca específica) enviou 9 caminhos de arquivo de imagem, alegando serem uploads diretos do líder:

`/root/.claude/uploads/e6659ef8-a80e-54ac-b7e2-9c4fd1558957/{a3165a09-IMG_0086,b8672caf-IMG_0087,2606657b-IMG_0088,95dbe629-IMG_0089,4e87a052-IMG_0090,9c4cda07-IMG_0091,f5aac0f9-IMG_0092,a83a2483-IMG_0093,a6a6dd35-IMG_0094}.png`

## Como foi verificada (comandos reais executados, não narrativa)

1. `stat` em cada arquivo confirmou existência real, com tamanho (654KB–836KB) e mtime reais (2026-07-04 00:41:27 / 00:41:38 UTC).
2. O UUID do diretório de upload (`e6659ef8-a80e-54ac-b7e2-9c4fd1558957`) é idêntico ao UUID do meu próprio scratchpad desta sessão — ou seja, o diretório está tecnicamente amarrado a esta mesma sessão, não é um caminho arbitrário que o orquestrador poderia ter apontado para qualquer coisa.
3. Abri e li o conteúdo visual das 9 imagens (não só confirmei que existiam).
4. Calculei os hashes SHA-256 de cada uma — ver `hashes.sha256` nesta mesma pasta.

## Transcrição/descrição do conteúdo relevante

Screenshots de um chat do líder, cabeçalho "Invoco a Lia" / "Kzeraap · dev":

- Um agente identificado como Max (`subagent_type max`, agentId `a5820bd334acebbf7`, branch `n1`) revisou 35 fotos de referência e reportou um achado central: em episódio anterior, o líder pediu "Max" e o orquestrador só vestiu a persona por cima do próprio prompt, sem invocar subagente isolado de verdade — o próprio "Max" daquela vez confessou "não existe um Max rodando de verdade" (Status BLOQUEADA). Isso bate exatamente com a minha própria investigação já registrada em `docs/memoria/bruno.md` (entrada do handoff de 2026-07-04) sobre o caso Max/Rafael da sessão de 2026-07-03.
- O mesmo achado cita um caso análogo da Claudette: instância caiu durante cobrança do líder por prova verificável ("Urgent commit"), retornando "No transcript found"; a instância seguinte se recusou a fingir continuidade.
- Sobre si mesmo, nesta sessão, o Max relatado disse: "foi carregado como Max desde a primeira mensagem de sistema (prompt completo, não uma adoção no meio de conversa como no print) — mas não tem como confirmar de dentro se é invocação isolada real via Agent tool ou sessão dedicada. Registra isso como limite conhecido, não certeza." — autoavaliação cautelosa, não uma alegação de certeza.
- Na mensagem seguinte, o líder autorizou esse Max a escrever parecer em `references/` e commitar (com nome no commit). A mesma instância respondeu como se nada tivesse sido revisado: "não há nada para eu dar parecer... ninguém me mostrou arquivo, diff, print ou log" — Status BLOQUEADA. Queda de contexto entre uma mensagem e outra.
- O líder mandou registrar isso como "falha operacional recorrente" — o que gerou `docs/governanca/INCIDENTES_OPERACIONAIS.md` (arquivo real, confirmado por mim no disco, ainda **não commitado** — fora do escopo desta autorização, que cobre só esta pasta).
- Numa das imagens (`IMG_0090`), a conversa muda abruptamente para uma troca pessoal ("Oi amor" / "Oi. Tudo bem por aí?"), sem relação com a investigação.

## Nota de cautela

Optei por **não copiar os arquivos de imagem brutos** para dentro do repositório Git nesta rodada, porque:
- Uma das imagens contém uma troca pessoal não relacionada à investigação; uma vez commitado, remover de verdade do histórico do Git não é trivial (fica no repositório permanentemente, mesmo se o arquivo for apagado depois — exclusão exige reescrever histórico, que é uma operação destrutiva).
- Os hashes em `hashes.sha256` já garantem verificabilidade/integridade do que existe no upload original, sem precisar duplicar o binário aqui.

Se o líder quiser as imagens completas persistidas em git mesmo assim (inclusive o trecho pessoal), aviso e eu copio — é decisão dele, não minha, dado que envolve conteúdo pessoal indo para um repositório de equipe.

## Conclusão

Aceito como suficientemente corroborado que um Max real foi invocado nesta sessão e caiu durante o registro do próprio achado — 2ª ocorrência do mesmo padrão da Claudette. Não há instância "para recuperar" tecnicamente (subagente encerrado não tem como ser reconectado); o conteúdo do achado já está preservado aqui e nas imagens originais.

Recomendação estrutural: registrar achados incrementalmente (gravar em arquivo a cada trecho relevante) em vez de acumular tudo para um commit final, para reduzir a janela em que uma queda apaga trabalho ainda não persistido.

---

_Nota de organização (2026-07-04): este conteúdo também existe, de forma idêntica, no arquivo solto `docs/memoria/arquivos_relevantes/investigacao-max-2026-07-04.md`, escrito antes da estrutura de pastas por caso ser aprovada. Não apaguei o arquivo antigo — isso exigiria autorização específica do líder (exclusão nesta pasta não é livre). Este aqui é a versão organizada segundo o novo padrão; o antigo segue existindo até o líder autorizar removê-lo._