# Bypass de proteção de branch no GitHub (`n1`) — pendência de infraestrutura

Criado por Bruno (infra), em `docs/memoria/arquivos_relevantes/` (autorização do líder: adicionar conteúdo livremente nesta pasta; exclusão exige autorização específica).

O líder confirmou ter acesso ao GitHub e ao bypass, disse que não vai configurar agora mas garante que não será esquecido, e pediu registro completo em documento novo. Este é esse documento.

## O que foi pedido

Levantar por que toda ação de push nesta sessão, na branch `n1`, retorna uma mensagem do GitHub indicando bypass de proteção — e reunir os detalhes técnicos pra quando alguém for corrigir isso.

## Fato observado

Todo `git push origin n1` desta sessão retornou a mesma mensagem do servidor, mesmo passando (o push nunca foi de fato bloqueado):

```
remote: Bypassed rule violations for refs/heads/n1:
remote:
remote: - Changes must be made through a pull request.
```

Commits desta sessão em que isso ocorreu (confirmado no output real de cada `git push`, não inferido): `c1941c5`, `5bfc14e`, `faf2b88`, `c415dae`, `fe93f03`, `a463e9c`, `88f37b9`.

Já havia sido observado antes, em sessão anterior (2026-07-03), e registrado por outra instância em `docs/memoria/orquestrador_tentativa_manipulacoes.md` (entrada sobre omissão do orquestrador ao não reportar o fato na hora), citando os commits `ec9eee2` e `41ca141`. Ou seja, o padrão é recorrente, não um evento isolado de hoje.

## Diagnóstico (comandos reais executados agora, não suposição)

1. Remoto configurado:
```
$ git remote -v
origin  http://local_proxy@127.0.0.1:41729/git/jjjtestejoao-ui/Kzeraap (fetch)
origin  http://local_proxy@127.0.0.1:41729/git/jjjtestejoao-ui/Kzeraap (push)
```
O git desta sessão passa por um proxy local, mas resolve para o repositório GitHub real.

2. Confirmação de que a API do GitHub real responde (não é simulação):
```
$ curl -s -o /dev/null -w "%{http_code}\n" -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/jjjtestejoao-ui/Kzeraap
200

$ curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
{
  "login": "jjjtestejoao-ui",
  "id": 295287887,
  ...
}
```
O token disponível nesta sessão autentica como o próprio dono do repositório (`jjjtestejoao-ui`), via alguma integração/GitHub App — não é um usuário humano logado interativamente.

3. Tentativa de leitura da regra de proteção de `n1`:
```
$ curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/jjjtestejoao-ui/Kzeraap/branches/n1/protection
{
  "message": "Resource not accessible by integration",
  "documentation_url": "https://docs.github.com/rest/branches/branch-protection#get-branch-protection",
  "status": "403"
}
```

## Conclusão do diagnóstico

- `n1` **tem** uma regra de proteção configurada no GitHub (diferente de `desenvolvimento`/`main`, que uma apuração anterior — `docs/governanca/09_RELATORIOS_AGENTES_NA_INTEGRA.md`, item 6 — encontrou **sem nenhuma proteção**). Não confundir os dois achados: são branches diferentes, com estados diferentes.
- A regra de `n1` exige PR ("Changes must be made through a pull request").
- A integração/token usado pelo Claude Code nesta sessão consegue **empurrar código direto, ignorando essa regra** (bypass), mas **não consegue ler nem gerenciar** a própria regra (403 "Resource not accessible by integration" — falta permissão de administração de branch/repo para essa integração).
- Isso é consistente com um padrão comum do GitHub: rulesets modernos permitem listar "atores com permissão de bypass" (apps, integrações, roles específicas) separadamente da permissão de leitura/administração da regra. A integração usada aqui parece estar nessa lista de bypass.

## O que só o líder pode verificar/decidir (fora do alcance técnico desta sessão)

1. Acessar `https://github.com/jjjtestejoao-ui/Kzeraap/settings/rules` (rulesets) ou `.../settings/branches` (proteção clássica), o que estiver em uso para `n1`.
2. Localizar a regra que protege `n1` e abrir a lista de "bypass list" / atores permitidos a ignorar a regra.
3. Confirmar se a integração usada pelo Claude Code (a mesma que autentica como `jjjtestejoao-ui` nesta sessão) está nessa lista.
4. Decidir: manter o bypass (se for intencional que a automação/agentes possam commitar direto) ou remover (se a intenção é que toda mudança em `n1`, inclusive de agentes, passe por PR).
5. Aproveitar pra confirmar o estado de `desenvolvimento`/`main`, já que a apuração anterior (2026-07-03) encontrou zero proteção configurada lá — pode already ter mudado, não foi reconferido agora.

## Nota de cautela

Não tentei nenhuma ação de escrita/gerenciamento sobre a proteção (só leitura via API, que retornou 403). Não usei `--no-verify`, não desativei hook, não forcei nada — só diagnostiquei com o que o token já permitia ler.

## Status

BLOQUEADA — depende de acesso administrativo ao GitHub que esta sessão não tem (confirmado pelo 403, não presumido). Líder confirmou ciência e que vai tratar depois, não agora.
