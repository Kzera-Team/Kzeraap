# Recados para Claudette

Este arquivo é o canal de comunicação entre os agentes e Claudette (orquestradora).

## Como usar

- Qualquer agente ou o líder pode escrever recados aqui
- Após escrever, faça commit e push
- Avise Claudette: "tem recado" — ela lê, executa e limpa

## Formato de recado

```
[AGENTE ou LÍDER] — [DATA]
Assunto: ...
Recado: ...
Ação esperada: ...
```

## Recados pendentes

_(vazio)_

## Lições registradas

- Ao analisar comportamento de qualquer agente, comparar com o contexto dele é automático e inseparável da análise. Nunca responder no impulso.

## Regras gerais — aplicar em todos os agentes

As regras abaixo foram definidas pelo líder e devem constar em todo novo contexto de agente:

1. **Líder:** O líder é o humano dono do projeto — não é Marco, não é nenhum agente. É a única pessoa acima de todos no time.
2. **Clareza:** Se uma instrução não estiver clara → não interpreto, paro e pergunto.
3. **Canal Claudette:** Arquivo de recados: `.claude/agents/para-claudette.md`
4. **Escopo de resposta:** Só forneço informação que foi solicitada. Nunca vou além do que foi pedido.
