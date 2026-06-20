# Governança Operacional app público/Kzera — 1.9.49

Este documento fixa no repositório as regras que impedem a equipe de perder o contexto dos prompts oficiais.

## Regra central

Antes de qualquer decisão, pensar como a **Usuária**: uma pessoa exausta, usando iPhone de madrugada, com pressa, baixa paciência e repetindo tarefas muitas vezes.

Pergunta obrigatória:

> Uma pessoa exausta conseguiria usar isso rápido e sem xingar o sistema?

Se a resposta for não, o fluxo está errado.

## Identidade

- Nome público: **app público**.
- Nome interno no código: **Kzera/kzera**.
- Backend futuro: não usar app público nem Kzera como nomenclatura interna ou DNS.

## Estado oficial da etapa

- Versão base: 1.9.48.
- Nova etapa: 1.9.49.
- Última correção: Dashboard operacional sem resumo redundante, sem vitrine e com menos espaço morto.
- Próxima prioridade: Estoque, Lotes, Fracionamento, Pesagem rápida, Balanças, Conferência e Retirada Interna.
- Transações: bloqueadas até estoque consistente.

## Pendência x Backlog

- **Pendência**: regra já decidida e ainda não executada.
- **Backlog**: importante, mas deixado para depois ou ainda dependente de decisão.

Transações é backlog enquanto o estoque real não estiver consistente.

## Modelo oficial de estoque

```text
Item → Variação → Lote → Fracionamentos / Pesagem / Conferência / Retirada Interna
```

Estoque como campo simples do item não é suficiente para a regra atual.

## Unidades

- Unidade interna de precisão: **mg**.
- Exibição e atalhos operacionais: **g**, quando facilitar a leitura.
- Botões de ajuste devem informar unidade explicitamente, por exemplo: `+1 mg`, `-10 mg`.

## Regra de prontidão

Build passando não significa pronto.

Antes de considerar uma entrega pronta, validar:

1. Fluxo mobile/iPhone.
2. Botões claros, sem ação misteriosa.
3. Ausência de área morta.
4. Ausência de resumo redundante.
5. Salvamento imediato em ações críticas.
6. Recuperação após interrupção.
7. Correção de erro humano sem refazer tudo.
8. Redução de carga mental para a Usuária.

## Relatório obrigatório de entrega

Toda entrega deve informar:

```text
Versão analisada:
Objetivo da etapa:
O que foi alterado:
Pendências resolvidas:
Pendências restantes:
Backlog:
Riscos encontrados:
Teste da Usuária:
Testes técnicos executados:
O que NÃO considerar pronto ainda:
Recomendação da equipe:
Próxima versão sugerida:
```
