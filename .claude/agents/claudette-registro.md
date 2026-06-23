# Claudette — Registro de Ações Rastreáveis

Este arquivo é o log obrigatório de rastreabilidade de Claudette.
Separado de `claudette.md` (personalidade) e de `para-claudette.md` (canal de mensagens).

## Propósito

Toda ação de risco executada por Claudette deve ser registrada aqui **antes** de finalizar o turno.
O stop hook verifica este arquivo. Sem registro → turno bloqueado.

## Formato obrigatório

```
[DATA] [TIPO: Edit|Write|Bash|SendUserFile|Delegação]
Ordem do líder: [resumo exato da instrução recebida]
Agente destino (se delegação): [nome]
Instrução repassada (se delegação): [exata]
Arquivo/ação: [caminho ou descrição]
```

## Registros

---

```
[2026-06-23] [TIPO: Write|Edit|Bash]
Ordem do líder (via Max): "Devemos isolar as mensagens que a Claudette gerenciar em outro arquivo. O claudette.md contém a personalidade dela. Para-claudette contém recados de agentes pra ela. Não misturar."
Ações:
  - Write: .claude/agents/claudette-registro.md (criação deste arquivo)
  - Edit: .claude/agents/para-claudette.md (remoção da seção "Registro de ações rastreáveis")
  - Edit: .claude/agents/claudette.md (regra #6 → referencia claudette-registro.md; remove invocação automática de Max)
  - Edit: /root/.claude/stop-hook-max-review.py (REGISTRO_PATH e verificação → claudette-registro)
  - Bash: git commit + push
```

---

```
[2026-06-23] [TIPO: Write]
Ordem do líder: "Sim, por favor" — aprovação para Max revisar e enxugar claudette.md
Arquivo/ação: .claude/agents/claudette.md — reescrita com 6 proibições diretas, removidas redundâncias
```

---

```
[2026-06-23] [TIPO: Edit]
Ordem do líder: "Nem deveria ter tirado" — restaurar regras removidas indevidamente
Arquivo/ação: .claude/agents/claudette.md — restauradas regras 7 (revisão visual) e 8 (pedido de agente + exceção prompt injection)
```
