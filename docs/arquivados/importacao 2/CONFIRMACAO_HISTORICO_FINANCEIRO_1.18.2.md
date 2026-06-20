# 1.18.2 — Lote reversível, prévia congelada e filtros básicos

Correção da confirmação histórica financeira para reduzir clique e risco operacional.

## Regras aplicadas

- A prévia agora é congelada no staging com `confirmacaoPreviaId` e `confirmacaoAssinatura`.
- A confirmação definitiva exige prévia atual, congelada e visível.
- A confirmação bloqueia antes de criar dado oficial se os repositórios não permitirem remoção para rollback/desfazer.
- Cada confirmação recebe `loteConfirmacaoId`.
- Transações, pagamentos e movimentos criados recebem o mesmo `loteConfirmacaoId`.
- Existe ação de desfazer lote confirmado.
- Ao desfazer, dados oficiais do lote são removidos e o staging volta para validado.
- Bloqueios completos podem ser exportados/copiedos para revisão.
- O resumo financeiro ganhou filtros básicos por período, Perfil/comprador, método/referência, origem e status.
- Histórico importado continua sem baixar estoque/lote.

## Baixo clique

- A confirmação continua em lote.
- A usuária não precisa aprovar registro por registro.
- Exceções aparecem em bloqueios/exportação.

## Segurança

- Dados sensíveis do staging continuam em `payloadProtegido`.
- A confirmação revalida vínculos e somas antes de criar dados oficiais.
- O desfazer é por lote, não manual por transação.

## Compatibilidade de auditoria anterior

- não baixa estoque.
- total/faturamento, custo e lucro continuam preservados no histórico financeiro.
- prévia obrigatória.
- sem clique registro por registro.
