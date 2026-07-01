# Auxiliar 02 — Arquitetura da Importação

Use quando houver código, refatoração, persistência, camada, repository, adapter ou regra de importação.

## Regra central

Importação não pode ficar presa à UI.

## Local correto das responsabilidades

### `presentation`

Pode conter:

- tela;
- eventos visuais;
- exibição da prévia;
- mensagens;
- estados de tela;
- chamada para use case.

Não pode conter:

- regra final de importação;
- parse complexo;
- acesso direto a IndexedDB/API/storage;
- regra de negócio;
- decisão de persistência.

### `application`

Pode conter:

- use cases de importação;
- orquestração;
- aplicação de regras;
- chamada a repositories por interface;
- retorno de DTOs para tela.

### `domain`

Pode conter:

- validações puras;
- regras de normalização;
- value objects;
- decisões de negócio sem IO.

### `infrastructure`

Pode conter:

- adapter de arquivo;
- parser técnico;
- IndexedDB;
- implementação de repository;
- mapeadores técnicos;
- persistência.

## Bloqueios arquiteturais

Bloquear se:

- UI acessa IndexedDB/API/storage direto;
- componente decide regra de importação;
- use case importa adapter concreto sem justificativa;
- regra fica escondida em `utils/helpers`;
- arquivo central acumula estado, renderização, handler e regra;
- importação cria caminho que impede troca futura de adapter.

## Arquivo central/grande

Tratar como central/grande se tiver:

- mais de 400 linhas; ou
- 3 ou mais responsabilidades; ou
- estado, evento, renderização e regra no mesmo arquivo; ou
- virar ponto recorrente de acúmulo.

Se mexer em arquivo central/grande, justificar por que não extraiu.
