# Fluxo UX — MVP Importação Financeira

Responsável: Helena — UX funcional
Status: proposta UX para análise do líder
Base: requisito de Produto do MVP de importação

## Objetivo UX

Fazer a usuária entender onde está, o que aconteceu e qual ação segura pode tomar.

A tela deve evitar linguagem técnica e reduzir medo de alterar dado oficial errado.

## Princípio da Senhora Cansada

A usuária pode estar exausta, com pouca atenção e sem paciência para interpretar termos técnicos.

Por isso, cada tela deve responder rapidamente:

```text
O que aconteceu?
Isso alterou algo oficial?
Qual é o próximo passo seguro?
```

## Fluxo geral

```text
1. Usuária inicia importação
2. Sistema prepara staging
3. Sistema identifica pendências ou itens seguros
4. Usuária resolve, separa ou descarta
5. Sistema apresenta prévia segura
6. Confirmação só acontece depois de ação explícita
```

## Tela 1 — Retomada/recuperação de importação

### Quando aparece

Aparece quando o app encontra:

- importação em andamento;
- prévia congelada não confirmada;
- confirmação interrompida;
- dados temporários que precisam de revisão.

### Mensagem principal

```text
Encontramos uma importação em andamento.
Nada foi confirmado ainda.
```

Quando houver confirmação interrompida, usar variação:

```text
Encontramos uma confirmação interrompida.
Vamos verificar antes de continuar.
```

### Ações

- Continuar revisão
- Descartar importação

### Estado depois da ação

- Continuar revisão leva para pendências ou prévia segura.
- Descartar abre confirmação simples de descarte.

## Tela 2 — Resolver pendências guiadas

### Quando aparece

Aparece quando existem pendências que impedem confirmação direta.

### Mensagem principal

```text
Precisamos revisar alguns itens antes de confirmar.
```

### Card de pendência

Cada card deve ter:

```text
Título simples
Explicação do problema
Impacto
Ação recomendada
Ações disponíveis
```

### Exemplos de texto

```text
Pagamento sem venda encontrada
Esse pagamento não encontrou uma venda correspondente.
Você pode revisar manualmente ou deixar fora da confirmação agora.
```

```text
Valor diferente
Encontramos uma venda e um pagamento parecidos, mas os valores não batem.
Revise antes de confirmar.
```

```text
Possível duplicidade
Este item parece parecido com outro já encontrado.
Confira para evitar duplicação.
```

### Ações

- Resolver
- Revisar manualmente
- Deixar fora desta confirmação

### Estado depois da ação

- Resolvido: item sai da lista de pendências bloqueantes.
- Revisão manual: item recebe status `Separado para revisão`.
- Fora desta confirmação: item não entra na confirmação atual.

## Tela 3 — Revisão manual

### Quando aparece

Aparece como ação em lista, card ou detalhe do item.

### Mensagem curta

```text
Separar este item para revisar depois?
Ele não será confirmado agora.
```

### Estado visual esperado

Após marcar:

```text
Separado para revisão
Não entra na confirmação atual
```

### Ações

- Confirmar revisão manual
- Cancelar
- Desfazer depois, se permitido

## Tela 4 — Descartar importação

### Quando aparece

Aparece quando a usuária escolhe descartar importação em andamento.

### Mensagem principal

```text
Descartar esta importação?
Nenhum dado oficial será alterado.
```

### Texto de apoio

```text
Você poderá importar novamente depois, se quiser.
```

### Ações

- Voltar
- Descartar importação

### Estado depois da ação

- Importação temporária descartada.
- Usuária volta para tela inicial de importação.
- Nenhum dado oficial alterado.

## Fora do MVP UX agora

- aprovação em massa segura completa;
- limpeza segura completa ao sair ou bloquear sessão;
- filtros avançados de revisão;
- resolução automática avançada.

## Critério UX de sucesso

A usuária precisa conseguir seguir o fluxo sem perguntar:

```text
Isso já foi confirmado?
O que está errado?
O que acontece se eu descartar?
Como separo para revisar depois?
```

## Próximo responsável

Lia deve transformar este fluxo em proposta visual/mockup.
