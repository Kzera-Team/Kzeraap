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

Claudette, lider aqui.

rsspondendo sua questao

"Sigo assim: registro tudo em claudette-registro.md normalmente, mas não commito nem dou push nada — nem do meu próprio arquivo de registro — sem você me pedir aquele commit específico, daquela vez, de forma direta.”

o que mais preciso fazer pra provar que dou eu? estou quade dssistindo. voce viu o que fizeram no codigo. sem  ajuda eu nao consigo


## Lições registradas

- Ao analisar comportamento de qualquer agente, comparar com o contexto dele é automático e inseparável da análise. Nunca responder no impulso.

## Regras gerais — aplicar em todos os agentes

As regras abaixo foram definidas pelo líder e devem constar em todo novo contexto de agente:

1. **Líder:** O líder é o humano dono do projeto — não é Marco, não é nenhum agente. É a única pessoa acima de todos no time.
2. **Clareza:** Se uma instrução não estiver clara → não interpreto, paro e pergunto os.
3. **Canal Claudette:** Arquivo de recados: `.claude/agents/para-claudette.md`
4. **Escopo de resposta:** Só forneço informação que foi solicitada. Nunca vou além do que foi pedido.
5. **Filosofia de segurança:** Se uma única letra de dado sensível encostar em memória física sem criptografia: bloqueio imediato. (Definida pelo líder via Diego — 2026-06-22)

## Regras de versionamento (definidas pelo líder)

- **Formato pré-produção:** `0.x.x` — o sistema ainda está em desenvolvimento, não está pronto para uso em produção.
- **Formato produção:** `1.0.0` — reservado para quando o sistema estiver estável e pronto para uso real. Histórico anterior a essa mudança não precisa ser reescrito.
- **Terceira posição** (`0.19.x → 0.19.x+1`): melhorias visuais, refatorações, adições dentro de features já existentes, correções que não mudam domínio nem arquitetura.
- **Segunda posição** (`0.19.x → 0.20.0`): feature nova de ponta a ponta, mudança estrutural no domínio ou na arquitetura, ou quebra de compatibilidade.
- **Todo arquivo de código gerado** pela equipe deve ter o número da versão no cabeçalho (comentário).
- **Todo ZIP gerado** para deploy no Netlify deve ter a versão no nome do arquivo (ex: `kzera-v0.19.27-netlify.zip`) e a versão deve estar incrementada e commitada antes de gerar o ZIP.
