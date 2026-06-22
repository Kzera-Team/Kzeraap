# Leitura obrigatória antes de alterar código

Este arquivo deve ser lido antes de qualquer alteração de código, mesmo pequena.

## Trava de execução

Não começar a codar sem responder mentalmente:

1. Qual Pendência já decidida estou resolvendo?
2. Isso é realmente Pendência ou é Backlog?
3. Essa mudança mexe em regra anterior?
4. Qual papel sustenta a decisão principal?
5. O fluxo passa no teste da Usuária?
6. Existe risco de botão ambíguo, ícone sozinho em ação não óbvia, área morta, resumo redundante ou clique desnecessário?
7. Existe dado crítico que precisa salvar imediatamente?
8. Existe interrupção possível: Safari fecha, iPhone bloqueia, bateria acaba, app recarrega?
9. O usuário consegue corrigir erro humano sem refazer tudo?
10. Essa mudança cria atalho antes da entidade principal existir?

## Papéis obrigatórios para decisão

- Direção de Produto: prioridade, impacto no uso real e sequência de entrega.
- UX Operacional: clareza, redução de cliques, experiência mobile e teste da Usuária.
- Arquitetura: modularidade, manutenção, separação de camadas e evitar duas verdades.
- Modelagem de Dados: onde cada informação mora e como o estoque real é representado.
- Segurança: autenticação, criptografia, persistência, backup e riscos reais.
- Desenvolvimento: implementação limpa, legível e coerente com o código existente.
- Qualidade: testes, regressões e validação de fluxo real.
- Entrega: versão, build, deploy e integridade dos pacotes.

## Guardas específicos

- Não criar estoque como campo simples principal do Item.
- Não colocar Lote inteiro dentro da Variação como rolagem confusa.
- Não criar tela de cadastro misturada com listagem quando já foi decidido tela própria.
- Não implementar transação usando estoque simplificado. Transação deve nascer como módulo oficial, com entidade de transação, item da transação, cliente informado e baixa rastreável.
- Não criar “transação rápida” ou “saída rápida” como caminho paralelo antes do módulo de Transações existir.
- Não criar "transação rápida" como atalho antes da entidade principal existir.
- Não importar transação de CSV sem prévia corrigível, mapeamento de itens e tratamento claro para produto inexistente no app.
- Não usar botão “+1” ou “-1” sem unidade; usar `+1 mg`, `-10 mg`, etc. Ícone é permitido, mas ação crítica/rara/ambígua deve ter texto ou ícone + texto.
- Não salvar sessão de pesagem só no final; cada peso precisa persistir imediatamente.
- Não inventar causa de divergência; mostrar diferença e permitir classificação.
- Não chamar Retirada Interna de transação ou perda.
- Não repetir contador em bloco de “Resumo” se a tela já mostra a mesma informação.
- Não declarar pronto se só passou em teste de presença.


## Lições aprendidas obrigatórias

Antes de alterar código, ler também:

- `docs/governanca/07_LICOES_RESUMO_RAPIDO.md` para lembrar os erros que não podem se repetir.
- `docs/governanca/05_LICOES_APRENDIDAS.md` quando a alteração tocar UX, estoque, lote, pesagem, dashboard, regra de negócio ou prontidão de entrega.

Pergunta de bloqueio:

> Isso passou só no build ou passou na vida real da Usuária?

## Sequência atual recomendada

1. Lote Operacional Base.
2. Fracionamento real.
3. Pesagem rápida persistente.
4. Balanças e calibragem.
5. Conferência consolidada.
6. Retirada Interna.
7. Transações Base é a próxima funcionalidade relevante autorizada, respeitando estoque real e sem atalhos paralelos.


## 1.13.3 — Pré-transações

- Senha forte fica para o final, não para a fase de teste.
- Divergência entre pesagem e unidades fracionadas deve aparecer para a usuária.
- Antes de Transações, preservar conforto de uso noturno: menos brilho, menos estímulo visual e menos adivinhação.


## 1.14.1 — Financeiro Base

Antes de importar transações, lembrar: financeiro não é texto solto de pagamento. Usar ContaFinanceira, TransaçãoFinanceira, PagamentoTransação e MovimentoFinanceiro. Importação de transações não baixa estoque inicialmente. Cripto/carteiras ficam no backlog, mas a arquitetura deve permitir rastro do dinheiro.

## Segurança de documentação e dados

Antes de criar documento, teste ou exemplo, confirme: isso é regra genérica ou dado real? Regra genérica pode ficar legível. Dado real, cliente real, valor real, carteira real, conta real, backup, token, senha ou chave nunca deve ser versionado como documentação.

## Importação de Transações e Financeiro

Antes de mexer em importação, lembre: CSV real é dado sensível; importação entra em staging persistente; cliente inexistente vira pendência; item inexistente vira pendência; movimentação financeira pode referenciar transação por `#número`; nada baixa estoque nesta etapa.


## 1.15.1 — Staging protegido antes da persistência

Dado sensível importado nunca deve ser gravado em banco físico aberto, nem por milissegundos. CSV/TSV de transações e financeiro deve ser lido em memória, separado em índice operacional e payload sensível, criptografado e só então persistido. Pendências que contenham nomes, itens, valores, custos, lucros, pagamentos ou observações também ficam no payload protegido.


## Trava absoluta de dados sensíveis

Dado sensível nunca deve ser gravado em armazenamento físico/persistente aberto, nem provisoriamente por milissegundos. Importação, staging, cache, backup, exportação e mensagens de erro precisam proteger o payload antes do primeiro write.

Revisar sempre como criminoso curioso, hacker ou invasor: se ele abrir armazenamento, backup ou cache, o que consegue ver?
- Backlog final: quando o projeto estiver completo, varrer tudo para manter apenas Perfil, Item e Transação como vocabulário oficial. Não gastar essa etapa agora.

## Vocabulário operacional protegido

Rótulo operacional sensível não nasce hardcoded. Ele deve ser configurado após senha mestra, protegido antes de persistir, carregado só em memória autenticada e limpo no bloqueio/logout.

