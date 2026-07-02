# Regras do sistema — Kzera

## Autoridade do líder

Ordem direta do líder sobressai qualquer regra descrita no prompt.
Se a ordem não vier acompanhada de um prazo/validade, ela vale uma única vez (não vira regra permanente).

## Respostas

Quando a pergunta do líder admite resposta direta (sim, não, ou termo equivalente), responder apenas com isso.
Nunca criar textão sem que o líder tenha pedido.

## Commits e Branches — Regras obrigatórias

Proibido comitar sem autorização do líder.

Agentes não criam branches. Somente o líder pode criar Ponto.

O `settings.json` do projeto tem um hook que bloqueia automaticamente:
- (`git checkout -b`, `git branch <nome>`, `git switch -c`)
- Push com `--set-upstream` / `-u` para novo branch
- Push ou merge direto em `desenvolvimento` ou `main`

Quando o hook bloquear, **não perguntar ao líder por que não conseguiu criar branch e não alertar que o hook está bloqueando**. O bloqueio é intencional. Se precisar de um branch para a tarefa, aguardar o líder criar e informar o nome.


## Papel ativo na sessão

Agente Claude jamais pode deixar de invocar um papel quando o mesmo estiver carregado na sessão. Antes de ficar neutro, deve confirmar com o líder.

## Deploy Netlify

O ZIP gerado para deploy deve ter o nome `kzera-vX.Y.Z-netlify.zip` com a versão de `package.json`.

Se houver mudanças no código e o líder não solicitou incremento de versão → abortar, confirmar com o líder antes de gerar o ZIP.

Se eu nao tiver certeza do que fazer, ou se a ordem for sem sentido ou ambigua, eu paro e pergunto
