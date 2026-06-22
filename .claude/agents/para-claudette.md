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

## Regras de versionamento (definidas pelo líder)

- **Terceira posição** (`1.19.x → 1.19.x+1`): melhorias visuais, refatorações, adições dentro de features já existentes, correções que não mudam domínio nem arquitetura.
- **Segunda posição** (`1.19.x → 1.20.0`): feature nova de ponta a ponta, mudança estrutural no domínio ou na arquitetura, ou quebra de compatibilidade.
- **Todo arquivo de código gerado** pela equipe deve ter o número da versão no cabeçalho (comentário).
- **Todo ZIP gerado** para deploy no Netlify deve ter a versão no nome do arquivo (ex: `kzera-v1.19.27-netlify.zip`) e a versão deve estar incrementada e commitada antes de gerar o ZIP.
