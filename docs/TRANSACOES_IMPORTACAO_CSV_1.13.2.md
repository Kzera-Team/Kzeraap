# 1.13.2 — Lição de Transações e importação CSV

Esta versão não implementa Transações ainda. Ela registra a decisão para evitar que a equipe crie uma arquitetura errada antes da funcionalidade principal.

## Decisão principal

Não criar “transação rápida” ou “saída rápida” antes da entidade principal de Transação existir.

Atalho operacional só pode nascer como variação segura do fluxo oficial, nunca como caminho paralelo.

## Cenário operacional corrigido

Se chegou um lote grande e a operadora precisa vender apenas uma pequena quantidade sem processar tudo:

1. Entrar no Lote.
2. Criar um fracionamento mínimo, por exemplo `2 g / 1 unidade`.
3. Depois, quando Transações existir, vender esse fracionamento pelo módulo oficial.

Isso evita criar saída com cara de transação antes de existir Transação.

## Regra de cliente na Transação

Perfil não é obrigatório.

Nome do cliente é obrigatório.

A transação pode ser avulsa, mas não pode ser confirmada sem nome do cliente.

Modelo esperado:

- `perfilId` opcional;
- `clienteNome` obrigatório.

## Importação de Transações

Transações deve ter importação.

O CSV real pode trazer campos como:

- Número;
- Status;
- Data;
- Data do Pagamento;
- Quantidade;
- Descrição;
- Desconto;
- Entrega;
- Taxa de Transações;
- Total;
- Valor Pago;
- Custo;
- Lucro;
- Tipos de Pagamento;
- Cliente;
- Observação.

A coluna `Descrição` pode ter múltiplos itens dentro da mesma transação, por exemplo:

```text
1x Gi - 30 ml (80,00)
0,5g x Pérola (400,00)
```

## Checagem obrigatória no importador

Antes de confirmar importação de Transações, o sistema deve gerar prévia corrigível e checar:

1. Cliente informado.
2. Status da transação.
3. Data da transação.
4. Pagamento informado.
5. Total, valor pago, desconto, custo e lucro.
6. Linhas da descrição parseadas em itens da transação.
7. Item/produto citado no CSV existe no app?
8. Variação existe?
9. Origem de estoque existe ou precisa de resolução manual?

## Produto do CSV inexistente no app

Se a planilha cita um produto que não existe no app, o importador não pode criar bagunça silenciosa.

Deve apresentar pendência por linha/item e permitir uma destas ações:

1. Mapear para Item/Variação existente.
2. Criar Item/Variação com confirmação explícita.
3. Ignorar aquela linha/item da importação.

Nada deve ser confirmado sem a usuária enxergar o impacto.

## Regra da Usuária

A importação precisa ser clara e corrigível.

A usuária cansada não deve receber erro genérico como “produto inválido”. Ela precisa ver:

- qual transação deu problema;
- qual texto veio da planilha;
- qual item não foi encontrado;
- quais opções seguras existem;
- o que será criado, mapeado ou ignorado.

## Próxima funcionalidade

1.14.1 — Transações Base.
