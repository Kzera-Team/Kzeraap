# Deploy Manual no Netlify (via ZIP)

## Pré-requisitos

- Acesso ao painel Netlify do projeto Kzera
- Arquivo ZIP gerado conforme abaixo

## Regra de versão — obrigatória

**O nome do ZIP deve conter a versão atual do projeto** (definida em `package.json`).

Antes de gerar o ZIP:

1. Verificar a versão atual em `package.json` → campo `"version"`.
2. Se houver mudanças no código desde o último deploy e o líder **não** solicitou incremento de versão → **abortar** e confirmar com o líder antes de prosseguir.
3. Somente gerar o ZIP após confirmação ou após o líder autorizar a versão atual.

## Como gerar o ZIP

```sh
# Na raiz do projeto — substituir X.Y.Z pela versão em package.json
VERSION=$(node -p "require('./package.json').version")
pnpm install
node_modules/.bin/vite build
zip -r "kzera-v${VERSION}-netlify.zip" dist/
```

Exemplo com versão `0.19.27`:
```
kzera-v0.19.27-netlify.zip
```

## Como fazer o deploy

1. Acesse [app.netlify.com](https://app.netlify.com)
2. Selecione o site do Kzera
3. Vá em **Deploys**
4. Arraste o arquivo `kzera-vX.Y.Z-netlify.zip` para a área de drop ("drag and drop your site output folder here")
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
