# Checklist Visual

Uso obrigatório para tela, componente visual, layout, CSS, HTML ou fluxo com impacto visual.

## 1. Antes de codar

- Identificar mockup aprovado.
- Identificar tela, rota, estado e viewport.
- Confirmar se a alteração é visual, refatoração, mudança de mockup ou escopo misto.
- Comparar tela atual com mockup aprovado.
- Listar apenas diferenças visuais que serão corrigidas.
- Confirmar componentes, templates, estilos e padrões visuais existentes.
- Declarar o que não será alterado: regra, storage, cripto, validação, autenticação, importação/exportação, fluxo não visual e comportamento fora do escopo.
- Bloquear alteração visual que exige fidelidade se não houver mockup aprovado.

## 2. Durante o desenvolvimento

- Seguir fielmente o mockup aprovado.
- Reaproveitar componentes, templates, estilos e padrões existentes.
- Não criar estrutura visual duplicada.
- Não escrever HTML estrutural em TypeScript sem autorização expressa.
- Não usar CSS inline em TS sem exceção aprovada.
- Não alterar regra, persistência, segurança, cripto, validação ou fluxo para resolver diferença visual sem autorização.
- Se CSS/evento visual não bastar e for necessário alterar estrutura ou comportamento, parar e declarar mudança de escopo.
- Se encontrar problema fora do escopo visual, registrar como achado e não corrigir junto sem autorização.

## 3. Print real obrigatório

Ao final:

- abrir a tela real no sistema;
- capturar print real da tela renderizada;
- confirmar que o print não foi editado, manipulado, montado ou simulado;
- comparar print real com mockup aprovado;
- anexar evidência visual ao PR;
- declarar diferenças conhecidas.

É proibido usar mockup como print.
É proibido montar imagem para parecer tela real.

## 4. Evidência manual versus garantia automatizada

Evidência manual:

- print real anexado;
- declaração de não manipulação;
- comparação humana/revisão visual.

Garantia automatizada:

- mockup aprovado versionado;
- screenshot real automático;
- diff visual;
- percentual calculado;
- execução em CI ou ambiente controlado.

Não chamar evidência manual de garantia automatizada.

## 5. Regra dos 99%

A fidelidade mínima de 99% só pode ser afirmada como garantia técnica quando houver comparação automatizada entre:

- mockup aprovado;
- screenshot real da tela renderizada;
- mesma viewport;
- mesmo navegador;
- mesma escala/deviceScaleFactor;
- mesmo estado da tela;
- dados determinísticos;
- fontes disponíveis;
- animações/transições desativadas ou controladas;
- tela estabilizada antes do screenshot.

Sem comparação automatizada, pode haver evidência visual, mas não garantia técnica de 99%.

## 6. Artefatos da comparação automatizada

Quando houver teste visual, salvar:

- mockup aprovado usado;
- screenshot real;
- diff visual;
- percentual de similaridade;
- viewport;
- navegador;
- estado da tela.

O script deve falhar se faltar mockup, screenshot real, diff ou percentual.

## 7. Dados dinâmicos

Fixar, mockar ou mascarar quando necessário:

- datas;
- horários;
- IDs;
- valores dinâmicos;
- loading;
- foco;
- cursor;
- scrollbar;
- imagens externas;
- conteúdo remoto.

## 8. Escopo da garantia visual

A garantia visual vale apenas para:

- mockup usado;
- viewport testada;
- navegador testado;
- escala testada;
- estado da tela testado.

Cada viewport obrigatória precisa de validação própria.

## 9. Proteção visual

- Mockup aprovado deve ser versionado, congelado e protegido.
- Threshold de comparação não pode ser alterado sem aprovação do dono.
- Mudança de mockup deve ser aprovada, registrada e preferencialmente separada do PR de implementação.
- Alteração visual sem mockup aprovado bloqueia.

## 10. Impedimento visual

A ausência de print real, mockup aprovado ou comparação visual não deve ser escondida.

A entrega pode seguir sem evidência visual completa somente quando houver impedimento/exceção registrado no PR com:

- classificação;
- impacto;
- garantia limitada;
- o que não está garantido;
- decisão;
- responsável;
- ação posterior ou prazo.

Sem esse registro, a entrega bloqueia.
