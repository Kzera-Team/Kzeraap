# Extrato Bancário — Decisão de produto

**Versão:** 1.19.26
**Status:** Decisão registrada — aguarda implementação

## O que é

Importação de CSV vindo do banco como prova real de que um valor entrou.

Não é o mesmo que "Conferência de pagamentos" (cruzamento interno de lançamentos manuais). É dado externo, oficial, com origem bancária.

## Formato de entrada

CSV. Se o banco não exportar em CSV, a operadora converte via IA antes de importar.

## Fluxo de identificação

Cada linha do extrato bancário deve tentar identificar o dono da venda:

1. Sistema lê a linha do extrato
2. Busca nome do cliente na descrição
3. Cruza data da entrada com data da transação
4. Cruza valor da entrada com valor da transação
5. Encontra cliente na base com data e valor compatíveis → tenta vincular

## Regra de vínculo automático

| Situação | O que o sistema faz |
|---|---|
| Certeza (nome + data + valor batem) | Vincula automaticamente |
| Provável (nome bate, data ou valor divergem levemente) | Sugere — usuária confirma |
| Sem match | Fica como **Valor pendente** |

O sistema **nunca vincula por suposição**. Só age sozinho quando tem certeza.

## Valores pendentes

Linhas do extrato que não foram identificadas ficam em lista de Valores pendentes.

A operadora resolve manualmente — seleciona o valor pendente e vincula à transação correspondente.

## Regra da usuária

A usuária cansada não pode receber uma lista de valores sem saber o que fazer.

Para cada valor pendente ela deve ver:
- Descrição original que veio do banco
- Valor e data
- Sugestões prováveis (se houver) com botão de confirmar
- Opção de vincular manualmente

## O que este módulo não faz

- Não altera estoque
- Não confirma transação automaticamente
- Não cria cliente novo sem confirmação explícita

## Relacionamento com outros módulos

- **Conferência de pagamentos** — cruzamento interno, sem dado bancário
- **Extrato bancário** — este módulo, com CSV do banco
- **Conciliação bancária** — futuro, via integração direta com banco (API)
