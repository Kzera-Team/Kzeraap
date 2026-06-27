# DEPLOY_CHATGPT

Documento inicial para registrar como o ChatGPT deve validar ambiente local do Kzeraap sem confundir problema de app com problema de navegador/ferramenta.

## Objetivo

Conseguir provar, com evidência, que o projeto:

1. instala dependências;
2. sobe servidor local;
3. responde na URL correta;
4. renderiza a tela no navegador real;
5. permite screenshot da tela renderizada.

Sem isso, a entrega é parcial ou bloqueada.

## Regra principal

Não tratar falha visual como bug do app antes de separar as camadas:

- instalação;
- servidor;
- host/porta;
- URL correta;
- navegador/Chromium;
- ferramenta de screenshot;
- app/código.

## Comandos base

```bash
npm install --include=dev
npm run check
npm run build
npm run dev -- --host 0.0.0.0
```

URL esperada no ambiente local:

```text
http://127.0.0.1:5173/Kzeraap/
```

Também testar, se necessário:

```text
http://localhost:5173/Kzeraap/
http://0.0.0.0:5173/Kzeraap/
```

## Validação por camadas

### 1. Servidor

Confirmar que o Vite subiu e mostrou porta real.

### 2. HTTP

Testar com `curl` antes de abrir navegador:

```bash
curl -I http://127.0.0.1:5173/Kzeraap/
```

Esperado:

```text
HTTP/1.1 200 OK
Content-Type: text/html
```

### 3. Navegador

Se `curl` responde, mas Chromium/Playwright falha, investigar ambiente antes de mexer no código.

Possíveis causas:

- URLBlocklist;
- política de Chromium;
- localhost bloqueado;
- navegador sem permissão para acessar rede local;
- ferramenta de screenshot com erro próprio.

### 4. Screenshot

A evidência só vale se vier da URL real do servidor local.

Não vale:

- HTML isolado;
- mockup;
- screenshot montado manualmente;
- renderização fora da URL real.

## Critério de aceite

A validação só é final quando existir:

- comando usado;
- URL real acessada;
- status HTTP 200;
- navegador abriu a URL;
- screenshot da tela renderizada;
- caminho do arquivo de evidência.

Se qualquer item faltar, status deve ser `PARCIAL` ou `BLOQUEADA`.

## Observação sobre ambiente ChatGPT

Se o Chromium estiver bloqueado por política local, isso é problema de ambiente, não prova de erro no app.

Exemplo de bloqueio já observado:

```json
{
  "URLBlocklist": ["*"]
}
```

Nesse caso, a próxima ação segura é pedir autorização para ajustar a política local do container ou usar outro navegador disponível.
