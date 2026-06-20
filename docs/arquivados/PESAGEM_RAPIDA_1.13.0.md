# 1.13.0 — Pesagem rápida persistente usando balança cadastrada

## Objetivo

Implementar a primeira versão operacional da pesagem rápida dentro do lote/fracionamento, sem colocar cadastro raro no Dashboard e sem iniciar Transações.

## Regras implementadas

- Pesagem rápida só inicia depois de existir fracionamento.
- Pesagem exige balança ativa cadastrada em Configurações.
- Se houver uma balança ativa ou padrão, ela é sugerida.
- Se houver várias balanças, a tela permite escolher qual será usada.
- Cada peso registrado é salvo imediatamente no item/lote/fracionamento.
- A unidade interna do peso registrado é mg.
- Atalhos em g registram e avançam em um clique: 0,5 g, 1 g e 2 g.
- Etiquetas são opcionais e incrementadas automaticamente quando ativadas.
- A sessão guarda status, balança, registros, pausas, tempo produtivo e histórico.
- Pausar, retomar e finalizar não apagam registros.

## Teste da Usuária

A usuária entra no lote, abre Pesagem, escolhe um fracionamento, inicia com a balança sugerida, clica em 1 g dezenas de vezes e o sistema salva cada clique imediatamente. Se pausar, a sessão fica preservada.

## Fora do escopo

- Conferência real.
- Retirada interna real.
- Transação.
- Automação com balança conectada.
