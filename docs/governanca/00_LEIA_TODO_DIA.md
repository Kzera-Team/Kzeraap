# Leitura diária obrigatória — Equipe Kzera

Este arquivo deve ser lido no começo de cada dia de trabalho antes de analisar demanda, alterar código ou responder sobre prioridade.

## Estado oficial

- Versão atual deste pacote: 1.13.2.
- Versão anterior auditada: 1.9.50.
- Nome público do app: app público.
- Nome interno no código: Kzera/kzera.
- Próxima prioridade: estabilizar Estoque, Lotes, Fracionamento, Pesagem rápida, Balanças, Conferência e Retirada Interna.
- Transações Base é a próxima funcionalidade relevante autorizada, mas só pode nascer respeitando o estoque real.
- Unidade interna de precisão: mg.
- Exibição e atalhos operacionais: g.
- Modelo oficial: Item → Variação → Lote → Fracionamentos / Pesagem / Conferência / Retirada Interna.

## Regra de essência

Antes de qualquer decisão, pense como a Usuária: uma pessoa extremamente cansada, estressada, usando iPhone de madrugada, com pressa, pouca paciência e baixa energia mental.

Pergunta obrigatória:

> Uma pessoa exausta conseguiria usar isso rápido e sem xingar o sistema?

Se a resposta for não, o fluxo está errado.

## Regras que não podem cair

1. O usuário é líder do produto, não fiscal de erro básico.
2. A equipe deve ser proativa e simular uso real antes de implementar.
3. Não devolver pergunta quando for possível propor a solução mais provável.
4. Separar Pendência de Backlog.
5. Não iniciar Transações antes de Estoque consistente.
6. Não dizer “feito” só porque o build passou.
7. Toda decisão relevante deve indicar papel responsável: Produto, UX, Arquitetura, Dados, Segurança, Desenvolvimento, Qualidade ou Entrega.
8. Fluxos críticos precisam salvar imediatamente e recuperar interrupção.
9. Ícone pode existir, mas ação ambígua nunca deve depender de ícone sozinho; botão ambíguo, área morta, resumo redundante e excesso de cliques são falhas operacionais.
10. Ler o resumo rápido de Lições Aprendidas antes de alterar código.
11. Quando uma regra anterior for alterada, avisar explicitamente: “Você está louca, querida — isso muda a regra anterior.” Depois explicar impacto e recomendação.

## Pendência x Backlog

- Pendência = já decidido e pendente de execução.
- Backlog = importante, mas deixado para depois ou dependente de decisão.

Transações é Backlog enquanto Estoque, Lotes, Fracionamento, Pesagem rápida, Balanças, Conferência e Retirada Interna não estiverem consistentes.

## Antes de encerrar qualquer entrega

Responder sempre:

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

## Transações — regra atual

- Perfil não é obrigatório em transação, mas nome do cliente é obrigatório.
- Transação avulsa pode existir, desde que tenha nome do cliente.
- Importação de Transações deve checar itens/produtos do CSV antes de confirmar.
- Produto citado na planilha e inexistente no app vira pendência de importação: mapear, criar com confirmação ou ignorar linha.


## 1.13.3 — Pré-transações

- Senha forte fica para o final, não para a fase de teste.
- Divergência entre pesagem e unidades fracionadas deve aparecer para a usuária.
- Antes de Transações, preservar conforto de uso noturno: menos brilho, menos estímulo visual e menos adivinhação.


## 1.14.1 — Financeiro Base

Antes de importar transações, lembrar: financeiro não é texto solto de pagamento. Usar ContaFinanceira, TransaçãoFinanceira, PagamentoTransação e MovimentoFinanceiro. Importação de transações não baixa estoque inicialmente. Cripto/carteiras ficam no backlog, mas a arquitetura deve permitir rastro do dinheiro.

## 1.14.1 — Documentação e dados sensíveis

Documentação de governança deve continuar legível para a equipe não perder essência. Dados reais, CSV de transações real, backups, contas, carteiras e segredos devem ser protegidos e nunca virar exemplo permanente em documentação.

## 1.15.0 — Staging de transações/financeiro

Importação não é confirmação definitiva. Primeiro salvar em staging, validar cliente/item/financeiro, permitir continuar depois e só então conciliar/confirmar. Se o app fechar, a Usuária não pode perder o que já resolveu.


## 1.15.1 — Staging protegido antes da persistência

Dado sensível importado nunca deve ser gravado em banco físico aberto, nem por milissegundos. CSV/TSV de transações e financeiro deve ser lido em memória, separado em índice operacional e payload sensível, criptografado e só então persistido. Pendências que contenham nomes, itens, valores, custos, lucros, pagamentos ou observações também ficam no payload protegido.


## Trava absoluta de dados sensíveis

Dado sensível nunca deve ser gravado em armazenamento físico/persistente aberto, nem provisoriamente por milissegundos. Importação, staging, cache, backup, exportação e mensagens de erro precisam proteger o payload antes do primeiro write.

Revisar sempre como criminoso curioso, hacker ou invasor: se ele abrir armazenamento, backup ou cache, o que consegue ver?
- Backlog final: quando o projeto estiver completo, varrer tudo para manter apenas Perfil, Item e Transação como vocabulário oficial. Não gastar essa etapa agora.

## Vocabulário operacional protegido

Rótulo operacional sensível não nasce hardcoded. Ele deve ser configurado após senha mestra, protegido antes de persistir, carregado só em memória autenticada e limpo no bloqueio/logout.

