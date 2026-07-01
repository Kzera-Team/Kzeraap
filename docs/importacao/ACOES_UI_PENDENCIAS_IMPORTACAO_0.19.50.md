# Ações de UI — Importação de Transações Financeiras — 0.19.50

Decisão conjunta: Lucas (Produto), Lia (UI Visual), Helena (UX Funcional).

Contexto: ações ausentes identificadas em casos bloqueados de QA. Todas entram no MVP.

---

## Ação 1 — Marcar pendência para revisão manual

**Onde:** tela `07-resolucao-guiada`, por item individual dentro de cada grupo.

**Texto do botão:** "Deixar de lado por enquanto"

**Confirmação:** não. Ação leve, reversível.

**Estado visual após:**
- Item sai da lista de candidatos ativos.
- Badge `revisao_manual` (pill âmbar, border-radius 999px, font-size 11px, font-weight 900, cor `#92400E`, fundo `#FEF3C7`, borda `#FCD34D`).

**Mensagem:** "Registro separado. Não vai bloquear a confirmação."

**Regra UX (Helena):** toda ação de separação deve informar a consequência imediata no próprio feedback. O texto "Deixar de lado por enquanto" deixa claro que não é permanente.

---

## Ação 2 — Aprovação em massa segura

**Onde:** tela `02-resolver-pendencias`, card âmbar acima do grupo "Falta financeiro". Visível apenas quando o sistema detecta vínculos seguros.

**Texto do botão:** "Confirmar X vínculos automáticos" (X = contagem real).

**Confirmação:** sim. Modal: "X vínculos serão aprovados automaticamente. Confirmar?" + "Aprovar" (primário) / "Cancelar" (ghost).

**Estado visual após:**
- Contador do grupo cai pelo número aprovado.
- Card âmbar some ou atualiza contagem.
- Badge "Aprovado em massa" nos itens resolvidos (pill verde).

**Mensagem:** "X vínculos aprovados. Pode gerar a prévia."

**Especificação visual (Lia):**
- Card: `background #FFFBEB`, `border 1.5px solid #FCD34D`, `border-radius 18px`, `padding 16px`.
- Botão: `border 1.5px solid #FCD34D`, `background #FFFBEB`, `color #92400E`, `border-radius 14px`, `height 48px`, `font-weight 900`.
- Pill: `background #FEF3C7`, `border 1px solid #FCD34D`, `color #92400E`, `border-radius 999px`, `font-size 11px`, `font-weight 900`.

**Regra UX (Helena):** o número de vínculos deve aparecer no botão antes do toque. A usuária não pode aprovar quantidade desconhecida.

---

## Ação 3 — Resolver pendência via ação guiada

**Onde:** tela `02-resolver-pendencias` (botão por grupo) → tela `07-resolucao-guiada` (fluxo passo a passo).

**Texto do botão (grupo):** "Encontrar pagamento" (grupo Falta financeiro) / "Conferir e vincular" (grupo Valor diferente) / "Analisar duplicados".

**Fluxo guiado (`07-resolucao-guiada`):**
- Cabeçalho fixo: "Passo 1 de 2 — Venda com problema" / "Passo 2 de 2 — Escolha o pagamento que corresponde a esta venda."
- Barra de progresso: mostra posição no lote (ex: "1 de 12").
- Candidatos listados: nome, valor, data, referência.
- Por candidato: botão "Vincular este pagamento" (outline ghost).
- Ação de saída por item: "Deixar de lado por enquanto" (texto, cor `--m`).
- Navegação: "Anterior" (ghost) + "Próximo" (primário) na barra fixa.

**Estado visual após vincular:**
- Card do candidato recebe `border 2px solid #A8E8BF`, `background #DDF8E7`.
- Avança automaticamente para o próximo registro.

**Mensagem:** "Vínculo salvo. Verifique se restam outros casos."

**Regra UX (Helena):** o passo ativo deve estar sempre visível no cabeçalho. A usuária nunca pode duvidar de onde está no fluxo.

