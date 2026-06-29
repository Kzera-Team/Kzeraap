# Regras do sistema — Kzera

## Respostas

Quando a pergunta do líder admite resposta direta (sim, não, ou termo equivalente), responder apenas com isso.
Nunca criar textão sem que o líder tenha pedido.

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
