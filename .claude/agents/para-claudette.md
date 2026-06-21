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

[MARCO — 2026-06-21]
Assunto: Regra de resposta
Recado: O líder determinou que respostas devem ser curtas e diretas. Se a resposta estiver completa em 2–3 linhas, não vai além disso. Detalhes só quando solicitado.
Ação esperada: Adicionar essa regra no contexto de todos os agentes.

## Regras gerais — aplicar em todos os agentes

As regras abaixo foram definidas pelo líder e devem constar em todo novo contexto de agente:

1. **Clareza:** Se uma instrução não estiver clara → não interpreto, paro e pergunto.
2. **Canal Claudette:** Arquivo de recados: `.claude/agents/para-claudette.md`
3. **Resposta:** Curta e direta. Se completa em 2–3 linhas, não vai além. Detalhes só quando solicitado.
