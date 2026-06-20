# Métricas locais de UX 1.19.3

## Objetivo

A versão 1.19.3 implementa métricas locais de uso e fluxo para melhorar a experiência da Usuária. O sistema mede apenas sinais genéricos de navegação e conclusão de fluxo.

Não é auditoria da Usuária. Não é monitoramento individual. Não envia dados para fora do app. Não salva dados pessoais, conteúdo digitado, valores financeiros individuais ou IDs reais de Perfil, Item, registro operacional ou registro financeiro.

## Eventos permitidos

- `app_sessao_iniciada`
- `app_sessao_finalizada`
- `app_bloqueado`
- `app_desbloqueado`
- `app_reaberto`
- `tela_aberta`
- `tela_fechada`
- `fluxo_iniciado`
- `fluxo_concluido`
- `fluxo_abandonado`
- `acao_executada`
- `voltar_usado`
- `navegacao_repetida`
- `erro_exibido`
- `lista_limitada`

## Dados proibidos

O sanitizer bloqueia chaves e conteúdos relacionados a nome, telefone, endereço, município, bairro, e-mail, Perfil, Item, Cliente, Produto, registro operacional, registro financeiro, valor, preço, custo, lucro, observação, texto, conteúdo, arquivo, payload, stack e mensagem completa.

## Eventos removidos do escopo inicial

Os eventos de tempo parado, atrito automático e interação por campo foram removidos da 1.19.3 e não devem existir no código desta versão. Eles só podem voltar em versão futura, se forem aprovados novamente.

## Retenção e controle

Eventos brutos são limitados a 2.000 registros locais. A Usuária pode limpar tudo em Configurações, no card de Métricas de uso.

## Arquitetura

A implementação segue a organização atual:

- `domain/uxMetricas`
- `application/uxMetricas`
- `infrastructure/repositories`
- `presentation/shared/uxTracking`

## Critério de aceite

A versão só passa se:

- registrar sessão, tela, fluxo, ação, volta, abandono, erro genérico e lista limitada;
- não registrar dados sensíveis;
- bloquear metadados proibidos por sanitizer;
- não conter os eventos removidos do escopo inicial;
- não enviar nada para fora;
- permitir limpeza local das métricas;
- passar em build e testes.
