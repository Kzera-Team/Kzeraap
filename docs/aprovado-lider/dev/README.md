# Dev — Processo KZERA

Esta pasta concentra as regras obrigatórias de desenvolvimento, entrega e governança.

## Versionamento do processo

Versão atual: `1.1.5`
Data: `2026-06-27`
Dono: líder do projeto

Toda alteração nos documentos oficiais desta pasta deve atualizar esta seção com:

- nova versão;
- data;
- resumo do que foi alterado;
- motivo da alteração;
- impacto no processo.

Se os documentos de processo forem alterados e esta seção não for atualizada, a entrega deve bloquear.

## Alterações desta versão

- Adicionadas regras objetivas para evitar repetição de erros de entrega:
  - garantia só após validação máxima possível;
  - conferência real do pacote antes de informar árvore/arquivos;
  - arquivo central não recebe fluxo novo;
  - trava só quando necessária;
  - alteração de processo deve ser declarada.

## Regra-mãe

Toda entrega só pode seguir se provar:

1. o escopo estava claro antes de codar;
2. a solução ficou no lugar certo, sem duplicação e sem misturar responsabilidades;
3. a evidência entregue corresponde ao que realmente foi validado.

Se qualquer um dos três falhar, a entrega deve bloquear.

## Arquivos oficiais

- `processo-dev.md`: fluxo obrigatório antes, durante e depois de codar.
- `checklist-dev.md`: checklist geral de desenvolvimento, refatoração, responsabilidade, duplicação, rollback e entrega honesta.
- `checklist-visual.md`: regras para tela, mockup, print real e garantia visual.
- `governanca-e-excecoes.md`: dono, proteção, exceções, decisões, incidentes e registros fiéis.
- `controles-futuros.md`: controles que não entram agora, critérios para entrada futura e motivo de adiamento.

## Uso no dia a dia

Toda tarefa:

- leia `processo-dev.md` antes de iniciar;
- aplique `checklist-dev.md` antes e depois de codar.

Somente se houver impacto visual:

- aplique `checklist-visual.md` quando houver tela, layout, HTML, CSS, componente visual, mockup ou fluxo com impacto visual.

Somente se houver exceção, governança ou registro sensível:

- use `governanca-e-excecoes.md` quando houver exceção, mudança de regra, alteração de processo, incidente, decisão técnica relevante, mudança em documento protegido ou pedido de transcrição/registro fiel.

Somente quando alguém propuser novo controle, automação ou trava:

- consulte `controles-futuros.md` antes de criar nova regra;
- se o controle ainda não atende ao critério de entrada, não implementar agora.

Regra de uso:

- não tratar todos os documentos como leitura completa obrigatória em toda tarefa;
- aplicar apenas os documentos correspondentes ao tipo da entrega;
- se houver dúvida sobre qual documento se aplica, bloquear e confirmar antes de seguir.

## Proteção

Checklist, processo, workflow, PR template, scripts de bloqueio, mockups aprovados e thresholds não podem ser alterados sem aprovação do dono.

O dono dos documentos de processo é o líder do projeto.
No contexto atual, o dono é o usuário solicitante.

## Limite

Checklist reduz risco, mas não substitui revisão humana, arquitetura nem validação real da entrega.
Evidência manual não é prova automatizada.
Garantia sempre deve declarar escopo.
