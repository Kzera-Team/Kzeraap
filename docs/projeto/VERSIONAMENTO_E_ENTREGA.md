# VERSIONAMENTO E ENTREGA

## Regra de versão

Se gerar zip oficial novo, incremente a versão.

Isso vale mesmo para documentação, correção pequena ou pacote de ajuste.

## Entrega obrigatória

Toda entrega oficial com zip deve ter:

- zip do projeto fonte;
- zip estático pronto para Netlify.

## Nome dos pacotes

Usar nomes coerentes:

- `Kzera-<versao>-<descricao>.zip`
- `Kzera-Netlify-Static-Deploy-<versao>-<descricao>.zip`

## Netlify

O zip Netlify deve conter o conteúdo do `dist` no topo:

- `index.html`
- `assets/`
- `_redirects`

Não zipar a pasta `dist` por fora.

## Antes de entregar

- Rodar TypeScript.
- Rodar build.
- Conferir versão pública.
- Conferir estrutura do zip.
- Linkar os dois arquivos com a versão no texto.
