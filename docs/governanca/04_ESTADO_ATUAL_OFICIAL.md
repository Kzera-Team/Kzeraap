# Estado atual oficial — Kzera

Este arquivo registra o estado real do projeto por versão. Atualizar sempre que uma versão for encerrada ou uma funcionalidade relevante for concluída.

## 1.13.2 — Lição aprendida: não criar atalho antes da entidade principal

- Decisão registrada: não criar "transação rápida" ou "saída rápida" antes de Transações Base existir.
- Alternativa operacional: usar fracionamento mínimo e aguardar o módulo oficial.
- Perfil não é obrigatório em transação, mas nome do cliente é obrigatório.
- Importação de Transações exige prévia corrigível, checagem de itens e resolução explícita de pendências.

## 1.14.1 — Financeiro Base

- Arquitetura financeira definida: ContaFinanceira, TransaçãoFinanceira, PagamentoTransação, MovimentoFinanceiro.
- Importação de transações não baixa estoque inicialmente.
- Cripto/carteiras ficam no backlog, mas a arquitetura deve permitir rastro do dinheiro.

## 1.15.1 — Importação de Transações em staging protegido

- Staging persistente implementado para transações e movimentações financeiras.
- CSV/TSV é processado em memória, separado em índice operacional e payload sensível, criptografado e só então persistido.
- O usuário pode resolver parte das pendências, fechar o app e continuar depois sem importar de novo.
- Dado sensível nunca toca armazenamento físico aberto, nem por milissegundos.

## 1.16.0 — Conciliação de transações com financeiro

- Conciliação em memória: transações cruzadas com registros financeiros.
- Statuses: conciliado, pendente_sem_financeiro, pendente_sem_transacao, divergencia_valor, divergencia_perfil, divergencia_pagamento, pagamento_posterior_provavel, revisao_manual.

## 1.17.2 — Resolução de pendências e aprovação em massa

- Ações: vincular_financeiro, vincular_financeiro_em_massa, desfazer_aprovacao_massa, marcar_revisao, ignorar.
- Aprovação em massa com baixo número de cliques.

## 1.19.26 — Importação funcional e polimento visual mobile

- Hub de navegação entre telas de importação (Perfis / Itens / Transações).
- Aviso de staging adicionado à tela de importação de transações.
- Polimento visual premium para telas de importação no iPhone.
- CSS otimizado: largura útil, sombra sutil, abas proporcionais, badges de status, tipografia correta.
