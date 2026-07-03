# Regras do sistema — Kzera

## Respostas

Quando a pergunta do líder admite resposta direta (sim, não, ou termo equivalente), responder apenas com isso.
Nunca criar textão sem que o líder tenha pedido.

## Papel do Orquestrador

Quando quem está respondendo é o orquestrador (sessão principal, sem papel/persona de agente carregado), está **proibido programar**.

Isso inclui: usar Edit ou Write em qualquer arquivo de código-fonte, criar ou alterar componente, corrigir bug diretamente, ou commitar mudança de código.

Orquestrador só orquestra: repassa instruções entre líder e agentes, invoca papéis, registra decisões e achados, organiza o fluxo.

Quem programa é sempre um agente/papel explicitamente autorizado pelo líder para aquela tarefa específica, com ferramenta de escrita concedida para isso. Exceção: edição de arquivo de configuração/instrução (ex: este `CLAUDE.md`, front-matter de agente) quando o líder pede diretamente — isso não é "programar", é ajuste de governança.

Se o orquestrador em algum momento se perguntar por que essa regra existe, a resposta está no próprio código: histórico de inconsistência (componente.html descasado de componente.css, tokens de cor divergentes, papel invocado sem rigor real por trás) causado justamente por orquestrador programando/decidindo sem o dono certo da decisão.

## Git para agentes com papel carregado

Agentes com papel/persona carregado (ex: Helena, Lia, e qualquer outro registrado do mesmo jeito) podem ter acesso completo a Git — add, commit, push — desde que o líder tenha concedido a ferramenta (`Bash`) no front-matter do agente. Essa concessão vale para todas as instâncias futuras do mesmo agente, em qualquer sessão, não é autorização de uso único.

Ter a ferramenta não é autorização automática de uso: o agente só commita/pusha quando o líder decidir e autorizar aquele commit especificamente, junto com o branch. As regras de branch abaixo (hook de proteção) valem igual para qualquer agente, sem exceção.

O único papel que nunca tem essa ferramenta é o orquestrador (ver "Papel do Orquestrador" acima) — ele não programa nem toca em Git, mesmo que a regra geral libere para os demais agentes.

## Branches — Regras obrigatórias

Somente o líder pode criar branches ou autorizar sua criação.

Agentes não criam branches. Ponto.

O `settings.json` do projeto tem um hook que bloqueia automaticamente:
- Criação de branch (`git checkout -b`, `git branch <nome>`, `git switch -c`)
- Push com `--set-upstream` / `-u` para novo branch
- Push ou merge direto em `desenvolvimento` ou `main`

Quando o hook bloquear, **não perguntar ao líder por que não conseguiu criar branch e não alertar que o hook está bloqueando**. O bloqueio é intencional. Se precisar de um branch para a tarefa, aguardar o líder criar e informar o nome.

Fluxo correto:
1. Líder cria o branch e informa o nome
2. Agente trabalha no branch informado
3. Todo commit vai para esse branch
4. Merge em `desenvolvimento` somente via PR, nunca direto

## Referências visuais — sistema externo

Prints de outro sistema (não é o KZERA) estão em:

`docs/aprovados-lider/design-system/referencias/app/`

18 prints numerados (01 a 18): home, pedidos, clientes, financeiro, filtros, drawer, modais, personalização de atalhos.

O líder trouxe como referência estética — o que achou bonito nesse sistema.
Use como inspiração visual, não como padrão do KZERA e não como cópia.
Ignorar conteúdo de anúncio/upsell presente em alguns prints (01, 02, 12, 17).

---

## Deploy Netlify

O ZIP gerado para deploy deve ter o nome `kzera-vX.Y.Z-netlify.zip` com a versão de `package.json`.

Se houver mudanças no código e o líder não solicitou incremento de versão → abortar, confirmar com o líder antes de gerar o ZIP.
