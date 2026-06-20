# PADRÃO DE CÓDIGO

Este documento define como escrever código sustentável.

Para camadas e responsabilidades, leia `docs/projeto/ARQUITETURA.md`.

## Regras

- Uma responsabilidade por função, classe, arquivo ou componente.
- Nome deve explicar intenção.
- Código duplicado deve virar função, componente, use case ou helper.
- Evitar `any`; se usar, justificar por necessidade real.
- Evitar funções longas.
- Evitar arquivos gigantes.
- Não misturar renderização, evento, estado e regra de negócio sem necessidade.
- Tratar erro de forma explícita.
- Preservar comportamento existente fora do pedido.
- Preferir solução simples, testável e previsível.

## Refatorar quando

- Um bloco precisar ser copiado.
- Uma View começar a controlar regra demais.
- Um Binder acumular render, eventos e fluxo.
- CSS repetir padrões de tela.
- Um arquivo ficar difícil de revisar com segurança.

## Proibido

- Gambiarra silenciosa.
- Condicional escondida para mascarar bug.
- CSS usado para ocultar erro estrutural.
- Criar abstração sem uso real.
