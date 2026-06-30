# Regras de Negócio — Financeiro e Importação de Transações

## 1. Objetivo

Este documento define as regras de negócio obrigatórias para o módulo financeiro quando houver importação de transações históricas.

A importação de transações não é apenas um carregamento de dados. Quando confirmada, ela pode gerar registros oficiais no financeiro, alimentar histórico de vendas/transações, criar pagamentos, criar movimentos financeiros e impactar relatórios.

Nenhum dado importado deve virar financeiro oficial sem passar por validação, conciliação, prévia, aprovação e confirmação segura.

---

## 2. Separação entre importação e financeiro oficial

### 2.1. Importação não é confirmação

Ao importar um arquivo, colagem ou qualquer origem externa, os dados entram primeiro em área temporária de staging.

A importação inicial deve apenas:

- ler os dados;
- normalizar campos;
- detectar erros;
- detectar duplicidades;
- identificar pendências;
- sugerir vínculos;
- preparar conciliação;
- permitir revisão.

A importação inicial não deve:

- criar transação oficial;
- criar pagamento oficial;
- criar movimento financeiro oficial;
- alterar saldo;
- alimentar relatório oficial como dado confirmado;
- baixar estoque;
- alterar lote de item/produto.

### 2.2. Dado importado só vira oficial após confirmação

Uma transação importada só pode virar dado oficial quando estiver em estado aprovado para confirmação.

Estados técnicos como `validado`, `lido`, `normalizado` ou `sem_erro_de_parser` não são suficientes para oficializar o registro.

Regra obrigatória:

- `validado` significa apenas que o dado passou na validação técnica.
- `aprovado_para_confirmacao` significa que o dado foi autorizado para virar oficial.
- Somente `aprovado_para_confirmacao` pode ser confirmado no financeiro.

---

## 3. Tipos de registros financeiros envolvidos

A confirmação de uma transação histórica pode gerar até três tipos de artefatos oficiais:

1. Transação financeira/venda histórica.
2. Pagamento vinculado à transação.
3. Movimento financeiro vinculado ao pagamento e/ou transação.

Esses registros devem nascer com vínculo rastreável entre si.

Quando houver pagamento criado, o pagamento deve conhecer o movimento financeiro correspondente, e o movimento financeiro deve conhecer o pagamento correspondente.

Não é permitido vínculo unilateral incompleto quando os dois registros existirem.

---

## 4. Regra de impacto financeiro

### 4.1. Receita

A receita da transação deve representar o valor bruto ou líquido definido pela regra do sistema para aquela operação.

A documentação da transação precisa deixar claro se o campo usado representa:

- valor total da venda;
- valor recebido;
- valor previsto;
- valor líquido após desconto;
- valor pendente;
- valor parcialmente pago.

Na ausência dessa clareza, a transação deve entrar como pendente de revisão.

### 4.2. Custo

O custo vinculado à transação histórica só deve ser confirmado quando a origem tiver dado suficiente para calcular ou vincular o custo com segurança.

Se o custo não puder ser determinado, a transação pode ser confirmada com custo ausente somente se a regra do sistema permitir esse estado explicitamente.

Nesse caso, o relatório deve indicar custo pendente ou lucro não confiável.

### 4.3. Lucro

O lucro estimado só pode ser tratado como lucro oficial quando receita e custo estiverem confirmados pelas regras do sistema.

Se o custo estiver ausente, estimado ou pendente, o lucro não deve aparecer como lucro consolidado.

Deve aparecer como:

- lucro estimado;
- lucro pendente de custo;
- margem incompleta;
- ou outro rótulo humano equivalente.

### 4.4. Pago e pendente

Toda transação confirmada deve indicar claramente:

- valor total;
- valor pago;
- valor pendente;
- método de pagamento, quando houver;
- data de pagamento, quando houver;
- referência externa, quando houver.

Se houver divergência entre valor da transação e valor financeiro vinculado, o registro deve ser bloqueado ou marcado para revisão manual.

