# Deploy Netlify

## Build settings

- Build command: `npm run check && npm run build`
- Publish directory: `dist`
- Node: `20`

## Fluxo recomendado

1. Subir este pacote para um repositório Git.
2. Criar o projeto no painel da plataforma.
3. Usar as configurações do `netlify.toml`.
4. Conferir que o domínio configurado não contenha nomes internos nem o nome público do app.
5. Rodar um deploy preview antes de publicar em produção.

## Validação local

```bash
npm install
npm run check
npm run build
npm run preview
```

O diretório publicado é `dist`.
