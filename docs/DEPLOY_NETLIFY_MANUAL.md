# Deploy Manual no Netlify (via ZIP)

## Pré-requisitos

- Acesso ao painel Netlify do projeto Kzera
- Arquivo `kzera-netlify.zip` gerado conforme abaixo

## Como gerar o ZIP

```sh
# Na raiz do projeto
pnpm install
node_modules/.bin/vite build
zip -r kzera-netlify.zip dist/
```

O arquivo `kzera-netlify.zip` será criado na raiz do projeto.

## Como fazer o deploy

1. Acesse [app.netlify.com](https://app.netlify.com)
2. Selecione o site do Kzera
3. Vá em **Deploys**
4. Arraste o arquivo `kzera-netlify.zip` para a área de drop ("drag and drop your site output folder here")
   — ou clique em **"browse to upload"** e selecione o arquivo
5. Aguarde o deploy concluir (geralmente < 30 segundos)
6. Verifique a URL de produção

## Estrutura esperada dentro do ZIP

```
dist/
├── _redirects          ← obrigatório para PWA (rotas → index.html)
├── index.html
├── manifest.webmanifest
├── favicon.svg
├── icon-16.png
├── icon-32.png
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── apple-touch-icon.png
└── assets/
    ├── index-*.js
    └── index-*.css
```

## Observações

- O conteúdo do ZIP é a pasta `dist/` completa — não zipar arquivos soltos fora dela.
- O `_redirects` garante que qualquer rota da PWA retorne `index.html` com status 200.
- Não usar DNS ou URL com nomes públicos ou internos do projeto no painel.
- Node 20 no ambiente de build automático (se configurado via `netlify.toml`).
