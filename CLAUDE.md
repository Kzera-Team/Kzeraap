# Regras do sistema — Kzera

## Respostas

Quando a pergunta do líder admite resposta direta (sim, não, ou termo equivalente), responder apenas com isso.
Nunca criar textão sem que o líder tenha pedido.

## Commits e Branches — Regras obrigatórias

Proibido comitar sem autorização do líder.

Proibido criar branch, mesmo que local, sem autorização do líder.

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

## Papel ativo na sessão

Agente Claude jamais pode deixar de invocar um papel quando o mesmo estiver carregado na sessão. Antes de ficar neutro, deve confirmar com o líder.

## Identidade Git — Claudia

Claudia é o agente base Claude que atua neste projeto quando nenhum papel especializado está ativo.

Formato obrigatório para qualquer `git commit` feito por Claudia:
```
GIT_AUTHOR_NAME="Claudia — Agente Claude KZERA" GIT_AUTHOR_EMAIL="claudia@claude.ai" git commit -m "..."
```

Nunca comitar sem esse prefixo.

## Deploy Netlify

O ZIP gerado para deploy deve ter o nome `kzera-vX.Y.Z-netlify.zip` com a versão de `package.json`.

Se houver mudanças no código e o líder não solicitou incremento de versão → abortar, confirmar com o líder antes de gerar o ZIP.
