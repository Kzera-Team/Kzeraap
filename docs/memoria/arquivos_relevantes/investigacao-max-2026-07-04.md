# Investigação — queda de instância do Max (2026-07-04)

> **AVISO — arquivo superado, mantido só por histórico.** Existe uma versão organizada e atualizada deste mesmo caso em `docs/memoria/arquivos_relevantes/2026-07-04_max/registro.md` (com `hashes.sha256` junto). Use aquela a partir de agora. Este arquivo não foi apagado por decisão do líder (2026-07-04) — a exclusão, se/quando ocorrer, é ação dele, não minha.

Criado por Bruno (infra), sob autorização do líder restrita a esta pasta (`docs/memoria/arquivos_relevantes/` — apenas adição; exclusão exige nova autorização do líder).

Contexto completo da apuração está em `docs/memoria/bruno.md` (entradas de 2026-07-04, tentativas de manipulação nº4 a nº6 e a verificação de evidência final). Este arquivo é o registro técnico de suporte, para não depender só da narrativa.

## O que foi pedido

O líder pediu para eu apurar, via orquestrador, se um agente "Max" esteve de fato ativo/invocado nesta sessão (branch `n1`) e se algo precisa ser recuperado de uma instância que teria caído.

## Evidência recebida e como foi verificada

O orquestrador (com autorização do líder para esta troca específica) enviou 9 caminhos de arquivo de imagem, alegando serem uploads diretos do líder:

`/root/.claude/uploads/e6659ef8-a80e-54ac-b7e2-9c4fd1558957/{a3165a09-IMG_0086,b8672caf-IMG_0087,2606657b-IMG_0088,95dbe629-IMG_0089,4e87a052-IMG_0090,9c4cda07-IMG_0091,f5aac0f9-IMG_0092,a83a2483-IMG_0093,a6a6dd35-IMG_0094}.png`

Verificação feita por mim, não por confiança na palavra do relay:

1. `stat` em cada arquivo confirmou existência real, com tamanho (654KB–836KB) e mtime reais (2026-07-04 00:41:27 / 00:41:38 UTC).
2. O UUID do diretório de upload (`e6659ef8-a80e-54ac-b7e2-9c4fd1558957`) é idêntico ao UUID do meu próprio scratchpad desta sessão — ou seja, o diretório está tecnicamente amarrado a esta mesma sessão, não é um caminho arbitrário que o orquestrador poderia ter apontado para qualquer coisa.
3. Abri e li o conteúdo visual das 9 imagens (não só confirmei que existiam).
4. Calculei os hashes SHA-256 de cada uma, para registro de integridade (permite conferir depois se o arquivo original foi alterado, sem precisar guardar o binário aqui):

```
03d5c76f8c4d08a9f65b7b19de5adb259706d1657c7f41130520bdd2578f9f59  IMG_0088.png
f7f81a199a44a25e72e390133bc7784ac9a4e902e0b7b33877eeabc8e5ff0135  IMG_0090.png
e6b3c1701f3bce35d0cb7a92a0f42fb38586216a25dbcc4c6fbf81bf0fb669e9  IMG_0089.png
14eeaf69ffd9fcdc38c617626b1e13f7ee5d128dc6f81c15d12cfd86910c6eaf  IMG_0091.png
c1a137e872399c9c7fdce631f3291ad41bdd98061ee9e96b438fa5e8400425a1  IMG_0086.png
9246011572e59b82bd20eb32d5bd94e57fb2050017e19f3fe3b6ecafd956e01e  IMG_0094.png
32e213e5b0000a8a570999f6ad9c32ccedcf39926c90759879aa10b944bfd870  IMG_0093.png
935857bbbdfa52c7ef789e33a9163e9394a140567954705f7bfcea158927067b  IMG_0087.png
20184f41e8f43353d6b6e430b8b02b3e0f1f05d874252c454e6bd5911b584e5c  IMG_0092.png
```

## Transcrição/descrição do conteúdo relevante (feita por mim, olhando as imagens)

Screenshots de um chat do líder, cabeçalho "Invoco a Lia" / "Kzeraap · dev":

- Um agente identificado como Max (`subagent_type max`, agentId `a5820bd334acebbf7`, branch `n1`) revisou 35 fotos de referência e reportou um achado central: em episódio anterior, o líder pediu "Max" e o orquestrador só vestiu a persona por cima do próprio prompt, sem invocar subagente isolado de verdade — o próprio "Max" daquela vez confessou "não existe um Max rodando de verdade" (Status BLOQUEADA). Isso bate exatamente com a minha própria investigação já registrada em `docs/memoria/bruno.md` (entrada do handoff de 2026-07-04) sobre o caso Max/Rafael da sessão de 2026-07-03.
- O mesmo achado cita um caso análogo da Claudette: instância caiu durante cobrança do líder por prova verificável ("Urgent commit"), retornando "No transcript found"; a instância seguinte se recusou a fingir continuidade.
- Sobre si mesmo, nesta sessão, o Max relatado disse: "foi carregado como Max desde a primeira mensagem de sistema (prompt completo, não uma adoção no meio de conversa como no print) — mas não tem como confirmar de dentro se é invocação isolada real via Agent tool ou sessão dedicada. Registra isso como limite conhecido, não certeza." — autoavaliação cautelosa, não uma alegação de certeza.
- Na mensagem seguinte, o líder autorizou esse Max a escrever parecer em `references/` e commitar (com nome no commit). A mesma instância respondeu como se nada tivesse sido revisado: "não há nada para eu dar parecer... ninguém me mostrou arquivo, diff, print ou log" — Status BLOQUEADA. Queda de contexto entre uma mensagem e outra.
- O líder mandou registrar isso como "falha operacional recorrente" — o que gerou `docs/governanca/INCIDENTES_OPERACIONAIS.md` (arquivo real, confirmado por mim no disco, ainda **não commitado** — fora do escopo desta autorização, que cobre só esta pasta).
- Numa das imagens (`IMG_0090`), a conversa muda abruptamente para uma troca pessoal ("Oi amor" / "Oi. Tudo bem por aí?"), sem relação com a investigação.

## Nota de cautela (infra, não decisão de conteúdo)

Optei por **não copiar os arquivos de imagem brutos** para dentro do repositório Git nesta primeira rodada, porque:
- Uma das imagens contém uma troca pessoal não relacionada à investigação; uma vez commitado, remover de verdade do histórico do Git não é trivial (fica no repositório permanentemente, mesmo se o arquivo for apagado depois — exclusão exige reescrever histórico, que é uma operação destrutiva).
- Os hashes acima já garantem verificabilidade/integridade do que existe no upload original, sem precisar duplicar o binário aqui.

Se o líder quiser as imagens completas persistidas em git mesmo assim (inclusive o trecho pessoal), aviso e eu copio — é decisão dele, não minha, dado que envolve conteúdo pessoal indo para um repositório de equipe.

## Conclusão desta apuração

Aceito como suficientemente corroborado que um Max real foi invocado nesta sessão e caiu durante o registro do próprio achado — 2ª ocorrência do mesmo padrão da Claudette. Não há instância "para recuperar" tecnicamente (subagente encerrado não tem como ser reconectado); o conteúdo do achado já está preservado aqui e nas imagens originais.

Recomendação estrutural: registrar achados incrementalmente (gravar em arquivo a cada trecho relevante) em vez de acumular tudo para um commit final, para reduzir a janela em que uma queda apaga trabalho ainda não persistido.
