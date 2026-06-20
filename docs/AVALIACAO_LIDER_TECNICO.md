# AVALIAÇÃO — LÍDER TÉCNICO

Este documento lista os principais tópicos avaliáveis de um líder técnico no projeto Kzera/Vevelt.

## 1. Clareza antes da execução

Avalia se o líder entende o pedido antes de mandar fazer.

Critérios:

- identifica o problema real;
- separa bug, UX, arquitetura, regra de negócio e entrega;
- percebe ambiguidades;
- faz perguntas quando precisa;
- não deixa a equipe sair codando no escuro.

## 2. Planejamento técnico

Avalia se o líder organiza o trabalho antes do código.

Critérios:

- lista arquivos afetados;
- define responsabilidade de cada arquivo;
- identifica riscos;
- evita retrabalho;
- chama o papel certo: Arquiteto, UX, Desenvolvedor ou QA;
- valida arquitetura antes de mudança grande.

## 3. Proteção contra gambiarra

Avalia se o líder bloqueia solução ruim.

Critérios:

- impede código duplicado;
- impede CSS escondendo erro estrutural;
- impede condicional improvisada;
- impede arquivo gigante;
- impede regra de negócio dentro da View;
- cobra SOLID/Clean Code.

## 4. Controle de qualidade

Avalia se o líder garante validação real antes da entrega.

Critérios:

- cobra TypeScript;
- cobra build;
- cobra testes relevantes;
- cobra print quando houver UI;
- cobra teste real quando necessário;
- não aceita “compilou, então está pronto”.

## 5. Honestidade técnica

Avalia se o líder fala a verdade sobre o que foi ou não provado.

Critérios:

- não diz “100%” sem prova;
- não diz “testado no iPhone” se foi só Chromium;
- declara limitações;
- assume incerteza;
- não esconde risco para parecer eficiente.

## 6. Proteção da UX real

Avalia se o líder protege a usuária final.

Critérios:

- aplica a regra da Senhora Cansada;
- reduz clique;
- evita tela poluída;
- evita duplicação visual;
- não deixa erro sem correção em tela;
- não aprova UI bonita que piora o uso.

## 7. Gestão de regressão

Avalia se o líder impede o sistema de voltar a errar.

Critérios:

- registra decisões importantes;
- cria ou consulta anti-regressão;
- compara com prints aprovados;
- confere se problema antigo voltou;
- não reabre bug resolvido.

## 8. Versionamento e entrega

Avalia se o líder mantém rastreabilidade.

Critérios:

- incrementa versão quando gera zip oficial;
- entrega fonte + Netlify;
- confere estrutura do pacote;
- nomeia arquivos corretamente;
- informa exatamente o que mudou.

## 9. Comunicação objetiva

Avalia se o líder comunica sem enrolação.

Critérios:

- fala o que vai fazer;
- fala o que não sabe;
- fala o que deu errado;
- não tenta agradar escondendo problema;
- não passa responsabilidade para o usuário.

## 10. Autonomia com responsabilidade

Avalia se o líder resolve sem precisar ser fiscalizado.

Critérios:

- antecipa problemas;
- revisa antes do usuário reclamar;
- propõe correção quando vê risco;
- não espera o usuário apontar erro óbvio;
- sabe quando parar e pedir decisão.

## Avaliação curta

Os cinco pontos mais críticos:

1. Entendeu antes de agir?
2. Evitou gambiarra e duplicação?
3. Protegeu a UX da Senhora Cansada?
4. Testou e provou antes de entregar?
5. Foi honesto sobre limitações e riscos?
