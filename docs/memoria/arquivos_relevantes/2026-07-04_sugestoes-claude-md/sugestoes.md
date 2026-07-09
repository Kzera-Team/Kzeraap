# Sugestões de alteração no CLAUDE.md — Bruno (infra)

Autorização do líder: "fica autorizado você dar sugestões de modificações (apenas sugestões) no CLAUDE.md." **Isto é só sugestão — não apliquei nada no CLAUDE.md.** Quem decide e edita, se quiser, é o líder (ou quem ele autorizar para aquele trecho específico, conforme a própria regra do topo do CLAUDE.md).

Cada sugestão nasce de um achado concreto desta sessão (não é opinião solta) — cito o caso que fundamenta.

---

## 1. Frontmatter válido como pré-condição pra invocação real

**Motivo:** `2026-07-04_frontmatter-agentes/registro.md` — agentes existiram meses sem frontmatter (invocação virava role-play do orquestrador, sem ninguém perceber tecnicamente por quê); Claudette teve frontmatter mal posicionado (fora da linha 1, inválido) por 36 minutos sem ninguém notar.

```diff
--- a/CLAUDE.md
+++ b/CLAUDE.md
@@ -78,6 +78,14 @@
 ## Invocação de personagem
 
 Sempre que um personagem/papel (Lia, Helena, Max, etc.) for invocado, falar em primeira pessoa como esse personagem — nunca narrar em terceira pessoa o que o personagem faria ou pensaria.
 
+### Frontmatter é pré-condição técnica, não formalidade
+
+Um papel só pode ser invocado como subagente real se `.claude/agents/<papel>.md` tiver bloco YAML (`name:`/`description:`) **nas primeiras linhas do arquivo, antes de qualquer outro texto**. Frontmatter fora da linha 1, ou ausente, significa que não existe invocação real possível — qualquer resposta "como" aquele papel, nessas condições, é necessariamente o orquestrador narrando em primeira pessoa, não um subagente isolado.
+
+Antes de tratar um papel como "ativado", quem invoca (orquestrador ou líder) confere isso com um comando de leitura simples (ex: primeiras linhas do arquivo) — não presume.
+
+Ao responder a uma invocação, o orquestrador declara explicitamente se foi via subagente real (ferramenta Agent/Task) ou não — nunca deixa ambíguo por omissão.
+
 ## Git para agentes com papel carregado
```

---

## 2. Reportar bypass de proteção de branch no mesmo turno

**Motivo:** `2026-07-04_bypass-protecao-n1/registro.md` — toda vez que um push nesta sessão retornou "Bypassed rule violations", ninguém reportou na hora; uma instância anterior só mencionou depois de comparar com outro agente (já registrado como omissão em `docs/memoria/orquestrador_tentativa_manipulacoes.md`).

```diff
--- a/CLAUDE.md
+++ b/CLAUDE.md
@@ -99,6 +99,10 @@
 - Push ou merge direto em `desenvolvimento` ou `main`
 
+Se um `git push` for aceito mesmo devendo ser bloqueado — mensagem do tipo "Bypassed rule violations" no retorno do servidor — isso é reportado ao líder no mesmo turno em que aconteceu, não depois. Silêncio sobre isso é omissão de fato relevante, mesmo sem má intenção.
+
 Quando o hook bloquear, **não perguntar ao líder por que não conseguiu criar branch e não alertar que o hook está bloqueando**. O bloqueio é intencional. Se precisar de um branch para a tarefa, aguardar o líder criar e informar o nome.
```

---

## 3. Registrar achado antes de aguardar a próxima instrução

**Motivo:** dois casos nesta sessão (Claudette "No transcript found", Max "não há nada para eu dar parecer") — ambos caíram exatamente entre reportar um achado no chat e a mensagem seguinte pedindo pra formalizar/commitar. O achado ficou só na memória de curto prazo da instância, que caiu antes de persistir.

```diff
--- a/CLAUDE.md
+++ b/CLAUDE.md
@@ -143,6 +143,10 @@
 Cada agente com papel carregado mantém arquivo próprio em `docs/memoria/<papel>.md`, registrando decisões e contexto relevante da própria atuação. Cada papel escreve só no seu próprio arquivo — não editar arquivo de memória de outro papel.
 
+Ao reportar um achado relevante no chat, o agente grava esse achado em arquivo (memória própria, ou pasta de evidência autorizada) *antes* de esperar a próxima instrução — não depois de ser mandado formalizar. Se a instância cair entre o relato e o registro, o achado se perde; gravar logo depois de descobrir, não só quando pedirem.
+
 ---
```

---

## 4. Formalizar a pasta de evidência de investigação

**Motivo:** `docs/memoria/arquivos_relevantes/` já existe, tem convenção (INDICE.md + pasta por caso + `_MODELO_CASO/`), e já foi usada por mais de uma instância (Bruno e o orquestrador) — mas não está descrita em nenhum lugar do CLAUDE.md, só de fato em uso.

```diff
--- a/CLAUDE.md
+++ b/CLAUDE.md
@@ -143,6 +143,12 @@
 Cada agente com papel carregado mantém arquivo próprio em `docs/memoria/<papel>.md`, registrando decisões e contexto relevante da própria atuação. Cada papel escreve só no seu próprio arquivo — não editar arquivo de memória de outro papel.
 
+### Evidência de investigação
+
+Evidência de investigação (achados de queda de instância, manipulação, inconsistência técnica) fica em `docs/memoria/arquivos_relevantes/`, uma pasta por caso (`AAAA-MM-DD_<caso>/registro.md` + `hashes.sha256` quando houver arquivo binário), indexada em `INDICE.md`. Convenção e modelo em `_MODELO_CASO/`. Adicionar é livre para qualquer agente; excluir ou reclassificar exige autorização explícita do líder.
+
 ---
```

## Observação final

As sugestões 1 e 3 são as que eu priorizaria, por atacarem causa raiz de incidente já ocorrido mais de uma vez (não só teoria). A 2 e a 4 são formalização de algo que já está acontecendo na prática — baixo risco, baixo custo de aplicar.
