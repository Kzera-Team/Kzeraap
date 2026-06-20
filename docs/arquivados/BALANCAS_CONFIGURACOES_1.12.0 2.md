# 1.12.0 — Cadastro de balanças em Configurações

## Decisão

Cadastro de balanças é configuração operacional rara. Por isso fica em **Configurações**, não no Dashboard.

## Regra de Dashboard

Antes de colocar qualquer coisa no Dashboard, responder:

- A Usuária vai clicar/ver isso quantas vezes hoje, amanhã e depois de amanhã?
- Ela precisa ou quer ver isso aqui quantas vezes nos próximos 7 dias?

Se for uso raro, mensal, institucional ou apenas bonito, não entra no Dashboard.

## O que foi implementado

- Cadastro de balanças com nome/apelido, código opcional, status ativa/inativa, padrão e observação.
- Listagem das balanças em Configurações.
- Ativar/inativar balança.
- Tornar balança ativa como padrão.
- Histórico de calibragem por balança.
- Registro de calibragem com peso usado, unidade, resultado e observação.
- Bloqueio conceitual de pesagem quando não houver balança ativa.
- Sugestão automática quando houver uma única ativa ou uma padrão.

## Teste da Usuária

A usuária não precisa ver cadastro de balança no painel todo dia. Ela cadastra raramente, em Configurações. Quando for pesar, o sistema deve usar a balança ativa/padrão ou pedir escolha.

## Ainda não implementado

- Pesagem rápida persistente.
- Seleção real de balança dentro da pesagem rápida.
- Integração da calibragem com conferência.