---

## 5. Conciliação financeira

### 5.1. Vínculo automático

O sistema pode sugerir vínculo automático entre transação importada e financeiro importado quando houver confiança suficiente.

A confiança deve considerar, no mínimo:

- valor;
- data;
- perfil/cliente;
- método de pagamento;
- referência externa;
- origem;
- proximidade temporal;
- ausência de conflito com outro registro.

### 5.2. Aprovação em massa segura

A aprovação em massa só pode aprovar registros considerados seguros.

Um vínculo é seguro quando:

- existe correspondência forte de valor;
- não existe duplicidade;
- não existe outro financeiro concorrente;
- não existe divergência relevante de data;
- não existe conflito de perfil;
- não existe pendência de método;
- não existe alteração posterior ao momento da prévia.

A aprovação em massa deve gerar estado explícito de aprovação.

Não pode apenas trocar um status técnico genérico.

### 5.3. Revisão manual

Quando o sistema não conseguir garantir vínculo seguro, o registro deve ir para revisão manual.

Exemplos de casos que exigem revisão:

- financeiro ausente;
- valor divergente;
- pagamento posterior provável;
- mais de um financeiro possível;
- cliente/perfil não encontrado;
- item não mapeado;
- método de pagamento incerto;
- referência externa conflitante;
- duplicidade possível.

A UI deve traduzir status técnicos em linguagem humana.

Exemplos:

- `pendente_sem_financeiro` → “Falta financeiro”.
- `divergencia_valor` → “Valor diferente”.
- `pagamento_posterior_provavel` → “Possível pagamento depois”.
- `duplicado` → “Pode estar duplicado”.
- `staging_alterado` → “A revisão mudou, gere nova prévia”.

---

## 6. Prévia obrigatória antes da confirmação

Antes de qualquer confirmação definitiva, o sistema deve gerar uma prévia operacional.

A prévia deve mostrar, no mínimo:

- quantidade de transações que serão criadas;
- quantidade de pagamentos que serão criados;
- quantidade de movimentos financeiros que serão criados;
- quantidade de registros bloqueados;
- quantidade de registros pendentes;
- faturamento previsto;
- custo previsto;
- lucro previsto ou estimado;
- valor pago;
- valor pendente;
- período coberto;
- aviso claro de que não haverá baixa de estoque.

A mensagem principal deve ser simples:

“Pronto para confirmar X vendas históricas. Isso não mexe no estoque.”

Detalhes técnicos devem ficar recolhidos ou em área avançada.

---

## 7. Pacote de confirmação histórica

### 7.1. Pacote congelado

A prévia deve gerar um pacote congelado de confirmação histórica.

Esse pacote deve conter:

- ID do pacote;
- data/hora de criação;
- origem da importação;
- período coberto;
- IDs dos registros de staging incluídos;
- snapshot protegido das transações;
- snapshot protegido dos financeiros;
- totais financeiros protegidos;
- lista de bloqueios;
- lista de pendências;
- assinaturas normalizadas;
- hash/checksum do pacote;
- estado do pacote.

Estados possíveis:

- `congelado`;
- `confirmando`;
- `confirmado`;
- `falha_confirmacao`;
- `desfazendo`;
- `desfeito`;
- `desfeito_parcial`;
- `cancelado`.

### 7.2. Confirmação usa pacote, não plano recalculado

Depois que um pacote for congelado, a confirmação deve usar exclusivamente o conteúdo do pacote.

Não é permitido recalcular o plano no momento de confirmar e exibir números diferentes da prévia.

Se houver qualquer alteração no staging depois da prévia, a confirmação deve ser bloqueada e o sistema deve pedir nova prévia.

---

## 8. Revalidação obrigatória antes de confirmar

Antes de confirmar um pacote congelado, o sistema deve reconsultar o estado atual dos registros envolvidos.

A confirmação deve ser bloqueada se qualquer registro tiver sido:

