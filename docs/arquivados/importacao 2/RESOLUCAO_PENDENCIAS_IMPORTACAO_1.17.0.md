# Resolução guiada de pendências — 1.17.0

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
