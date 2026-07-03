# Governança e Exceções

Regras para proteger processo, documentos, decisões, exceções, evidências e registros.

## 1. Dono

O dono dos documentos de processo é o líder do projeto.
No contexto atual, o dono é o usuário solicitante.

Só o dono pode aprovar alteração em:

- documentos em `docs/aprovado-lider/dev`;
- template de PR;
- workflows;
- scripts de bloqueio;
- CODEOWNERS;
- mockups aprovados;
- thresholds de comparação;
- regras de exceção.

## 2. Proteção obrigatória

Para os bloqueios terem força real:

- CODEOWNERS deve apontar para usuário/time real do dono;
- Branch Protection deve exigir status checks obrigatórios;
- Branch Protection deve exigir review de Code Owners;
- workflows de checklist/evidência devem ser obrigatórios;
- scripts de validação e thresholds devem ser protegidos.

Sem Branch Protection, workflow existe, mas pode ser ignorado em merge direto.



## 3. Mudança de processo

Alterar checklist, workflow, script, threshold, mockup aprovado, PR template ou CODEOWNERS exige:

- aprovação do dono;
- justificativa;
- escopo da alteração;
- risco;
- efeito esperado;
- registro no histórico de decisão quando relevante.

## 4. Exceções

Exceção é temporária, formal e rastreável.
Não existe exceção informal.

Toda exceção deve registrar:

- motivo;
- responsável;
- aprovação do dono;
- prazo de revisão;
- risco assumido;
- plano para remover a exceção;
- escopo exato da exceção.

Bloquear se:

- não tem motivo;
- não tem aprovação;
- não tem prazo;
- não tem responsável;
- tenta substituir validação obrigatória sem justificativa;
- vira padrão recorrente.

Exceção visual não permite declarar 99% sem prova técnica.


## 5. Impedimentos de entrega

Impedimento declarado não trava automaticamente.
O que trava é impedimento sem classificação, sem impacto, sem responsável e sem decisão registrada.

Todo impedimento deve declarar:

- o que não foi possível validar ou executar;
- por que não foi possível;
- classificação: não bloqueante, bloqueante aceito por exceção ou pendente para tarefa separada;
- impacto na entrega;
- garantia limitada;
- o que não está garantido;
- decisão: bloquear, seguir com garantia limitada, seguir por exceção aprovada ou abrir tarefa separada;
- responsável pela decisão;
- ação posterior ou prazo.

A entrega pode seguir quando:

- o impedimento foi declarado;
- o impacto foi explicado;
- a garantia foi limitada;
- existe decisão explícita;
- impedimento bloqueante tem aprovação do dono/líder.

Bloquear se:

- o impedimento foi escondido;
- o impacto não foi explicado;
- o dev afirmou como validado algo que não validou;
- o impedimento afeta o objetivo principal e não tem aprovação do dono/líder;
- não há responsável ou ação posterior.

Regra de destrave no Git:

- impedimento sem decisão bloqueia;
- impedimento não bloqueante com impacto e garantia limitada pode seguir;
- impedimento bloqueante só segue por exceção aprovada;
- a exceção não pode enfraquecer regra permanente, checklist, workflow, threshold ou mockup aprovado.

## 6. Decisões técnicas e histórico

Registrar decisão quando houver:

- mudança arquitetural;
- mudança de processo;
- mudança de mockup aprovado;
- mudança de threshold;
- exceção relevante;
- alteração em arquivo sensível;
- regra nova de bloqueio;
- incidente que gerou aprendizado.

Registro mínimo:

- data;
- problema;
- decisão;
- motivo;
- alternativas rejeitadas;
- impacto;
- responsável/aprovador;
- quando revisar.

## 7. Pós-incidente

Usar quando houver erro relevante, retrabalho grande, quebra de processo, entrega ruim ou falha de confiança.

Registrar:

- o que aconteceu;
- causa raiz;
- impacto;
- regra que teria prevenido;
- ajuste no processo;
- responsável por validar;
- prazo de revisão.

## 8. Registros e transcrições

Quando for solicitado registro literal, transcrição ou cópia fiel:

- usar histórico bruto/exportado sempre que possível;
- não apresentar ata ou reconstrução como transcrição literal;
- marcar trecho parcial quando a literalidade não puder ser garantida;
- marcar trecho não disponível quando a fala não estiver acessível;
- não cortar fala disponível integralmente;
- declarar limite do material usado.

Se não houver histórico bruto e a solicitação exigir literalidade garantida, bloquear a transcrição literal e oferecer ata/reconstrução identificada.

## 9. Escopo fora da tarefa

Achado fora do escopo não deve ser corrigido por proximidade.

Se precisar incluir:

- pedir autorização;
- declarar escopo misto;
- justificar;
- registrar risco;
- atualizar evidência.

## 10. Evidência e garantia

Checklist reduz risco, mas não substitui:

- revisão humana;
- revisão de arquitetura;
- validação real;
- teste runtime;
- teste visual automatizado quando a garantia visual for exigida.

Evidência manual ajuda, mas não equivale a prova automatizada.
Toda garantia precisa declarar escopo e limite.


## 11. Entrada de novos controles

Novos controles, automações, travas, checklists ou workflows não entram por medo ou preferência pessoal.

Antes de adicionar qualquer controle novo:

- consultar `controles-futuros.md`;
- provar qual erro real o controle previne;
- confirmar que uma regra existente não cobre o caso;
- avaliar se o custo do controle é menor que o erro;
- garantir que tarefa simples não será prejudicada;
- declarar dono e critério de remoção se virar burocracia.

Se o controle só aumenta preenchimento e não aumenta qualidade, não deve entrar.


## Impedimento visual

Se uma alteração visual não puder entregar mockup, print real, diff ou percentual no PR, isso deve ser tratado como impedimento.

Esse impedimento só destrava se houver decisão explícita do líder, responsável e ação posterior.

## Travas e controles novos

Workflow, script de bloqueio, campo obrigatório no PR ou nova trava só entram quando necessários.

Antes de criar controle novo, confirmar:

- o usuário pediu trava ou apenas regra/checklist;
- já existe trava para o caso;
- o controle reduz risco real;
- não aumenta burocracia sem ganho;
- não enfraquece regra existente.

Se checklist simples resolve sem perda de controle, não criar trava.
