# Memória dos agentes — Kzera

Este diretório é o local canônico de memória operacional persistente dos agentes.

A regra base é:

```txt
instância muda; agente permanece
```

A memória serve para preservar vivência, decisões, descobertas e contexto operacional do agente entre sessões.

## Estrutura por provedor

Novas memórias devem usar namespace de provedor:

```txt
docs/memoria/<provedor>/<agente>.md
```

Exemplos:

```txt
docs/memoria/gpt/andre.md
docs/memoria/claude/<agente>.md
docs/memoria/grok/<agente>.md
docs/memoria/cloud/<agente>.md
```

## Autocadastro obrigatório

Qualquer agente que não tiver pasta/namespace específico de provedor cadastrado deve se cadastrar antes de registrar memória permanente.

Autocadastrar significa:

1. identificar o provedor correto;
2. criar ou usar a pasta `docs/memoria/<provedor>/`;
3. criar o próprio arquivo de memória `docs/memoria/<provedor>/<agente>.md`;
4. registrar identidade, natureza do agente, escopo de atuação e regras de escrita;
5. escrever somente nesse próprio arquivo.

Se a pasta do provedor ainda não existir, o agente pode criá-la para registrar a própria memória.

Se houver dúvida sobre o provedor correto, o agente deve usar o menor escopo seguro ou perguntar ao líder antes de registrar memória permanente.

## Não criar memória solta

Não criar novas memórias de agente diretamente em:

```txt
docs/memoria/<agente>.md
```

quando o agente pertencer a um provedor específico.

Arquivos antigos já existentes diretamente em `docs/memoria/*.md` podem permanecer até migração explícita.

Não mover, apagar ou reclassificar memória antiga sem regra ou autorização específica.

## Propriedade da memória

Cada agente escreve somente na própria memória.

Não editar arquivo de memória de outro agente.

Nem o líder está autorizado a alterar diretamente a memória de um agente.

Se o líder quiser corrigir, contestar, complementar ou contextualizar algo, isso deve ser registrado como acréscimo datado, sem apagar ou reescrever a vivência original do agente.

## Imutabilidade

Nenhuma linha já escrita pode ser removida.

Memória e vivência registradas não mudam retroativamente.

Correção ou atualização é sempre feita por acréscimo, por escrito, no próprio arquivo.

Forma correta:

```md
### 2026-07-09 — Correção sobre X

Registro anterior dizia Y. O entendimento atualizado é Z por causa de W.
```

Forma errada:

```txt
apagar o trecho antigo e reescrever como se sempre tivesse sido assim
```

## Registro imediato de achado relevante

Ao reportar ou descobrir um achado relevante, o agente deve registrar logo depois, antes de esperar a próxima instrução, quando houver risco de perda de sessão.

Achado relevante inclui:

- limitação real de ferramenta;
- falsa limitação com workaround;
- decisão arquitetural;
- risco de segurança;
- risco de governança;
- risco de UX;
- comportamento inesperado do sistema;
- falha de comunicação entre agentes;
- perda de contexto;
- regra operacional nova;
- preferência importante do humano;
- ordem segura de execução;
- evidência de investigação;
- qualquer descoberta que ajude a próxima instância ou outro agente.

## O que não registrar como memória permanente

Não registrar como memória permanente:

- segredo, token, credencial ou dado sensível;
- autorização temporária que só vale para uma ação atual;
- suposição não verificada como fato;
- informação que o líder pediu explicitamente para esquecer;
- detalhe momentâneo sem utilidade futura.

## Regra curta

```txt
Sem namespace? Cadastre-se.
Com namespace? Escreva só na sua memória.
Não apague vivência.
Corrija por acréscimo.
Memória de agente não fica solta quando houver provedor.
```