- alterado;
- ignorado;
- confirmado por outro fluxo;
- vinculado a outro financeiro;
- desvinculado;
- marcado como pendente;
- marcado para revisão;
- removido;
- substituído.

A revalidação deve conferir:

- status atual da transação em staging;
- status atual do financeiro em staging;
- vínculo financeiro atual;
- movimento financeiro já criado;
- lote de confirmação;
- pendências;
- resolução de conciliação;
- assinatura do payload;
- assinatura normalizada da transação.

Mensagem obrigatória para o usuário:

“A revisão mudou depois da prévia. Para sua segurança, gere uma nova prévia antes de confirmar.”

---

## 9. Duplicidade

### 9.1. Chave de origem obrigatória

Toda transação histórica confirmada deve ter uma chave de origem de importação.

Essa chave deve considerar:

- origem;
- lote;
- linha;
- número original, quando existir;
- data;
- valor;
- perfil/cliente normalizado;
- item/descrição normalizada;
- hash do payload protegido.

Registros sem número original não podem depender apenas de campo vazio ou ausente.

### 9.2. Duplicidade dentro do lote

Antes da confirmação, o sistema deve detectar duplicidade dentro do próprio lote importado.

Se duas linhas do mesmo lote representarem a mesma transação, uma delas deve ser bloqueada ou agrupada para revisão.

### 9.3. Duplicidade contra dados oficiais

Antes da confirmação, o sistema deve comparar os registros importados com os dados oficiais já existentes.

Se uma transação oficial antiga não tiver assinatura de importação, o sistema deve derivar uma assinatura normalizada a partir dos dados oficiais existentes.

Não é permitido confiar somente em `assinaturaImportacao`.

### 9.4. Efeito da duplicidade

Duplicidade nunca deve inflar:

- faturamento;
- custo;
- lucro;
- valor pago;
- valor pendente;
- quantidade de vendas;
- relatórios.

Registro duplicado deve ser bloqueado ou enviado para revisão manual.

---

## 10. Criação segura dos artefatos oficiais

### 10.1. Confirmação em etapas

A confirmação deve seguir protocolo seguro:

1. Validar pacote congelado.
2. Revalidar staging atual.
3. Reservar IDs dos artefatos oficiais.
4. Registrar plano de artefatos previstos.
5. Marcar pacote como `confirmando`.
6. Criar transações oficiais.
7. Criar pagamentos oficiais.
8. Criar movimentos financeiros oficiais.
9. Marcar artefatos como criados.
10. Conferir vínculos bilaterais.
11. Marcar staging como confirmado.
12. Marcar pacote como `confirmado`.
13. Gerar resultado final a partir do pacote confirmado.

### 10.2. IDs reservados antes de salvar

Antes de criar qualquer transação, pagamento ou movimento oficial, o sistema deve pré-gerar os IDs e gravar no pacote quais artefatos serão criados.

Se o app cair durante a confirmação, a recuperação deve saber exatamente o que já era esperado.

### 10.3. Idempotência

A confirmação deve ser idempotente.

Se o sistema tentar continuar uma confirmação interrompida:

- se o artefato já existe, não deve criar duplicado;
- se o artefato não existe, deve criar usando o ID reservado;
- se o artefato existe mas está divergente, deve bloquear e abrir recuperação guiada;
- se o pacote já foi confirmado, não deve confirmar novamente.

---

## 11. Recuperação de falha

### 11.1. Detecção automática

Ao abrir a tela de importação/financeiro, o sistema deve verificar se existe pacote em estado:

- `confirmando`;
- `falha_confirmacao`;
- `desfazendo`;
- `desfeito_parcial`.

Se existir, a tela deve priorizar a recuperação antes de permitir nova importação ou nova confirmação.

### 11.2. Linguagem da recuperação

A recuperação não deve assustar a usuária.

Fluxo recomendado:

