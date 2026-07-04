# Documentação técnica de UX — Tela: Importação de Transações Financeiras

**Arquivo de referência:** `src/presentation/importacao/ImportacaoTransacoesFinanceiroView.ts`

---

## Visão geral

Tela de importação histórica de transações e movimentos financeiros. **Nenhum dado vira registro definitivo aqui** — tudo fica em área de conferência (staging) até confirmação explícita. Estoque nunca é alterado por esta tela.

---

## Fluxo principal — 5 etapas em ordem

```
1. Preparar arquivos
       ↓
2. Ver resumo da conferência
       ↓
3. Conferir pagamentos (conciliação)
       ↓
4. Resolver pendências individuais (se houver)
       ↓
5. Revisar e confirmar histórico
```

---

## Seção 1 — Preparação dos arquivos

**Dois formulários lado a lado:**

| Campo | Registros | Financeiro |
|---|---|---|
| Nome do arquivo | preenchido automaticamente ao selecionar | preenchido automaticamente ao selecionar |
| Upload de arquivo | .csv, .tsv, .txt | .csv, .tsv, .txt |
| Área colar conteúdo | textarea 5 linhas | textarea 5 linhas |
| Botão enviar | "⇩ Preparar registros" | "⇩ Preparar financeiro" |

**Comportamento:**
- Selecionar arquivo → nome preenche automaticamente + conteúdo carregado no textarea
- Enviar sem conteúdo → toast: "Cole o conteúdo da planilha antes de preparar"
- Enviar com conteúdo → toast com resultado: "X linhas, Y precisam de atenção"

---

## Seção 2 — Resumo da conferência

Dois cards lado a lado: **Registros** e **Financeiro**.

Cada card exibe:
- Total | Válidos | Pendentes
- Pendentes perfil | Pendentes item | Pendentes financeiro

---

## Seção 3 — Tabelas de registros em conferência

**Aviso de limite:** máximo 80 itens por tabela para não travar o iPhone.

### Tabela de Registros

| Coluna | Conteúdo |
|---|---|
| Transação | #número original |
| Perfil | nome do cliente importado |
| Status | label humanizado |
| Pendências | lista de mensagens (máx. 3) |
| Ações | "⚑ Revisar" / "× Ignorar" |

### Tabela de Movimentações Financeiras

| Coluna | Conteúdo |
|---|---|
| Ref. | #número da transação referenciada |
| Perfil | nome do cliente importado |
| Status | label humanizado |
| Pendências | lista de mensagens (máx. 3) |
| Ações | "⚑ Revisar" / "× Ignorar" |

### Labels de status

| Valor interno | Exibido para usuária |
|---|---|
| pendente_cliente | Pendente: Perfil |
| pendente_item | Pendente: Item |
| pendente_financeiro | Pendente: Financeiro |
| validado | Validado |
| confirmado | Confirmado |
| ignorado | Ignorado |
| erro | Revisão |

---

## Seção 4 — Conferência de pagamentos (conciliação)

### Estado vazio (antes de conferir)
- Texto orientativo
- Botão: "✓ Conferir pagamentos"

### Estado com resultado

**Resumo exibido:**
- Registros | Pagamentos | Pagamentos ok | Pendentes
- Diferenças para revisar | Pagamentos posteriores prováveis
- Parecem certos | Ficam para revisar | Já marcados

**Bloco de aprovação em massa** (visível se houver itens aprováveis):
- Texto: "X pagamentos que parecem certos para marcar juntos"
- Checkboxes por linha (pré-marcados automaticamente)
- Botões: "☑ Marcar certos" / "☐ Desmarcar" / "✓ Marcar como certo" / "↶ Cancelar aprovação conjunta"

**Tabela de itens de conciliação** (máx. 80 itens):

| Coluna | Conteúdo |
|---|---|
| Está certo? | checkbox se aprovável / "Fica fora" se bloqueado |
| Registro | #número da transação |
| Situação | label de status de conciliação |
| Confiança | nível de confiança |
| Valor a resolver | valor pendente |
| Orientação | sugestão + detalhes expansíveis |
| Ações | "✓ Juntar pagamento" / "⚑ Revisar" |

### Labels de status de conciliação

| Valor interno | Exibido para usuária |
|---|---|
| conciliado | Conciliado |
| pendente_sem_financeiro | Pendente sem financeiro |
| pendente_sem_transacao | Pendente sem transação |
| divergencia_valor | Diferença de valor |
| divergencia_perfil | Diferença de perfil |
| divergencia_pagamento | Diferença de pagamento |
| pagamento_posterior_provavel | Pagamento posterior provável |
| revisao_manual | Revisão manual |

---

## Seção 5 — Revisar e confirmar histórico

**Fluxo de 3 passos com segurança:**

1. "👁 Ver antes de confirmar" → carrega prévia com resumo completo
2. "Estou pronta para confirmar" → arma o botão final
3. "✓ Confirmar agora" → executa e mostra resultado

**Prévia exibe:**
- Registros que podem entrar | Pagamentos encontrados | Registros bloqueados
- Período: primeira data — última data
- Valores financeiros (expansível): faturamento, custo, lucro, pago, pendente
- Bloqueios (expansível): lista com botão "Copiar lista completa"
- Avisos (expansível)

**Após confirmação:**
- Toast: "X registros foram salvos. Estoque não foi alterado."

**Área avançada — corrigir confirmação já salva:**
- Visível apenas se existir lote confirmado
- Requer digitar "CANCELAR COM CUIDADO" para liberar o botão de correção
- Lista lotes confirmados com data e contagem de registros

---

## Seção 6 — Retomada de confirmação interrompida

Aparece automaticamente no topo se existir confirmação com falha salva.

**Fluxo:**
1. "Ver o que aconteceu" → abre painel explicativo com resumo e passos em linguagem simples
2. "Limpar restos e abrir revisão" → remove parciais, carrega prévia, arma confirmação
3. Usuária revisa normalmente e confirma

**Mensagens de segurança exibidas:**
- "Nada foi perdido."
- "A confirmação parou antes de terminar. O sistema guardou uma revisão protegida para você voltar com calma."
- Passo a passo numerado com o que vai acontecer antes de qualquer ação

---

## Comportamentos globais

| Situação | Comportamento |
|---|---|
| Erro ao carregar a tela | Toast de erro + botão "↻ Tentar novamente" (sem tela preta) |
| iPhone com muitos registros | Limite de 80 itens por tabela + aviso inline |
| Textos técnicos internos | Substituídos: "staging" → "área de conferência", IDs → "identificador interno protegido" |
| Ações assíncronas | Toast atualizado + tela re-renderizada após cada ação |

---

## Use cases consumidos (referência para dev)

| Dependência | O que faz |
|---|---|
| prepararTransacoes | Parseia CSV de transações e salva no staging |
| prepararFinanceiro | Parseia CSV financeiro e salva no staging |
| listarStaging | Retorna resumo + registros do staging para exibir |
| conciliar | Cruza transações x financeiro e retorna itens de conciliação |
| resolverPendencia | Vincular / marcar revisão / ignorar / aprovar em massa |
| confirmarHistoricoFinanceiro | Prévia / confirmar / desfazer lote / recuperar falha |
