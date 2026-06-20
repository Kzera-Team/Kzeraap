# TESTES

Documento obrigatório para validação.

## Mínimo técnico

- Rodar `npx tsc --noEmit`.
- Rodar `npm run build`.
- Rodar testes relevantes existentes.
- Validar manualmente o fluxo alterado.

## Se mexeu em UI

- Gerar screenshot em viewport iPhone 390px.
- Usar 414px quando houver risco em telas maiores.
- Conferir duplicações visuais.
- Conferir início da tela, safe area, botão principal e estado vazio.
- Declarar se não foi testado no Safari/iPhone real.

## Honestidade

- Chromium com viewport de iPhone não é Safari real.
- Build passando não prova UX.
- Screenshot não prova teclado, Face ID, cache ou PWA instalado.
- Limitação deve ser informada.

## Proibido

- Dizer “100%” sem teste real.
- Dizer “testado no iPhone” sem iPhone real.
- Entregar UI sem print.