1. “Encontramos uma confirmação interrompida.”
2. “Nada será confirmado duas vezes.”
3. “Vamos verificar o que foi criado e o que falta.”
4. Botão: “Ver o que aconteceu”.
5. Depois da revisão: “Limpar restos e abrir revisão” ou “Continuar confirmação segura”.

### 11.3. Recuperação não pode ser invisível

Pacotes interrompidos não podem ficar escondidos em detalhes técnicos.

Devem aparecer no topo como continuação obrigatória.

---

## 12. Desfazer lote confirmado

### 12.1. Desfazer é área avançada

Desfazer lote confirmado é ação sensível e deve ficar em área de correção avançada.

Não deve ficar ao lado do fluxo principal de importação.

### 12.2. Validação antes de desfazer

Antes de desfazer um lote, o sistema deve verificar se os artefatos criados continuam intactos.

O desfazer automático deve ser bloqueado se houver:

- edição posterior;
- vínculo novo;
- pagamento alterado;
- movimento conciliado manualmente;
- dependência criada em relatório/ajuste;
- artefato ausente;
- artefato divergente.

Nesse caso, o sistema deve abrir revisão guiada, não apagar automaticamente.

### 12.3. Desfazer em etapas

O desfazer deve:

1. Registrar intenção de desfazer.
2. Marcar pacote como `desfazendo`.
3. Validar integridade dos artefatos.
4. Remover ou reverter artefatos com segurança.
5. Restaurar staging, quando aplicável.
6. Marcar pacote como `desfeito`.
7. Se falhar, marcar como `desfeito_parcial`.

Nunca deve apagar primeiro e só depois registrar estado.

---

## 13. Estoque e lote

Importação de transações históricas financeiras não baixa estoque.

Mesmo quando uma transação histórica for confirmada como venda, ela não deve:

- reduzir estoque atual;
- alterar lote atual;
- alterar quantidade disponível;
- alterar custo de lote atual;
- modificar inventário.

A razão é que histórico importado representa evento passado.

Se no futuro houver necessidade de reconstrução histórica de estoque, isso deve ser um módulo separado, com regras próprias, prévia própria e confirmação própria.

Mensagem obrigatória em prévia e confirmação:

“Essa confirmação cria histórico financeiro. Não mexe no estoque.”

---

## 14. Relatórios financeiros

### 14.1. Somente dados oficiais confirmados

Relatórios financeiros oficiais devem usar apenas dados confirmados.

Dados em staging podem aparecer em relatórios de importação, mas não em relatório financeiro oficial.

Separação obrigatória:

- Financeiro oficial: dados confirmados.
- Importação em andamento: staging, pendências e prévias.
- Estimativas: valores ainda não consolidados.

### 14.2. Status dos valores

Relatório deve distinguir:

- faturamento confirmado;
- faturamento previsto;
- custo confirmado;
- custo pendente;
- lucro confirmado;
- lucro estimado;
- valor pago;
- valor pendente;
- movimentos avulsos;
- movimentos vinculados a transações.

### 14.3. Movimentos avulsos

Quando houver filtro por histórico de transações, o resumo financeiro não deve misturar movimentos avulsos como se fossem parte das transações filtradas.

Movimentos avulsos devem aparecer em card separado ou seção separada.

### 14.4. Método de pagamento

Filtro por método de pagamento deve usar dado normalizado.

Não deve depender apenas de busca textual em observação ou referência externa.

O método normalizado deve estar disponível no pagamento, no movimento ou em estrutura indexável equivalente.

---

## 15. Performance e escala

### 15.1. Proibição de lista inteira para financeiro crítico

Fluxos financeiros críticos não devem depender de carregar tudo em memória e filtrar depois.

Devem existir consultas por:

- período;
- status;
- origem;
- tipo;
- perfil;
- método de pagamento;
- lote;
- transação;
- pendência.

### 15.2. Paginação

Listagens financeiras e de importação devem suportar paginação ou carregamento progressivo.

A UI pode mostrar resumo, mas o repositório não deve carregar base inteira sem necessidade.

### 15.3. Antes de relatórios

