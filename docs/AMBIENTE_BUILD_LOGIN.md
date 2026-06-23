# Ambiente de Build e Acesso à Tela de Login

## DevOps — Build no ambiente remoto

### Contexto
O ambiente de execução dos agentes é um container Linux efêmero (Claude Code remoto). O `npm` está bloqueado pelo Artifactory, portanto o gerenciador de pacotes utilizado é o `pnpm`.

### O que foi necessário para o build rodar

1. **Gerenciador de pacotes**: usar `pnpm` em vez de `npm`. O `npm install` falha com erro de Artifactory.

2. **Instalação de dependências**:
   ```sh
   pnpm install
   ```

3. **Comando de build** (sem `pnpm exec` no PATH, usar o binário direto):
   ```sh
   node_modules/.bin/vite build
   ```
   Gera a pasta `dist/` com os assets estáticos.

4. **Servidor de preview local para testes**:
   ```sh
   node_modules/.bin/vite preview --port 4173
   ```
   Serve o build em `http://localhost:4173`.

5. **Playwright para testes E2E**:
   - Módulo: `/opt/node22/lib/node_modules/playwright`
   - Binário Chromium: `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`
   - Executar com `--no-sandbox` no ambiente remoto.

---

## José — Ações para chegar na tela de login com sucesso

### Fluxo para alcançar a tela de Importar Perfis

1. **Build e preview**: build com `vite build`, servido via `vite preview` na porta configurada.

2. **Bypass temporário de onboarding** (somente para testes, revertido antes do commit):
   Em `src/app/createKzeraAuthenticatedApp.ts:955`, a condição:
   ```ts
   if (!savedRule) {
   ```
   foi temporariamente alterada para:
   ```ts
   if (false && !savedRule) {
   ```
   para pular a tela de configuração de "código do perfil" e acessar diretamente o app.
   **A condição original foi restaurada antes do commit.**

3. **Autenticação**: senha `12345` na tela de login.

4. **Modal de backup**: dispensar clicando em "Adiar".

5. **Drawer → Importar Perfis**: abrir o menu lateral e selecionar "Importar Perfis".

6. **Upload do CSV**: selecionar `perfis_teste.csv` via input de arquivo.
