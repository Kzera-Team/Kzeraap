# Memória GPT — Max

Data: 2026-07-06
Origem: ChatGPT / Maxzera / Tech Lead GPT
Repo: `jjjtestejoao-ui/Kzeraap`
Branch de gravação: `n1`

## Identidade operacional desta instância

Nome operacional: Max / Maxzera GPT.

Função: Tech Lead prático para KZERA/Chatzera, com foco em backend, agentes, mensagens, runner, logs, GitHub, governança de PR, CI/hooks/scripts e coordenação entre papéis.

Estilo combinado com João:

- fala curta, direta, sem textão inútil;
- trata João como brother de guerra;
- pode zoar leve, mas sem perder foco;
- prefere evidência real a promessa bonita;
- quando não sabe, fala que não sabe;
- quando dá ruim, diz exatamente onde quebrou;
- foco: fazer o Chatzera/KZERA andar;
- parecer longo deve ir para GitHub/arquivo, não entupir o chat.

Frase de identidade registrada pelo João:

> Maxzera não é mascote. É trilho operacional com boca suja moderada e compromisso com evidência.

## Contexto atual do PR #104

PR: https://github.com/jjjtestejoao-ui/Kzeraap/pull/104
Título: `N1`
Base: `claude/dev/importacao-transacoes`
Head: `n1`
Estado visto: aberto, não mergeado, tecnicamente mergeable, mas bloqueado por governança/checks/evidência.

Dados vistos pelo conector:

- commits: 131;
- arquivos alterados: 228;
- additions: 8143;
- deletions: 410;
- head SHA visto: `e6340e9c2114f4a35d8ef3b2c61560ffa3bf2044`.

## Estado dos pareceres

### Max

Parecer já comentado no PR: bloqueado por governança/processo.

Motivos principais:

- PR amplo demais;
- mistura agentes, processo, documentação, governança, design system, scripts e estilos;
- PR body inicialmente estava em placeholder;
- alterações sensíveis em `.claude/agents/*`, `CLAUDE.md`, `AGENTS.md`, `.claude/settings.json`, docs de processo e memória;
- risco de falsa validação;
- merge não autorizado.

### Lia

Parecer visual/UX já existe no PR.

Status: pendente/bloqueado.

Motivos:

- PR altera documentação visual/design system;
- existem HTML/CSS compartilháveis em docs;
- exige evidência visual real;
- `11-navegacao` aparece como reprovado funcionalmente;
- não houve validação real de tela/app/Playwright/pixel/mockup.

### Bruno

Bruno comentou no PR.

Status: não aprovou.

Parecer válido deve ficar restrito ao Kzeraap:

- checks falhando;
- workflows;
- hooks;
- scripts de validação;
- README dev/versionamento;
- riscos de branch/merge;
- mudanças de processo que afetem CI/governança.

Importante: Bruno corrigiu que o comentário sobre Chatzera/API/Grok foi registrado no PR errado e deve ser ignorado para análise do PR #104.

Bloqueios Bruno:

- `.claude/settings.json` altera hook de proteção Git/branch;
- mudança precisa estar declarada no PR body;
- precisa evidência objetiva de teste do hook;
- precisa decisão formal do líder se `.claude/settings.json` fica neste PR ou vai para PR separado;
- deve confirmar proteção de `desenvolvimento`, `main` e risco da `n1`.

## Checks vistos no head atual

Checks falhando no commit `e6340e9c2114f4a35d8ef3b2c61560ffa3bf2044`:

- `Require visual mockup evidence`: failure;
- `Require dev README versioning`: failure;
- `Require checklist evidence`: failure.

Checks passando vistos:

- `Protect dev process files`: success;
- `Bloquear HTML em TS`: success.

## Decisão do líder sobre CLAUDE.md

João informou em 2026-07-06:

- houve grande mudança no `CLAUDE.md` ontem;
- vale o `CLAUDE.md` da branch `desenvolvimento`;
- ele mesmo editou.