Antes de avançar para relatórios financeiros completos, o sistema deve ter contratos de consulta paginada/indexada.

Não se deve criar dashboard financeiro bonito em cima de `getAll()` ou equivalente.

---

## 16. Segurança e dados protegidos

### 16.1. Totais financeiros sensíveis

Resumo financeiro de pacote, snapshots e dados importados sensíveis devem ficar protegidos.

O registro aberto deve manter apenas metadados operacionais mínimos.

### 16.2. Memória

Ao bloquear sessão, sair, limpar autenticação ou trocar de contexto seguro, a view deve liberar dados sensíveis mantidos em memória.

Devem ser limpos:

- prévia de confirmação;
- última confirmação;
- conciliação;
- mensagens sensíveis;
- listas descriptografadas;
- snapshots temporários;
- payloads de backup descriptografados.

### 16.3. Backup

Backup não deve montar grandes volumes descriptografados em memória sem escopo liberável.

Ao terminar ou falhar, deve limpar objetos sensíveis imediatamente.

---

## 17. UX obrigatória para financeiro/importação

### 17.1. Linguagem humana

A tela principal deve evitar termos técnicos.

Usar frases curtas:

- “Falta financeiro”.
- “Valor diferente”.
- “Pode estar duplicado”.
- “Pronto para confirmar”.
- “Não mexe no estoque”.
- “Revisão mudou, gere nova prévia”.
- “Confirmação interrompida encontrada”.

### 17.2. Parede de números

A tela não deve mostrar todos os números financeiros cedo demais.

Primeiro mostrar:

“Pronto para confirmar X vendas históricas. Isso não mexe no estoque.”

Depois, se a usuária quiser, abrir detalhes:

- faturamento;
- custo;
- lucro;
- pago;
- pendente;
- bloqueados;
- período.

### 17.3. Bloqueios agrupados

Bloqueios devem ser agrupados por causa.

Exemplo:

- 12 sem financeiro;
- 5 com valor diferente;
- 3 duplicados;
- 2 com revisão alterada.

Cada grupo deve ter ação sugerida.

### 17.4. Estados guiados

A tela deve ser organizada por estados:

1. Você tem uma importação em andamento.
2. Resolver pendências.
3. Confirmar histórico seguro.
4. Recuperar interrupção.
5. Ver detalhes avançados.

A usuária não deve enfrentar importação, conciliação, confirmação, falhas, desfazer e detalhes técnicos todos misturados ao mesmo tempo.

---

## 18. Testes obrigatórios

O financeiro da importação só pode ser considerado pronto quando houver testes comportamentais simulando:

- 500 registros importados;
- 300 registros confirmáveis;
- duplicidade dentro do lote;
- duplicidade contra oficial antigo sem assinatura;
- financeiro confirmado por outro fluxo entre prévia e confirmação;
- alteração de staging depois da prévia;
- crash após transação criada e antes de registrar no pacote;
- crash em estado `confirmando`;
- recuperação após reload;
- desfazer interrompido;
- desfazer com artefato alterado depois;
- filtro por método de pagamento;
- resumo por período sem misturar movimento avulso;
- confirmação sem baixa de estoque.

Teste estrutural que apenas procura strings no código não comprova segurança financeira.

---

## 19. Critério de aprovação

A documentação financeira só estará atendida quando estiver claro:

- o que é importação;
- o que é staging;
- o que é dado oficial;
- quando gera transação;
- quando gera pagamento;
- quando gera movimento;
- quando calcula receita;
- quando calcula custo;
- quando calcula lucro;
- quando valor é estimado;
- quando valor é confirmado;
- quando bloqueia;
- quando exige revisão;
- como evita duplicidade;
- como recupera falha;
- como desfaz com segurança;
- como não baixa estoque;
- como alimenta relatórios;
- como escala sem carregar tudo.

Sem essas regras, a importação pode até funcionar visualmente, mas o financeiro não deve ser considerado completo.
