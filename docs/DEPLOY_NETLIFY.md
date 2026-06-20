# DEPLOY NETLIFY

Documento técnico para deploy estático.

## Regras

- O build deve publicar a pasta `dist`.
- O comando de deploy deve executar validação antes do build.
- O projeto deve usar Node 20 no ambiente de deploy.
- Rotas de PWA devem redirecionar para `index.html`.
- O pacote estático deve conter `index.html`, `assets/` e `_redirects` no topo.
- Não zipar a pasta `dist` por fora.
- Não usar DNS ou URL contendo nomes públicos ou internos do projeto.
