# DEPLOY_CHATGPT

Manual para instalar e rodar o Kzeraap no ambiente ChatGPT/container.

Objetivo:

> instalar dependências, executar validações básicas, gerar build, subir o servidor local e confirmar que a URL do app responde corretamente.

---

## 1. Requisitos

O ambiente precisa ter:

- terminal bash;
- Node.js 20 ou superior;
- npm;
- curl;
- acesso ao ZIP completo do projeto ou ao repositório.

Ambiente já validado:

```text
Node: v22.16.0
npm: 10.9.2
Git: 2.47.3
Vite: 5.4.11
Sistema: container Linux do ChatGPT
```

---

## 2. Entrar na pasta do projeto

Se o projeto veio por ZIP, extraia antes.

Depois entre na pasta do projeto:

```bash
cd /mnt/data/kzeraap_run
```

Confirme que está na pasta correta:

```bash
ls
cat package.json
```

O arquivo `package.json` precisa existir.

---

## 3. Instalar dependências

Rode:

```bash
npm install --include=dev
```

Resultado esperado:

```text
instalação finalizada sem erro bloqueante
```

Se o npm estiver bloqueado no ambiente, consulte os documentos internos já existentes:

```text
.claude/devops-npm-bloqueio.md
docs/AMBIENTE_BUILD_LOGIN.md
```

Em alguns ambientes, pode ser necessário usar `pnpm install`.

---

## 4. Rodar validação do projeto

Rode:

```bash
npm run check
```

Resultado esperado:

```text
check finalizado sem erro bloqueante
```

Se falhar, corrija o erro indicado antes de continuar.

---

## 5. Gerar build

Rode:

```bash
npm run build
```

Resultado esperado:

```text
build finalizado
pasta dist criada
```

---

## 6. Subir servidor local

Rode:

```bash
npm run dev -- --host 0.0.0.0 --port 5283
```

A porta pode ser alterada se já estiver em uso.

Use sempre a URL com `/Kzeraap/` no final.

Exemplo:

```text
http://127.0.0.1:5283/Kzeraap/
```

---

## 7. Confirmar que o app responde

Com o servidor rodando, abra outro terminal e rode:

```bash
curl -I http://127.0.0.1:5283/Kzeraap/
```

Resultado esperado:

```text
HTTP/1.1 200 OK
Content-Type: text/html
```

Se necessário, teste também:

```bash
curl -I http://localhost:5283/Kzeraap/
curl -I http://0.0.0.0:5283/Kzeraap/
```

---

## 8. Critério de ambiente instalado corretamente

Considere o ambiente instalado e operacional quando todos estes passos passarem:

- dependências instaladas;
- `npm run check` passou;
- `npm run build` passou;
- servidor local subiu;
- `curl` retornou `200 OK` na URL real do app.

Resumo esperado:

```text
npm install --include=dev: OK
npm run check: OK
npm run build: OK
npm run dev: OK
curl /Kzeraap/: 200 OK
```

---

## 9. Arquivos que não devem ser commitados por causa da instalação

Não coloque no Git arquivos gerados pelo ambiente local:

```text
node_modules/
dist/
package-lock.json
```

Se algum desses arquivos aparecer após instalar ou buildar, trate como artefato local, não como alteração de código.
