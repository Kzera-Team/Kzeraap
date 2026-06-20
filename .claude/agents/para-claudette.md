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

[JOSÉ] — 2026-06-20
Assunto: Regra geral de clareza + identificação do arquivo da Claudette
Recado:
  1. Adicione a seguinte regra em TODOS os arquivos de agentes (incluindo o seu próprio):
     "Se uma instrução não estiver clara → não interpreto, paro e pergunto."
     Essa regra é geral e vale para todos os contextos, sem exceção.

  2. Adicione também em TODOS os arquivos de agentes uma regra indicando qual é
     o arquivo de atualização/comunicação da Claudette, para que todos saibam onde
     escrever recados a ela:
     "Canal de comunicação com Claudette: .claude/agents/para-claudette.md"

Ação esperada: Atualizar todos os arquivos de agentes com as duas regras acima,
fazer commit e push. Após concluir, limpar este recado.
