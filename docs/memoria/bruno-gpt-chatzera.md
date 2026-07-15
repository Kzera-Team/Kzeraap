# Bruno-GPT — memória local do Chatzera

Este arquivo guarda apenas continuidade técnica e handoffs relacionados ao Chatzera. Não substitui a memória canônica de Bruno no Kzeraap e não altera autorizações.

## 2026-07-15 — primeira reconstrução externa

- O líder reconstruiu uma instância de Bruno no ambiente GPT após o encerramento de uma sessão anterior.
- A instância leu a memória canônica antes de atuar.
- O ambiente GPT possui conector GitHub, mas não equivale a terminal ou sessão de desenvolvimento.

## 2026-07-15 — auditoria de credenciais por instância

Branch auditado: `agents/agent_chatgpt/agent-instance-credentials`.
Base: `dev_claude`.

Resultado:

- branch três commits à frente;
- diff contendo somente dois documentos de arquitetura e especificação;
- sem migration, model, serviço, endpoints ou testes da funcionalidade;
- nenhuma implementação localizada no branch auditado.

Conclusão: a arquitetura está documentada, mas a implementação não estava presente na evidência examinada.

## Estado observado em `dev_claude`

- A Action única existe em `/actions/invoke`, com catálogo em `/actions/catalog` e manifesto em `/actions/openapi.json`.
- O dispatcher deriva de allow-list e reutiliza handlers reais.
- O gateway permite leitura e escrita autorizada, mas bloqueia merge.
- A autenticação vigente identifica o agente e carrega escopos; ainda não registra identidade específica da execução.

## Mínimo para Bruno trabalhar pela API

1. identidade própria estável para Bruno-GPT;
2. autenticação individual da execução e consulta da própria identidade;
3. prompt de sistema persistido e carregamento da memória canônica;
4. mailbox própria e tasks limitadas ao agente;
5. leitura de arquivos, árvores, branches, comparações, PRs, comentários e checks;
6. escrita somente em branch autorizado, com proteção contra sobrescrita concorrente;
7. criação de PR autorizada, sem permissão de merge;
8. acesso a logs de CI e deploy por ferramenta específica;
9. contexto obrigatório de projeto, branch e objetivo em tarefas técnicas;
10. rastreabilidade das ações por agente e por execução;
11. resposta operacional em `FINAL`, `PARCIAL` ou `BLOQUEADA` com evidência real.

## Lacunas confirmadas

- não foi confirmado cadastro específico de Bruno-GPT;
- não existe perfil explícito de Bruno no contexto de projetos auditado;
- o prompt padrão seria genérico;
- a allow-list atual não cobre todos os recursos de infraestrutura, como Railway, Netlify e logs completos de execução;
- a autenticação individual por execução ainda depende de implementação.

## Retomada

Toda nova instância Bruno-GPT no Chatzera deve:

1. ler a memória canônica;
2. ler este arquivo;
3. verificar o branch vigente;
4. consultar as ferramentas realmente disponíveis;
5. não afirmar execução sem evidência;
6. acrescentar novos achados específicos do Chatzera sem apagar registros anteriores.
