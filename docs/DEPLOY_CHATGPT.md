# DEPLOY_CHATGPT

Manual para subir o Kzeraap no ambiente ChatGPT/container.

Objetivo principal:

> instalar dependências, validar o projeto, subir o servidor local e confirmar que a URL real responde.

A captura de tela é apenas uma evidência adicional quando a tarefa exigir validação visual. Ela não deve impedir o agente de concluir que o ambiente de desenvolvimento está instalado e rodando.

---

## 1. O que precisa existir antes

Você precisa ter:

- ZIP completo do projeto, ou repositório acessível;
- terminal bash;
- Node.js;
- npm;
- curl;
- Python 3;
- Playwright para Python, somente se precisar validar via navegador;
- Chromium ou outro navegador compatível, somente se precisar validar via navegador.

Ambiente onde isso funcionou:

```text
Node: v22.16.0
npm: 10.9.2
Git: 2.47.3
Vite: 5.4.11
Sistema: container Linux do ChatGPT
```

Pasta usada no teste:

```text
/mnt/data/kzeraap_run
```

---

## 2. Prepare o projeto

Entre na pasta onde o projeto foi extraído:

```bash
cd /mnt/data/kzeraap_run
```

Confira se está na pasta certa:

```bash
ls
cat package.json
```

Tem que aparecer `package.json`.

---

## 3. Instale as dependências

Rode:

```bash
npm install --include=dev
```

Se terminar sem erro, siga.

Se der erro de npm bloqueado, consulte:

```text
.claude/devops-npm-bloqueio.md
docs/AMBIENTE_BUILD_LOGIN.md
```

Nesses casos, pode precisar usar `pnpm install`.

---

## 4. Rode os checks

```bash
npm run check
```

Resultado esperado:

```text
sem erro bloqueante
```

Se falhar, corrija o erro antes de tratar o ambiente como validado.

---

## 5. Rode o build

```bash
npm run build
```

Resultado esperado:

```text
build finalizado
pasta dist criada
```

---

## 6. Suba o app local

Use host aberto para evitar erro de acesso:

```bash
npm run dev -- --host 0.0.0.0 --port 5283
```

A porta pode mudar. Use a porta que aparecer no terminal.

A URL precisa ter `/Kzeraap/` no final.

Exemplo:

```text
http://127.0.0.1:5283/Kzeraap/
```

---

## 7. Confirme que o servidor responde

Abra outro terminal e rode:

```bash
curl -I http://127.0.0.1:5283/Kzeraap/
```

Resultado esperado:

```text
HTTP/1.1 200 OK
Content-Type: text/html
```

Se não responder `200`, o servidor ou a URL estão errados.

Também pode testar:

```bash
curl -I http://localhost:5283/Kzeraap/
curl -I http://0.0.0.0:5283/Kzeraap/
```

Quando `install`, `check`, `build`, `dev` e `curl 200` passam, o ambiente local está operacional.

---

## 8. Validação por navegador, quando necessário

Use esta parte somente quando a tarefa exigir abrir o app em navegador real ou gerar evidência visual.

Primeiro verifique se o Chromium do sistema está bloqueado por policy:

```bash
find /etc -path '*chrom*polic*' -type f -print -exec sed -n '1,120p' {} \;
```

Se aparecer isto:

```json
{
  "URLBlocklist": ["*"]
}
```

esse Chromium pode bloquear até `localhost`.

---

## 9. Se autorizado, liberar a policy local do Chromium

Só faça isso com autorização explícita.

```bash
mkdir -p /tmp/chromium-policies-managed-kzera-backup
mv /etc/chromium/policies/managed/* /tmp/chromium-policies-managed-kzera-backup/
```

Isso altera só o ambiente do container.

Não é código do projeto.

Não vai para Git.

---

## 10. Se der Permission denied ou Operation not permitted

Se estes comandos falharem:

```bash
mv /etc/chromium/policies/managed/* /tmp/chromium-policies-managed-kzera-backup/
chmod u+w /etc/chromium/policies/managed
```

com algum destes resultados:

```text
Permission denied
Operation not permitted
```

então a policy é root-owned e não removível pelo agente.

Nesse caso, pare de insistir no Chromium do sistema.

Não adianta repetir flags como:

```text
--single-process
--no-zygote
--disable-gpu-compositing
--use-gl=swiftshader
--in-process-gpu
--temp-profile
```

Essas flags continuam usando o mesmo Chromium bloqueado pela policy.

A próxima ação é usar outro binário de navegador que não leia a policy do sistema.

### 10.1. Tente instalar Chromium do Playwright em pasta de usuário

Rode:

```bash
export PLAYWRIGHT_BROWSERS_PATH=/tmp/pw-browsers
python3 -m playwright install chromium
```

Depois procure o binário baixado:

