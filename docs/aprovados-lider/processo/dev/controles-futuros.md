# Controles Futuros

Este documento registra controles que **não entram agora** para evitar burocracia, mas que ficam previstos caso surja dor real, risco alto ou incidente.

Regra central:

- não adicionar controle por medo;
- não adicionar checklist novo se uma regra existente cobre o caso;
- não adicionar automação que atrapalhe tarefa simples;
- não adicionar burocracia manual quando o problema pode ser resolvido por evidência objetiva ou automação pequena.

Um controle só deve entrar quando:

1. previne erro real, recorrente ou caro;
2. custa menos que o erro que previne;
3. não enfraquece o processo atual;
4. não atrapalha tarefa simples;
5. tem dono claro;
6. pode ser explicado em poucas linhas;
7. pode ser removido ou ajustado se virar burocracia.

## Controles que não entram agora

### 1. Danger bot ou comentário automático no PR

Não entra agora porque adiciona mais ferramenta e pode virar ruído.

Pode entrar quando:

- revisores começarem a perder arquivos sensíveis no diff;
- PRs vierem com escopo grande ou misto sem declaração;
- evidência obrigatória estiver sendo preenchida de forma superficial;
- o time precisar de resumo automático de risco.

Valor esperado:

- destacar arquivos sensíveis alterados;
- avisar escopo misto;
- listar checks que deveriam existir;
- resumir riscos para o revisor.

### 2. Score automático de risco do PR

Não entra agora porque o processo atual já exige escopo, evidência e checklist.

Pode entrar quando:

- houver muitos PRs;
- revisão humana estiver gastando tempo demais em PR simples;
- o time precisar diferenciar baixo, médio e alto risco.

Valor esperado:

- reduzir revisão pesada em PR simples;
- exigir dono apenas para PR de risco maior;
- priorizar revisão em storage, cripto, autenticação, importação/exportação, workflow, processo e arquivo central.

### 3. Regras customizadas de ESLint para arquitetura

Não entra agora porque pode gerar manutenção alta se for criado antes de mapear a arquitetura real.

Pode entrar quando:

- import indevido entre camadas virar problema recorrente;
- UI começar a importar infraestrutura;
- domínio importar camada externa;
- regra de negócio aparecer em componente visual;
- app principal voltar a concentrar fluxo.

Valor esperado:

- bloquear violação arquitetural automaticamente;
- reduzir revisão humana de SOLID/Clean Code.

### 4. Dependency-cruiser, Madge ou verificador de dependências entre camadas

Não entra agora pelo mesmo motivo das regras customizadas: precisa mapear a arquitetura antes de travar.

Pode entrar quando:

- o projeto tiver fronteiras de camada formalizadas;
- houver regressão recorrente de import;
- revisão humana estiver pegando dependência errada tarde demais.

Valor esperado:

- impedir dependência proibida;
- proteger domínio, aplicação, infraestrutura e apresentação.

### 5. Visual regression automatizado para todas as telas

Não entra agora porque pode ser caro e instável se o ambiente visual não estiver travado.

Pode entrar quando:

- houver mockups aprovados versionados;
- houver viewport oficial;
- o ambiente de CI conseguir renderizar tela real;
- diferenças visuais começarem a passar em PR;
- a exigência de 99% precisar virar garantia técnica, não só evidência.

Valor esperado:

- screenshot real automático;
- comparação com mockup aprovado;
- diff visual;
- percentual;
- bloqueio se ficar abaixo do limite.

### 6. Playwright para todos os fluxos principais

Não entra agora porque ampliar E2E sem foco pode deixar o pipeline lento.

Pode entrar primeiro em fluxos críticos:

- login;
- restauração de backup;
- importação/exportação;
- criação/edição de dados sensíveis;
- fluxos PWA/mobile-first críticos.

Valor esperado:

- reduzir validação manual;
- provar comportamento real em navegador;
- pegar erro que revisão estática não pega.

### 7. Fixtures reais de backup/importação como suíte obrigatória

Não entra agora como pacote amplo, mas é candidato forte para o fluxo de backup.

Pode entrar quando:

- restauração/importação continuar sendo alterada;
- houver risco de app vazio;
- houver compatibilidade com backup antigo;
- senha correta/senha errada/arquivo inválido precisarem de prova automatizada.

Valor esperado:

- validar backup válido;
- validar senha errada;
- validar arquivo inválido;
- validar app vazio;
- validar fallback de backup antigo.

### 8. Bloqueio agressivo de PR por número de linhas ou arquivos

Não entra agora porque pode bloquear alteração legítima e incentivar divisão artificial.

Pode entrar quando:

- PRs grandes começarem a passar com erro;
- escopo misto virar rotina;
- revisão humana ficar impraticável.

Valor esperado:

- forçar PR menor;
- reduzir risco de revisão superficial.

Critério mínimo se entrar:

- permitir justificativa;
- permitir exceção aprovada;
- não bloquear alteração simples gerada por renomeação ou formatação quando justificada.

### 9. Labels obrigatórios como `visual-change`, `refactor`, `bugfix`, `process`

Não entra agora porque depende de disciplina operacional do time.

Pode entrar quando:

- o time já usar labels;
- os workflows precisarem ativar exigências por tipo de PR;
- houver confusão recorrente sobre tipo de alteração.

Valor esperado:

- ativar checklist visual automaticamente;
- exigir evidência por tipo;
- identificar escopo misto.

### 10. ADR obrigatório para toda decisão técnica

Não entra agora porque ADR para tudo vira burocracia.

Pode entrar somente para decisões relevantes:

- arquitetura;
- segurança;
- storage/schema;
- importação/exportação;
- mudança de processo;
- mudança de threshold;
- mudança de mockup aprovado;
- exceção relevante.

Valor esperado:

- preservar contexto;
- evitar repetir discussão;
- registrar motivo e alternativa rejeitada.

### 11. Rollback detalhado para toda tarefa

Não entra agora porque tarefa simples não precisa de plano pesado.

Já existe regra condicional.

Só exigir rollback detalhado quando mexer em:

- dados;
- storage;
- autenticação;
- segurança;
- importação/exportação;
- workflow;
- processo;
- produção;
- migração.

Valor esperado:

- reduzir risco em áreas críticas;
- permitir desfazer mudança sem improviso.

### 12. Evidência obrigatória por tipo de entrega em matriz automatizada

Não entra agora porque o PR template atual já exige evidência mínima.

Pode entrar quando:

- devs começarem a preencher evidência genérica;
- o time precisar exigir evidência diferente para visual, refatoração, bugfix, processo, segurança e importação;
- labels ou tipo de PR estiverem maduros.

Valor esperado:

- visual exige mockup/print/diff;
- bugfix exige erro antes/depois;
- refatoração exige equivalência;
- processo exige aprovação/versionamento;
- segurança exige risco/mitigação.

## Regra de entrada de novo controle

Antes de criar qualquer controle novo, responder:

- qual erro real ele previne?
- esse erro já aconteceu ou é risco alto?
- qual regra atual não cobre?
- o novo controle reduz revisão humana ou só aumenta preenchimento?
- qual custo para tarefa simples?
- qual arquivo/documento será alterado?
- quem é o dono?
- como o controle pode ser removido se virar burocracia?

Se essas respostas não forem claras, o controle não entra.
