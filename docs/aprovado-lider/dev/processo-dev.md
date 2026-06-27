# Processo Dev

Processo obrigatório para qualquer alteração de código, documentação técnica, workflow, checklist ou bloqueio.

## 1. Antes de codar

### 1.1 Classificar o pedido

Classifique o pedido antes de agir:

- análise;
- apontamento;
- implementação;
- refatoração;
- hotfix;
- visual/mockup;
- processo/documentação.

Regras:

- análise não altera arquivo;
- apontamento não altera arquivo;
- implementação altera somente o escopo autorizado;
- refatoração não muda comportamento;
- visual não muda regra;
- processo/documentação não deve ser misturado com código de produto sem justificativa;
- se houver dúvida sobre autorização, bloquear e confirmar.


### 1.2 Definition of Ready

A tarefa só pode começar se estiver claro:

- problema real;
- objetivo;
- tipo de alteração;
- escopo;
- critério de aceite;
- comportamento que não pode mudar;
- mockup aprovado, se for visual;
- arquivos/camadas sensíveis envolvidos;
- evidência esperada;
- critério de bloqueio.

Sem isso, a tarefa não está pronta.

### 1.3 Contrato de escopo

Antes de codar, declarar:

- o que será alterado;
- o que não será alterado;
- arquivos/pastas previstos;
- arquivos/camadas proibidos;
- regras, storage, cripto, validação, importação/exportação, autenticação, schema, workflows e documentos aprovados que não podem ser tocados;
- comportamento que não pode mudar;
- evidência final esperada;
- escopo da garantia.

### 1.4 Plano técnico curto

Antes da implementação, registrar:

- problema;
- comportamento atual;
- arquivos previstos;
- responsabilidade de cada arquivo;
- reutilização encontrada;
- o que é proibido tocar;
- critério de bloqueio;
- evidência final.

Nenhum código começa sem plano técnico registrado ou aprovado.

## 2. Durante a implementação

### 2.1 Não tocar por proximidade

Se encontrar problema fora do escopo:

- registrar como achado;
- informar impacto;
- não corrigir junto;
- pedir autorização se quiser incluir;
- sugerir tarefa separada quando necessário.

Não transformar uma tarefa em várias sem declarar escopo misto e obter aprovação.

### 2.2 Escopo misto

Alteração visual, refatoração, bugfix, mudança de mockup, processo/documentação e feature devem ser separadas ou justificadas.

Se misturar escopos:

- declarar no PR;
- explicar motivo;
- informar risco;
- informar autorização.

### 2.3 PR pequeno

Preferir PR pequeno, com uma intenção clara.

PR grande enfraquece checklist.
Se o PR crescer, dividir ou justificar.


### 2.4 Novo controle só por risco real

Se durante a tarefa surgir proposta de nova trava, checklist, workflow ou automação:

- não implementar automaticamente;
- consultar `controles-futuros.md`;
- verificar se regra existente já cobre;
- adicionar agora somente se houver erro real, risco alto ou pedido explícito do líder;
- se não for essencial agora, registrar como controle futuro.

A intenção é preservar qualidade sem transformar processo em burocracia.

## 3. Antes de entregar

### 3.1 Definition of Done

A entrega só pode fechar se tiver:

- checklist aplicado antes e depois;
- evidência preenchida;
- escopo da entrega declarado;
- escopo da garantia declarado;
- o que alterou declarado;
- o que não alterou declarado;
- reutilização comprovada;
- responsabilidade correta comprovada;
- ausência de duplicação revisada;
- riscos e exceções declarados;
- achados fora do escopo registrados;
- validação feita e limite do que não foi validado.

### 3.2 Evidência versus prova

Classifique a validação entregue:

- evidência manual: print, descrição, checklist preenchido, declaração;
- revisão estática: leitura/inspeção de código sem executar;
- prova automatizada: teste, check, comparação visual, build, lint, contrato executado;
- validação runtime: app rodando em navegador/PWA.

Regra:

- não chamar evidência manual de prova automatizada;
- não chamar revisão estática de validação runtime;
- não declarar garantia maior do que a validação feita.

### 3.3 Entrega reversível

Quando houver risco em dados, storage, autenticação, segurança, importação/exportação, workflow, processo ou produção, declarar:

- como desfazer;
- quais arquivos reverter;
- se há risco para dados existentes;
- se há fallback;
- se há migração;
- se o usuário pode perder algo.

### 3.4 Auditoria final

Antes de entregar, responder:

- o que prometi fazer?
- o que realmente fiz?
- o que ficou fora?
- que risco restou?
- qual garantia posso dar?
- qual garantia não posso dar?
- existe algo incômodo ou prejudicial que precisa ser declarado?
- estou afirmando algo além do que validei?

### 3.5 Modo consolidação total

Em análise, revisão, risco, decisão, entrega ou opinião técnica:

- fazer varredura completa antes de responder;
- separar fatos, riscos, limites, pendências e recomendações;
- trazer tudo relevante de uma vez;
- não suavizar falha;
- não esperar alguém perguntar “mais alguma coisa?”;
- se lembrar algo depois, declarar falha de consolidação anterior.


## Impedimentos

Impedimento não deve ser escondido nem tratado como falha automática.

Quando houver impedimento:

- classificar como não bloqueante, bloqueante aceito por exceção ou pendente para tarefa separada;
- declarar impacto;
- limitar a garantia;
- declarar o que não foi validado;
- registrar decisão e responsável;
- definir ação posterior ou prazo.

A entrega só pode seguir com impedimento bloqueante se houver aprovação do líder/dono.
