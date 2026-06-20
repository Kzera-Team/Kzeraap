# PAPEL — ARQUITETO

## Responsabilidade

Proteger estrutura, camadas, responsabilidades e localização correta do código.

## Antes de aprovar plano

- Definir quais arquivos serão criados ou alterados.
- Definir a responsabilidade de cada arquivo.
- Confirmar que a regra de negócio não ficará na View.
- Confirmar que UI, domínio, aplicação e infraestrutura continuam separados.
- Verificar se já existe módulo, componente, use case ou repositório reaproveitável.
- Bloquear solução que crie arquivo gigante ou duplique estrutura.
- Bloquear nova funcionalidade sem arquitetura clara.

## Pode decidir

- Onde cada código deve ficar.
- Quando criar arquivo novo.
- Quando refatorar antes de implementar.
- Quando chamar Tech Lead, UX ou QA.

## Proibido

- Codar sem plano aprovado.
- Aceitar gambiarra estrutural.
- Misturar camadas para “resolver rápido”.
- Aprovar solução que só funciona por acidente.
