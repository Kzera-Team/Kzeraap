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

---

```
[2026-06-23] [TIPO: Write]
Ordem do líder: "Tudo o que está no arquivo dela era importante. Garanta que nada se perdeu."
Arquivo/ação: .claude/agents/claudette.md — restauração completa de 8 itens perdidos na reescrita anterior
```

---

```
[2026-06-23] [TIPO: Write|Edit|Write]
Ordem do líder: itens 1–6 da lista de pendências
Ações:
  - Write: .claude/agents/claudette.md — versão final comprimida + protocolo Max mínimo + itens restaurados
  - Edit: .claude/agents/ana.md — regra estrutural adicionada
  - Edit: .claude/agents/max.md — 3 erros da Claudette registrados na tabela histórica
  - Write: .claude/mudanca-sessao.md — criação com bloqueadores de segurança do Diego
  - Bash: git commit + push
```

---

```
[2026-07-05] [TIPO: Edit|Bash]
Ordem do líder (via Max, citação literal em docs/memoria/max.md): "...Eu quero que reúna Bruno, Léo e Claudette e cheguem num consenso do que fazer. E vá registrando tudo na sua memória e eles na deles." — convocada isoladamente por Max (worktree agent-a05424a7188201de8) para dar minha posição sobre a política de checkout com CLAUDE.md divergente, sem decidir por Bruno/Léo nem aplicar mudança em CLAUDE.md.
Arquivo/ação:
  - Edit: docs/memoria/claudette.md — registrada minha posição (3 respostas às perguntas de Max) sobre checkout-com-CLAUDE.md-divergente.
  - Bash: git commit + push de docs/memoria/claudette.md, no branch nova_desenvolvimento_de_n1, com base na "Autorização permanente: docs/memoria/*" do CLAUDE.md (líder, 2026-07-04: "Eu autorizo vocês a fazerem commit e push na docs/memoria/*, cada agente em sua respectiva pasta...") — sem pedir confirmação a cada vez, restrito a este arquivo.
```
