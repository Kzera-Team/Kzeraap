# Mockups UI — MVP Importação Financeira

Responsável: Lia — UI visual
Status: proposta visual textual para análise do líder
Base: requisito Produto e fluxo UX do MVP de importação

## Direção visual

A interface deve ser simples, direta e tranquila.

Prioridade:

```text
clareza > beleza > densidade de informação
```

A usuária precisa perceber rapidamente que nada oficial foi alterado antes da confirmação final.

## Componentes visuais comuns

### Selo de segurança

Usar selo textual em telas críticas:

```text
Nada foi confirmado ainda
```

ou:

```text
Nenhum dado oficial será alterado
```

### Botões

Ação principal sempre clara.

Ação destrutiva deve ficar separada e com texto explícito.

Evitar botão genérico como `OK` em ações críticas.

## Mockup 1 — Retomada/recuperação

Arquivo futuro sugerido:

```text
07-retomada-importacao.html
```

### Estrutura

```text
[Topo]
Importação financeira

[Card principal]
Título: Encontramos uma importação em andamento
Texto: Nada foi confirmado ainda.
Selo: Seguro para revisar

[Resumo]
Arquivos carregados
Período identificado
Pendências encontradas
Última atualização

[Ações]
Botão principal: Continuar revisão
Botão secundário: Descartar importação
```

### Observação visual

A tela deve acalmar, não pressionar.

## Mockup 2 — Resolver pendências guiadas

Arquivo futuro sugerido:

```text
08-resolver-pendencias-guiada.html
```

### Estrutura

```text
[Topo]
Resolver pendências
Texto: Precisamos revisar alguns itens antes de confirmar.
Selo: Nada foi confirmado ainda

[Filtros simples]
Todas
Pagamento sem venda
Valor diferente
Possível duplicidade
Separados para revisão

[Card de pendência]
Título simples
Explicação curta
Impacto
Ação recomendada

Botões:
- Resolver
- Revisar manualmente
- Deixar fora desta confirmação
```

### Card exemplo

```text
Pagamento sem venda encontrada
Esse pagamento não encontrou uma venda correspondente.
Revise antes de confirmar ou deixe fora desta importação.

Ação recomendada: revisar manualmente.
```

## Mockup 3 — Revisão manual

Arquivo futuro sugerido:

```text
09-revisao-manual.html
```

### Como aparece

Pode ser bottom sheet ou estado dentro do card.

### Bottom sheet

```text
Título: Separar para revisão manual?
Texto: Este item não será confirmado agora.
Apoio: Você pode voltar nele depois.

Botões:
- Cancelar
- Separar para revisão
```

### Estado do card após confirmar

```text
Status: Separado para revisão
Mensagem: Não entra na confirmação atual
Ação: Desfazer
```

## Mockup 4 — Descartar importação

Arquivo futuro sugerido:

```text
10-confirmar-descarte-importacao.html
```

### Bottom sheet

```text
Título: Descartar esta importação?
Texto principal: Nenhum dado oficial será alterado.
Texto de apoio: Você poderá importar novamente depois.

Botões:
- Voltar
- Descartar importação
```

### Após descarte

```text
Mensagem: Importação descartada.
Tela: início da importação financeira.
```

## Fora do visual agora

Não desenhar neste MVP:

- aprovação em massa segura completa;
- fluxo completo de limpeza segura ao sair ou bloquear sessão;
- telas de configuração avançada;
- filtros avançados.

## Critério UI de sucesso

A usuária deve bater o olho e entender:

```text
Estou segura.
Nada foi confirmado ainda.
Eu posso continuar, revisar ou descartar.
```

## Próximo responsável

Depois da aprovação do líder, Dev pode criar os HTMLs/mockups ou implementar a tela real conforme decisão do fluxo.
