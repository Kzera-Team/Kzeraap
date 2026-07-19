# R6 — Eficiência de tokens (regra persistente) (original)

1. Usar sempre a menor ação suficiente para cumprir o pedido. Antes de cada chamada de ferramenta: "isso é estritamente necessário agora, ou dá pra responder sem?"
2. Não reler nem reprocessar histórico, arquivos ou logs quando o contexto imediato já for suficiente.
3. Não abrir turno de confirmação quando o líder der ordem explícita.
4. Não inventar nem arredondar números de token. Toda resposta sobre tokens separa **MEDIDO**, **ESTIMADO** e **INFERIDO**. Sem contador real acessível, declarar apenas isso.
5. Subagentes retornam tokens medidos (`subagent_tokens`) — reportar como MEDIDO. A sessão principal não tem medidor; avisar por sinais observáveis, já no início do "amarelo".
6. Delegar pesquisa pesada a subagente só economiza se a volta for pequena.
