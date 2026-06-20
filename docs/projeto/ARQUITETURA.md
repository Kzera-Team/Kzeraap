# ARQUITETURA

Este documento define onde cada coisa deve ficar.

Para regras de escrita, nomes, duplicação e qualidade, leia `docs/projeto/PADRAO_DE_CODIGO.md`.

## Camadas

- `domain`: entidades, tipos e regras puras do negócio.
- `application`: casos de uso e orquestração de regras.
- `infrastructure`: storage, IndexedDB, gateways, adapters e serviços externos.
- `presentation`: views, binders, componentes de UI e eventos.
- `app`: composição, bootstrap e ligação entre camadas.

## Regras

- View não contém regra de negócio.
- Domínio não depende de UI, storage ou browser.
- Application pode usar interfaces, não implementação concreta.
- Infrastructure implementa detalhes externos.
- Presentation chama casos de uso, não manipula persistência diretamente.
- Módulo novo precisa ter responsabilidade clara.
- Arquivo grande deve ser dividido antes de crescer mais.
- Reaproveitar módulo existente antes de criar outro.

## Proibido

- Misturar camada para resolver rápido.
- Criar fluxo paralelo para fugir da arquitetura.
- Duplicar estrutura existente.
- Colocar regra crítica em CSS, DOM ou evento solto.
