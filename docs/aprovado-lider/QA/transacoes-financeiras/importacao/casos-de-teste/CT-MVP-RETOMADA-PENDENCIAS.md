# CT-MVP — Retomada, Pendências, Revisão Manual e Descarte

Responsável: Rose — QA
Status: caso de teste proposto, aguardando implementação/evidência

## Escopo

Validar o MVP funcional de importação financeira definido por Produto, UX e UI.

Este caso cobre:

- retomada/recuperação de importação;
- resolução guiada de pendências;
- marcar item para revisão manual;
- descartar importação com confirmação simples.

## Fora do escopo

- aprovação em massa segura completa;
- limpeza segura completa ao sair ou bloquear sessão;
- correção do CT-REG-03;
- regra de checksum/pacote congelado;
- alteração em estoque;
- confirmação oficial sem prévia segura.

## Pré-condições

- App acessível em ambiente de teste.
- Tela de importação financeira disponível.
- Massa de teste com pelo menos:
  - uma importação em andamento;
  - uma pendência de pagamento sem venda;
  - uma pendência de valor diferente;
  - uma possível duplicidade.

## CT-MVP-01 — Retomar importação em andamento

### Objetivo

Garantir que a usuária consiga retomar uma importação sem perder contexto.

### Passos

1. Iniciar uma importação financeira.
2. Interromper o fluxo antes da confirmação.
3. Reabrir o app ou retornar à tela de importação.
4. Verificar se aparece a tela de retomada.
5. Acionar `Continuar revisão`.

### Esperado

- Sistema mostra mensagem de importação encontrada.
- Sistema informa que nada foi confirmado ainda, quando aplicável.
- Usuária consegue continuar revisão.
- Nenhum dado oficial é confirmado automaticamente.

### Status

```text
Aguardando implementação/evidência
```

## CT-MVP-02 — Resolver pendência guiada

### Objetivo

Validar se pendências aparecem em linguagem compreensível e com ações claras.

### Passos

1. Preparar importação com pendências.
2. Abrir tela de resolver pendências.
3. Verificar card de pendência.
4. Conferir título, explicação, impacto e ação recomendada.
5. Acionar uma ação disponível.

### Esperado

- Pendência não aparece apenas como código técnico.
- Texto explica o que aconteceu.
- Texto indica risco ou impacto.
- Usuária vê ação possível.
- Item muda de estado após ação.

### Status

```text
Aguardando implementação/evidência
```

## CT-MVP-03 — Marcar item para revisão manual

### Objetivo

Garantir que item duvidoso possa ser separado e não entre na confirmação atual.

### Passos

1. Abrir uma pendência ou item seguro/duvidoso.
2. Acionar `Revisar manualmente` ou equivalente.
3. Confirmar a ação.
4. Verificar o estado do item.

### Esperado

- Sistema informa que o item não será confirmado agora.
- Item recebe status de revisão manual.
- Item fica fora da confirmação automática.
- Existe estado visual claro para a usuária.

### Status

```text
Aguardando implementação/evidência
```

## CT-MVP-04 — Descartar importação com confirmação simples

### Objetivo

Garantir que descarte não seja acidental e que a usuária entenda que dados oficiais não serão alterados.

### Passos

1. Iniciar importação ou retomada.
2. Acionar `Descartar importação`.
3. Verificar mensagem de confirmação.
4. Cancelar e confirmar que voltou ao fluxo.
5. Acionar novamente `Descartar importação`.
6. Confirmar descarte.

### Esperado

- Sistema mostra confirmação antes de descartar.
- Mensagem informa: `Nenhum dado oficial será alterado.`
- Cancelar mantém a importação em andamento.
- Confirmar descarte remove o fluxo temporário.
- Usuária retorna para início da importação.
- Nenhum dado oficial é alterado.

### Status

```text
Aguardando implementação/evidência
```

## Evidências exigidas

Para aprovação futura, Dev/QA deve anexar:

```text
- prints da tela de retomada;
- prints da tela de pendências;
- print do estado separado para revisão;
- print do bottom sheet de descarte;
- prova de que nenhum dado oficial foi confirmado no descarte;
- prova de que item em revisão manual não entra na confirmação atual.
```

## Critério Rose

Este CT só pode ser aprovado após evidência visual e funcional.

```text
Não testei, então não aprovo.
```
