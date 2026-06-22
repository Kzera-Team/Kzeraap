# Lições aprendidas — resumo rápido

Leia este arquivo antes de alterar código. Ele é o resumo das lições mais importantes que não podem se repetir.

## Regras que não podem cair

1. Não criar atalho operacional antes da entidade principal existir.
   - Exemplo: não criar "transação rápida" antes de Transações Base existir.
   - Alternativa segura: usar fracionamento mínimo e aguardar o módulo oficial.

2. CSV de Transações exige prévia corrigível antes de confirmar.
   - Item do CSV inexistente no app vira pendência de importação.
   - Ações disponíveis: mapear para existente, criar com confirmação explícita, ou ignorar.
   - Nunca criar produto ou baixa de estoque silenciosamente.

3. Staging também é banco.
   - Dado sensível nunca toca armazenamento físico aberto, nem por milissegundos.
   - CSV/TSV é processado em memória, separado em índice operacional e payload sensível, criptografado e só então persistido.

4. Fluxo longo deve recuperar interrupção.
   - Safari fecha, iPhone bloqueia, bateria acaba, app recarrega — tudo é cenário real.
   - Salvar imediatamente o que o usuário já resolveu.

5. Campo visível deve ser lido, validado e persistido, ou removido da tela.
   - Campo decorativo é mentira operacional.

6. Teste da Usuária: uma pessoa exausta conseguiria usar isso rápido e sem xingar o sistema?

## Checklist antes de codar

1. Isso é Pendência real ou Backlog disfarçado?
2. A ação principal da tela está clara?
3. Há resumo redundante, área morta ou botão misterioso?
4. O dado crítico salva imediatamente?
5. O fluxo recupera interrupção?
6. O usuário consegue corrigir erro humano sem refazer tudo?
7. Simulei uma pessoa cansada repetindo isso muitas vezes no celular?