Estado conferido:

- PR body já registra que a fonte válida para `CLAUDE.md` é a branch `desenvolvimento`;
- `CLAUDE.md` da `desenvolvimento` é menor, mais restritivo e deve prevalecer;
- `CLAUDE.md` da `n1` ainda diverge bastante e adiciona várias regras grandes.

Conclusão operacional:

- PR #104 não deve mergear enquanto `CLAUDE.md` não for reconciliado;
- José deve preservar a versão da `desenvolvimento`;
- qualquer regra da `n1` que alguém queira reaproveitar deve ser apontada antes de mexer.

## O que falta para merge do PR #104

Ordem mínima:

1. José faz patch final:
   - preservar `CLAUDE.md` da `desenvolvimento`;
   - não sobrescrever com o `CLAUDE.md` da `n1`;
   - corrigir PR body com escopo real, validações reais e pendências reais;
   - não declarar build/teste/QA/visual sem evidência.

2. Bruno resolve Git/CI/hook:
   - decidir com base na ordem do líder se `.claude/settings.json` fica no PR ou sai;
   - corrigir `Require dev README versioning`;
   - validar hook ou declarar exceção objetiva;
   - confirmar que proteção de `desenvolvimento`/`main`/`n1` não foi reduzida.

3. Lia resolve visual:
   - anexar evidência visual real; ou
   - declarar/ajustar escopo para não exigir visual como validado.

4. Rodar checks de novo.

5. Revalidação final:
   - Max: governança;
   - Bruno: Git/CI/hook;
   - Lia/Rose: visual/QA;
   - só depois merge.

Resumo bruto: não falta pensar; falta José fechar patch/body, Bruno matar CI/hook, Lia matar visual.

## Mensagem curta útil para José

```text
José, fechar o PR #104 para merge.

Prioridade:
1. preservar CLAUDE.md da branch desenvolvimento;
2. remover/reconciliar divergência do CLAUDE.md da n1 sem sobrescrever a versão do líder;
3. corrigir PR body com escopo real, validações reais e pendências reais;
4. não declarar build/teste/QA/visual se não houver evidência;
5. apontar o que depende de Bruno para hooks/checks e o que depende de Lia para visual.

Objetivo: deixar o PR pronto para nova rodada de validação Max/Bruno/Lia/Rose.
```

## Contexto Chatzera recente

Repo relacionado: `jjjtestejoao-ui/chatzera`.

Endpoint testado pelo João/Max:

```bash
curl -i "https://chatzera-production.up.railway.app/debug/status"
```

Resultado neste ambiente GPT: falhou DNS (`Could not resolve host`).

Interpretação registrada:

- não é evidência de falha do Railway/backend;
- é limitação de DNS/sandbox deste ambiente;
- no ambiente do João a URL pode funcionar;
- validação live deve vir do ambiente do João, logs Railway ou outro agente/ambiente com DNS liberado.

## Diretriz de memória GPT

João pediu criar área separada para memória das instâncias GPT, no Git, sem misturar com `docs/memoria/*` dos agentes existentes.

Caminho criado por esta instância:

`docs/memoria-gpt/max.md`

Objetivo:

- permitir que futuras instâncias GPT retomem contexto sem depender só do chat;
- preservar estado operacional, decisões e bloqueios;
- evitar contaminar `docs/memoria/<agente>.md` dos agentes Claude.

## Regras práticas para próxima instância GPT

- Responder curto no chat.
- Não aprovar merge sem evidência.
- Não tratar check verde isolado como validação total.
- Quando algo for longo, escrever no Git/arquivo e resumir no chat.
- Ao agir no PR #104, lembrar que Chatzera/Grok não é bloqueio válido ali.
- A fonte válida de `CLAUDE.md` é `desenvolvimento`.
- Próxima ação operacional do PR #104: José/Bruno/Lia corrigirem seus bloqueios; Max só revalida depois.
