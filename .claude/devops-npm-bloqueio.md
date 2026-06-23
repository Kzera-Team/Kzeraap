# Bloqueio npm — Ambiente Remoto Claude Code

**Urgente. Retorno necessário assim que possível.**

---

## Contexto do ambiente

Sessão remota do Claude Code (cloud), executada em container Linux efêmero. Node.js v22 disponível em `/opt/node22`. Shell: bash.

## Problema

O comando `npm install` falha com erro 403 ao tentar baixar pacotes do registro público. O gateway interno intercepta a requisição e bloqueia:

```
403 Forbidden - GET https://packages.applied-caas-gateway1.internal.api.openai.org/artifactory/api/npm/npm-public/nanoid/-/nanoid-3.3.12.tgz
```

O ambiente redireciona o tráfego npm para um Artifactory interno (`applied-caas-gateway1.internal.api.openai.org`) que retorna 403 para os pacotes do projeto.

## Projeto

- Nome: Kzera PWA
- Localização: `/home/user/Kzeraap`
- Gerenciador de pacotes: npm (com `package-lock.json`)
- `devDependencies` principal: `vite@^8.0.16`
- TypeScript, sem dependências de runtime além do Vite e plugins
- `package.json` presente, `node_modules` ausente, `dist` ausente

## Objetivo final

Conseguir executar:

```bash
npm install
node_modules/.bin/vite --host 0.0.0.0 --port 5173
```

Para que o app sirva em `http://localhost:5173` e o Playwright (disponível em `/opt/pw-browsers`) possa capturar screenshots reais da tela renderizada.

## Requisitos da solução

1. Liberar acesso do ambiente ao registro npm (público ou mirror) — via whitelist no Artifactory, proxy, ou `.npmrc` apontando para espelho acessível
2. Ou montar cache local (ex: Verdaccio) com os pacotes necessários pré-carregados
3. A solução deve funcionar dentro do ciclo de vida do container efêmero (sem persistência entre sessões)
4. Não exige alteração no código do projeto — apenas configuração de ambiente/rede

## Informações adicionais

- Playwright já instalado: `/opt/pw-browsers` e `/opt/node22/lib/node_modules/playwright`
- Chromium disponível e funcional para screenshots via `playwright screenshot`
- `package-lock.json` presente — pode ser usado para identificar todos os pacotes e versões exatas necessários
- Node.js v22 disponível em `/opt/node22/bin/node`

## Log de erro completo

```
npm error 403 403 Forbidden - GET https://packages.applied-caas-gateway1.internal.api.openai.org/artifactory/api/npm/npm-public/nanoid/-/nanoid-3.3.12.tgz
npm error 403 In most cases, you or one of your dependencies are requesting
npm error 403 a package version that is forbidden by your security policy, or
npm error 403 on a server you do not have access to.
npm error A complete log of this run can be found in: /root/.npm/_logs/2026-06-23T05_31_38_110Z-debug-0.log
```