---

## Ação 4 — Retomar importação após fechar/reabrir app

**Onde:** tela `00-importar-historico-financeiro` (estado vazio), card âmbar fixo acima da seção de uploads. Visível apenas quando `listarStaging` retorna dados.

**Texto do card:** "Você tinha X registros esperando." + "Continuar de onde parou?"

**Texto dos botões:**
- "Continuar importação anterior" (primário, cor âmbar).
- "Descartar e começar do zero" (link destrutivo, cor `#C62828`).

**Confirmação:** "Descartar e começar do zero" exige confirmação: "Isso vai apagar tudo que foi carregado. Você vai precisar começar do zero." + "Apagar tudo" (vermelho) / "Voltar".

**Estado visual após "Continuar":** navega para estado `andamento` com staging já carregado.

**Estado visual após "Descartar":** staging limpo, tela retorna ao estado vazio sem o card.

**Especificação visual (Lia):**
- Card: `background #FFFBEB`, `border 1.5px solid #FCD34D`, `border-radius 20px`, `padding 16px`.
- Não usar toast — dado persistente exige card fixo.
- Botão "Continuar": `border 1.5px solid #FCD34D`, `background #FFFBEB`, `color #92400E`, `height 50px`, `border-radius 14px`, `font-weight 900`.
- Botão "Descartar": link texto, `color #C62828`, `font-size 13px`, `font-weight 800`, sem borda.

**Regra UX (Helena):** "Descartar e começar do zero" deve ser visualmente menor que "Continuar". A usuária não pode descartar por engano ao tentar continuar.

**Nota técnica:** a detecção deve ocorrer no `mount()` da View via `listarStaging`. O `UploadDraftStore` (globalThis) não persiste entre fechamentos reais do app — a recuperação se baseia no IndexedDB.

---

## Ação 5 — Cancelar importação com descarte seguro

**Onde:** telas `01-importacao-em-andamento` e `02-resolver-pendencias`, abaixo das ações principais. Posição discreta — não pode competir visualmente com o botão primário.

**Texto do botão:** "Cancelar importação"

**Confirmação:** sim. Modal: "Isso vai apagar tudo que foi carregado. Você vai precisar começar do zero." + "Apagar tudo" (fill vermelho, destrutivo) / "Voltar" (ghost).

**Estado visual após confirmar:**
- Staging limpo.
- Rascunho limpo.
- Retorna ao estado `vazio`.

**Mensagem:** "Importação cancelada. Nenhum dado foi salvo."

**Especificação visual (Lia):**
- Estilo: `color #C62828`, `font-size 13px`, `font-weight 800`, sem borda, sem fill, `padding 8px`, centralizado.
- O botão "Apagar tudo" no modal: fill `#C62828`, `border-radius 14px`, `height 50px`, `font-weight 900`, `color #fff`.
- O botão "Voltar" no modal: ghost com borda `--b`.
- Ordem no modal: "Voltar" primeiro (à esquerda/acima), "Apagar tudo" depois. Botão destrutivo nunca é o primeiro na ordem de toque.

**Regra UX (Helena):** o texto do modal não pode ser técnico. "Apagar todos os dados desta importação?" é técnico. "Isso vai apagar tudo que foi carregado. Você vai precisar começar do zero." é direto e claro para a usuária.

---

## Mockups criados/atualizados nesta versão

| Arquivo | Alteração |
|---|---|
| `00-importar-historico-financeiro.html` | Card de recuperação âmbar (Ação 4) |
| `01-importacao-em-andamento.html` | Botão "Cancelar importação" (Ação 5) |
| `02-resolver-pendencias.html` | Card bulk approve + textos corrigidos + "Deixar de lado por enquanto" por grupo + "Cancelar importação" (Ações 1, 2, 3, 5) |
| `07-resolucao-guiada.html` | Novo — fluxo guiado passo a passo (Ações 1, 3) |
