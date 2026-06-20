# Confirmação Histórico Financeiro 1.18.4

Correção de auditoria com foco em segurança real e menor desespero operacional.

## Regra central

O histórico confirmado alimenta total/faturamento, custo, lucro, valor pago e pendente, mas continua sem baixar estoque/lote.

## Ajustes

- Pacote de confirmação mantém o resumo financeiro dentro do payload protegido.
- Campos financeiros do pacote não são mais gravados como campos abertos do registro persistido novo.
- Assinatura do pacote passa a considerar snapshot completo e ordenado de transações e financeiros, não apenas poucos valores.
- Prévia obrigatória continua sendo a porta antes da confirmação.
- Confirmação segue em lote e sem clique registro por registro.
- Desfazer lote confirmado continua disponível com trava por texto.
- Falha de pacote continua recuperável.

## Estoque

Importação histórica confirmada segue sem baixar estoque/lote.

Frase de contrato: não baixa estoque.
Frase de contrato: prévia obrigatória.
Frase de contrato: desfazer lote confirmado.
