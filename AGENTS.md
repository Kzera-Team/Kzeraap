# AGENTS.md — regras mínimas para qualquer agente de IA neste repositório

Este projeto (KZERA) é trabalhado por agentes de IA de mais de um provedor (hoje: Claude; outros provedores podem ser adicionados pelo líder do projeto). As regras completas e detalhadas vivem em `CLAUDE.md`, escrito para a ferramenta Claude Code. Este arquivo é a ponte: um template mínimo, sem depender do nome de nenhuma ferramenta específica, para qualquer agente/ferramenta que não reconheça `CLAUDE.md` automaticamente.

A aplicação prática destas regras em cada ambiente/ferramenta é responsabilidade de quem opera aquele ambiente. Este arquivo define o **padrão comum**, não a configuração de nenhuma ferramenta específica.

## Autoridade

O líder do projeto é a única fonte de autorização para: criar branch, commitar, dar push, abrir PR, fazer merge, alterar configuração de processo (workflows, hooks, templates). Nenhum agente decide isso por conta própria, de nenhum provedor.

## Branches

- Só o líder cria e nomeia branches.
- Convenção de nome: `<provedor>/<papel-ou-função>/<frente-curta>` — exemplo: `claude/dev/importacao-transacoes`, `<provedor-x>/dev/vendas-manual`. O prefixo de provedor identifica qual ferramenta/IA está atuando naquele branch; não usar um prefixo genérico que apague essa distinção.
- Nunca criar branch novo, worktree isolado ou checkout paralelo sem autorização explícita do líder para aquela tarefa específica.
- Nenhum merge direto em `desenvolvimento` ou `main` — sempre via PR.

## Commits

Todo commit feito por um agente inclui no corpo da mensagem:

```
Agent-Provider: <claude | outro>
Agent-Role: <papel ou função, ex: dev, qa, arquiteto, appsec>
Agent-Session: <id ou url da sessão/execução, se existir>
Authorized-By: "<citação literal da fala do líder que autorizou esta ação>"
```

Este trailer não substitui a exigência de autorização explícita — é complementar, e existe para permitir auditoria posterior. `git config user.name`/`--author` sozinho não comprova autoria; o cruzamento entre commit e o registro de decisões do projeto (`docs/governanca/`) é o que dá rastreabilidade real.

## Pull Requests

- Todo PR cita na descrição: provedor e papel responsável, branch de origem, o pedido literal autorizado pelo líder, e o trailer de commit correspondente.
- Aprovação mínima antes de merge: revisão de QA quando houver lógica de negócio ou dado; auditoria técnica quando a entrega for chamada de "pronta"/"final".

## Antes de qualquer alteração

- Confirmar que o pedido foi entendido e o escopo está claro antes de codificar.
- Em caso de ambiguidade relevante, parar e perguntar — não presumir intenção.
- Não declarar entrega como concluída sem evidência (build, teste, print, ou validação equivalente).

## Documentação/pastas

- Antes de criar pasta nova em `docs/`, verificar se já existe nome parecido (singular/plural, acento, hífen) para não duplicar. Em caso de dúvida, perguntar ao líder.

## Onde ficam as regras completas

- Claude Code: `CLAUDE.md`, na raiz do repositório.
- Registro de decisões e apurações do Tech Lead: `docs/governanca/08_REGISTRO_DECISOES_MAX.md`.
- Memória por papel: `docs/memoria/<papel>.md`.
