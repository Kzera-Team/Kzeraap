# 1.18.3 — Pacote persistente protegido e recuperação de confirmação histórica

## Objetivo

Corrigir a confirmação histórica para uso operacional mais seguro: pacote congelado persistente, financeiro oficial protegido, duplicidade intra-lote, recuperação de falha e desfazer com trava contra toque acidental.

## Decisões aplicadas

- O histórico confirmado continua sem baixar estoque/lote.
- Faturamento, custo, lucro, valor pago e valor pendente continuam alimentando o histórico financeiro.
- A prévia deixa de ser apenas marca no staging e passa a gerar um pacote persistente protegido.
- O pacote contém snapshot protegido das transações e movimentações planejadas.
- A confirmação usa o pacote congelado como fonte canônica.
- Duplicidade interna no próprio pacote bloqueia confirmação.
- Movimentação financeira repetida em duas transações do mesmo pacote bloqueia confirmação.
- Lotes confirmados ficam recuperáveis após recarregar a tela.
- Desfazer lote exige digitar DESFAZER.
- Desfazer lote bloqueia se algum dado oficial do lote foi alterado depois da confirmação.
- Falha parcial registra pacote em status falha_confirmacao para recuperação persistente.
- Dados oficiais de Transações, Pagamentos, Movimentos e Contas usam repositório protegido no IndexedDB.

## Proteção de dados

Os repositórios oficiais financeiros usam payloadProtegido no navegador:

- TransacaoFinanceira;
- PagamentoTransacao;
- MovimentoFinanceiro;
- ContaFinanceira.

O registro aberto mantém apenas metadados técnicos mínimos, como id, tipo de registro, status, origem, loteConfirmacaoId, createdAt e updatedAt.

## Baixo clique

A confirmação segue em lote. A usuária não confirma item por item.

Para evitar toque acidental em ação grande, a confirmação passa por:

1. Pré-visualizar e congelar pacote.
2. Preparar confirmação segura.
3. Confirmar em lote.

O desfazer é raro e destrutivo, então exige texto de confirmação.

## Recuperação

Pacotes confirmados e pacotes com falha são listados novamente mesmo depois de recarregar a tela.

Pacote com falha pode ser recuperado pelo botão de recuperação, usando os IDs dos artefatos gravados no payload protegido do pacote.

Observação: a confirmação histórica não baixa estoque.
O pacote preserva total/faturamento, custo, lucro, pago e pendente.

Regras de compatibilidade: prévia obrigatória, sem clique registro por registro, desfazer lote confirmado e sem baixar estoque/lote.
