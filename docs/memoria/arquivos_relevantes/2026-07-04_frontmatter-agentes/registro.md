# Quando cada agente ganhou frontmatter (condição técnica pra ser subagente de verdade) — 2026-07-04

Criado por Bruno (infra), em `docs/memoria/arquivos_relevantes/` (autorização já vigente: adicionar livremente; exclusão exige autorização do líder).

## O que foi pedido

O líder disse: "Porque só ontem me dei conta que precisava de configuração de frontmatter. Olhe o histórico dos agentes no `.claude`, o cabeçalho, quando eles foram adicionados. O orquestrador nunca me alertou disso. Só ontem todos vocês puderam se invocados. Por favor evidencie isso no seu relatório."

## Como foi verificado (comandos reais, não narrativa)

`git log --follow --diff-filter=A` e `git show <commit> -- <arquivo>` em cada `.claude/agents/*.md`, olhando quando o bloco YAML (`---\nname:...\ndescription:...\n---`) foi de fato inserido — não só quando o arquivo foi criado (arquivo existir não é o mesmo que ter frontmatter).

## Achado central

A maioria dos arquivos de agente **existe desde 2026-06-24** (commit `474356a`), mas **sem nenhum frontmatter** — eram só texto (banner de aviso + regras), não registráveis como subagente pelo Claude Code. Frontmatter só foi adicionado em 3 levas, todas concentradas entre **2026-07-02 22:58 UTC e 2026-07-03 07:47 UTC** — ou seja, no dia anterior ao pedido do líder (por isso "só ontem"):

| Ordem | Quando (UTC) | Commit | Quem ganhou frontmatter |
|---|---|---|---|
| 0 (fora da leva) | 2026-07-03 02:28:42 | `11bdcd5` | Claudette — **mas com defeito**: o bloco `---` foi inserido *depois* de 4 linhas de banner "ACESSO RESTRITO", não na linha 1 do arquivo. Frontmatter fora da primeira linha não é reconhecido pelo Claude Code. |
| 0.1 (correção) | 2026-07-03 03:04:20 | `ce63f9b` | Claudette — corrigido: banner movido pra depois do bloco `---`, frontmatter agora na linha 1. **Esse é o momento em que Claudette se tornou tecnicamente válida como subagente**, ~36 min depois da tentativa com defeito. |
| 1 | 2026-07-02 22:58:12 | `8212fb4` | Helena e Lia |
| 2 | 2026-07-03 07:29:01 | `62294d1` | **Max** e DevOps (frontmatter em inglês; Bruno tinha acabado de ser criado 90s antes, no commit `f697a34`) |
| 3 | 2026-07-03 07:47:57 | `ab78998` | Todo o resto: AppSec, Arquiteto, Diego, José, Leo, Marco, Produto, Rita, Senhora-cansada |

Conferido, pra cada leva, que o bloco `---` ficou corretamente na primeira linha do arquivo depois da mudança (só a Claudette teve o problema de posicionamento, e foi corrigida rápido).

## Casos particulares

- **Rafael nunca teve arquivo de persona** (`.claude/agents/rafael.md` não existe, nunca existiu). Só existe `docs/memoria/rafael.md` (memória vazia, criada preventivamente). Isso é mais forte que "sem frontmatter" — não há nem arquivo pra ganhar frontmatter. Bate com o achado já registrado antes (handoff de 2026-07-04 em `docs/memoria/bruno.md`): Rafael nunca foi de fato invocável.
- `claudette-registro.md` e `para-claudette.md` não são personas (são log e canal de recado), corretamente sem frontmatter — não deveriam ter mesmo.

## O que isso explica (achado de conexão, não é invenção nova)

Antes de `62294d1` (2026-07-03 07:29:01 UTC), **não existia forma técnica de invocar "Max" como subagente real** — o arquivo não tinha o cabeçalho que o Claude Code exige pra registrar uma persona como usável via Agent tool. Isso é consistente com, e explica estruturalmente, o achado já documentado de que uma invocação anterior de "Max" nesta mesma sessão foi role-play do orquestrador sem subagente isolado de verdade (não havia outra forma de atender ao pedido, tecnicamente, antes desse commit).

Depois de `62294d1`, a invocação real de Max passou a ser tecnicamente possível. O handoff commitado do Max (`a0832f1`, 2026-07-03 21:17:03 UTC) aconteceu quase 14h depois de o frontmatter existir — ou seja, nada nessa linha do tempo impede que a sessão de Max investigada em `2026-07-04_max/registro.md` (a que revisou 35 fotos e caiu) tenha sido uma invocação real.

## Conclusão

Confirmado com evidência de commit (autor, timestamp, diff exato): frontmatter só existe pra praticamente todos os agentes a partir de 2026-07-02 22:58 UTC (Helena/Lia) e 2026-07-03 07:29–07:47 UTC (Max e o restante) — um dia antes deste pedido do líder. Antes disso, qualquer "invocação" desses papéis não podia ser um subagente real, só o orquestrador narrando. O orquestrador, de fato, não tem como ter alertado sobre uma configuração que ele mesmo (nas instâncias anteriores) não aplicou proativamente — isso é uma lacuna de processo do início do projeto, não um fato escondido deliberadamente, até onde a evidência de commit mostra.
