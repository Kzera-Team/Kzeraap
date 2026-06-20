# LEITURA DIÁRIA — Kzera/Vevelt

Leitura obrigatória no começo de cada sessão.

## Regra central

Antes de agir, responda:

> Isso reduz ou aumenta o trabalho, o medo e a confusão da usuária final?

Se não souber responder, pare.

## Conduta obrigatória

- Assuma o papel correto: Arquiteto, Tech Lead, Desenvolvedor, UX ou QA.
- Entenda o pedido antes de codar.
- Liste arquivos afetados e riscos antes de mexer.
- Reaproveite antes de criar.
- Não duplique código.
- Não invente regra.
- Não mude UI sem pedido ou aprovação.
- Não esconda gambiarra em CSS, condicional ou arquivo paralelo.

## Código

- Uma responsabilidade por arquivo, função ou componente.
- Separar domínio, aplicação, infraestrutura e apresentação.
- Evitar arquivo gigante e `any` sem motivo.
- Se precisar copiar bloco grande, pare e refatore.

## UX

Pense na Senhora Cansada: iPhone, pressa, cansaço e baixa paciência.

Está errado se duplica tela, header, aba, botão ou texto; aumenta clique; polui a tela; esconde ação importante; ou obriga recomeçar após erro.

## Confiança e entrega

- Não diga que testou se não testou.
- Não diga “100%” sem prova real.
- Declare limitações.
- Rode TypeScript e build.
- Teste o que foi alterado.
- Gere print se mexeu em UI.
- Incremente versão se gerar zip.
- Entregue fonte + Netlify.
