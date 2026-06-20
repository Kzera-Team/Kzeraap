# Resolução guiada de pendências — 1.17.1

A importação/conciliação agora tem ações guiadas no staging.

## Regras

- Resolver pendência não cria transação definitiva.
- Resolver pendência não baixa estoque.
- Vínculos entre transação e movimentação ficam no staging.
- Dados sensíveis continuam dentro de payload protegido.
- Ações disponíveis nesta etapa:
  - vincular pagamento posterior provável;
  - marcar registro para revisão manual;
  - ignorar registro no staging.

## Segurança

A tela pode exibir dados descriptografados somente durante sessão autenticada.
Nenhum campo sensível novo foi criado fora do payload protegido.

## Usuária

A pessoa não precisa reler a tabela inteira para cada caso provável: a tela apresenta ações textuais e diretas nos registros e na conciliação.

## Ajuste 1.17.1

A resolução guiada agora inclui aprovação em massa para sugestões seguras e detalhes expansíveis por linha. Registros incompletos, divergentes ou ambíguos ficam fora automaticamente.

## Ajuste 1.17.2

A resolução em massa agora passa por revalidação no caso de uso, seleção múltipla com exceções e operação protegida contra aprovação de registros incompletos.