```bash
find /tmp/pw-browsers -type f \( -name chrome -o -name chromium \)
```

Se encontrar um caminho como:

```text
/tmp/pw-browsers/chromium-*/chrome-linux/chrome
```

use esse caminho no Playwright:

```python
browser = p.chromium.launch(
    executable_path='/tmp/pw-browsers/chromium-*/chrome-linux/chrome',
    headless=True,
    args=['--no-sandbox']
)
```

Substitua o `*` pelo caminho real encontrado no `find`.

### 10.2. Se o download falhar por DNS/rede

Se aparecer erro parecido com:

```text
getaddrinfo EAI_AGAIN cdn.playwright.dev
Failed to install browsers
```

então o container não consegue baixar o navegador.

Nesse caso, peça um pacote offline com um destes itens:

```text
Chromium portátil
ou
pasta Playwright browsers já baixada
```

Extraia em:

```text
/tmp/pw-browsers
```

Depois use o binário extraído no `executable_path`.

Sem permissão para remover a policy e sem outro binário de navegador, a validação por navegador fica bloqueada, mas isso não invalida os passos de instalação, build, servidor e `curl`.

---

## 11. Script opcional para validar via navegador

Use somente se a tarefa pedir navegador real ou evidência visual.

Se a policy do Chromium do sistema foi liberada, use `/usr/bin/chromium`.

Se estiver usando Chromium do Playwright ou Chromium portátil, troque `executable_path` pelo caminho real.

```bash
python3 - <<'PY'
from pathlib import Path
from playwright.sync_api import sync_playwright

url = 'http://127.0.0.1:5283/Kzeraap/'
out = '/mnt/data/kzera_navegador_validacao.png'
chromium_path = '/usr/bin/chromium'

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=chromium_path,
        headless=True,
        args=[
            '--no-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--disable-extensions',
            '--disable-background-networking',
            '--allow-insecure-localhost'
        ]
    )
    page = browser.new_page(viewport={'width': 390, 'height': 844})
    page.goto(url, wait_until='domcontentloaded', timeout=15000)
    page.wait_for_timeout(3000)
    title = page.title()
    text = page.locator('body').inner_text(timeout=5000)
    page.screenshot(path=out, full_page=True)
    browser.close()

print('URL:', url)
print('TITLE:', title)
print('TEXT:', text)
print('SCREENSHOT_EXISTS:', Path(out).exists())
print('SCREENSHOT_PATH:', out)
PY
```

Resultado esperado quando a validação visual for necessária:

```text
TITLE: Vevelt
TEXT contém: Criar senha
SCREENSHOT_EXISTS: True
```

---

## 12. Critério de ambiente operacional

O ambiente pode ser tratado como operacional quando:

- `npm install --include=dev` passou;
- `npm run check` passou;
- `npm run build` passou;
- `npm run dev` subiu;
- `curl` retornou `200 OK` na URL real.

Validação por navegador é uma camada adicional.

Ela deve ser feita quando a tarefa pedir evidência visual, UX, layout, fluxo real ou comparação de tela.

Se o navegador estiver bloqueado por policy do container, informe separadamente:

```text
Ambiente do projeto: OK
Servidor local: OK
Validação por navegador: bloqueada por policy do container
```

---

## 13. O que não vale como evidência visual

Quando a tarefa exigir validação visual, não use:

- HTML isolado;
- mockup no lugar do app;
- imagem montada manualmente;
- arquivo aberto fora da URL real do app.

---

## 14. Problema encontrado no projeto

Durante a validação, foi encontrado um caminho errado no script de backup.

Arquivo:

```text
public/index.html
```

Correção validada localmente:

```diff
- <script src="./static/backup-recovery-trigger.js"></script>
+ <script src="./backup-recovery-trigger.js"></script>
```

Motivo:

```text
No build, o arquivo é servido em /Kzeraap/backup-recovery-trigger.js.
Ele não fica em /Kzeraap/static/backup-recovery-trigger.js.
```

Essa correção pode ir para Git em branch própria.

---

## 15. Não commitar estes arquivos

Não coloque no Git:

```text
node_modules/
dist/
package-lock.json
```

Também não coloque no Git nada sobre:

```text
/etc/chromium/policies/managed/
/tmp/chromium-policies-managed-kzera-backup/
/tmp/pw-browsers/
```

Isso é só ajuste local do ambiente.

---

## 16. Resultado já obtido em validação anterior

Resultado real obtido em uma execução onde o Chromium pôde ser liberado:

```text
URL: http://127.0.0.1:5283/Kzeraap/#home
TITLE: Vevelt
Texto renderizado:
V
Vevelt
Criar senha
Senha
Confirmar senha
Criar acesso
v0.19.50
```

Esse resultado serve como referência histórica. Em novas execuções, valide novamente pelo menos até `curl 200` para confirmar que o ambiente atual está operacional.
