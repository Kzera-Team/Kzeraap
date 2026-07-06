# Pendencias visuais isoladas — PR 104

Status: REGISTRADO / NAO BLOQUEANTE PARA CONTINUIDADE DO PR 104.

## Decisao operacional

As pendencias abaixo foram isoladas para trabalho futuro de Lia. Elas nao devem travar a continuidade do PR 104 por si so.

Este arquivo nao aprova visualmente os componentes. Ele apenas separa o risco para rastreio.

## Escopo isolado

Arquivos de documentacao UX/design system com impacto visual direto ou potencial:

- `docs/aprovados-lider/design-system/00-guia-implementacao.html`
- `docs/aprovados-lider/design-system/00-persona-senhora-cansada.html`
- `docs/aprovados-lider/design-system/02-tipografia.html`
- `docs/aprovados-lider/design-system/03-cores.html`
- `docs/aprovados-lider/design-system/04-espacamento.html`
- `docs/aprovados-lider/design-system/05-border-radius.html`
- `docs/aprovados-lider/design-system/06-sombras.html`
- `docs/aprovados-lider/design-system/componentes/07-botoes/*`
- `docs/aprovados-lider/design-system/componentes/08-inputs/*`
- `docs/aprovados-lider/design-system/componentes/09-cards/*`
- `docs/aprovados-lider/design-system/componentes/10-badges/*`
- `docs/aprovados-lider/design-system/componentes/11-navegacao/*`
- `docs/aprovados-lider/design-system/index.html`
- `docs/aprovados-lider/design-system/componentes/index.html`

## Classificacao

- Tipo: documentacao UX / design system / HTML-CSS de referencia.
- Impacto no app real: nao confirmado neste registro.
- Risco: referencia visual futura pode ser copiada para `src/` sem validacao renderizada.
- Dono da analise visual: Lia.
- Dono de correcao se virar codigo: Jose ou dev responsavel do modulo.
- Dono de validacao final: QA.

## Trabalho futuro de Lia

1. Renderizar os HTMLs principais.
2. Capturar prints reais.
3. Comparar estrutura visual, contraste, hierarquia, espacamento e consistencia.
4. Separar o que e aceitavel como proposta do que precisa ajuste.
5. Devolver para dev somente se houver correcao concreta.

## Evidencias pendentes

- Print real de botoes.
- Print real de inputs.
- Print real de cards.
- Print real de badges.
- Evidencia funcional da navegacao/drawer.

## Regra para continuidade

Enquanto estes arquivos estiverem apenas como documentacao/proposta, a pendencia fica registrada e nao bloqueia continuidade.

Se algum CSS/HTML daqui for aplicado em `src/` ou tela real, volta a exigir validacao visual antes de aprovar aquela entrega.
