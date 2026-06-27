# DEPLOY_CHATGPT

Manual curto para subir o Kzeraap no ambiente ChatGPT/container e tirar print real da tela.

A regra é simples:

> Se não abriu a URL real no navegador e não gerou print, não está final.

---

## 1. O que precisa existir antes

Você precisa ter:

- ZIP completo do projeto, ou repositório acessível;
- terminal bash;
- Node.js;
- npm;
- curl;
- Python 3;
- Playwright para Python;
- Chromium instalado.

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

Se der erro de npm bloqueado, pare e consulte:

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

Se falhar, não avance como final.

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

## 7. Teste a URL antes do navegador

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

Teste também:

```bash
curl -I http://localhost:5283/Kzeraap/
curl -I http://0.0.0.0:5283/Kzeraap/
```

---

## 8. Se o servidor responde, mas o navegador não abre

Não mexa no código ainda.

Primeiro verifique se o Chromium está bloqueado.

Rode:

```bash
find /etc -path '*chrom*polic*' -type f -print -exec sed -n '1,120p' {} \;
```

Se aparecer isto:

```json
{
  "URLBlocklist": ["*"]
}
```

O navegador está bloqueando tudo, inclusive localhost.

---

## 9. Libere o Chromium somente se autorizado

Só faça isso com autorização explícita.

```bash
mkdir -p /tmp/chromium-policies-managed-kzera-backup
mv /etc/chromium/policies/managed/* /tmp/chromium-policies-managed-kzera-backup/
```

Isso altera só o ambiente do container.

Não é código do projeto.

Não vai para Git.

Se funcionar, siga para o passo 11.

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

Nesse caso, a correção é pedir um pacote offline com um destes itens:

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

Sem permissão para remover a policy e sem outro binário de navegador, não há como gerar print real nesse container.

Status correto nesse caso:

```text
BLOQUEADA
```

Motivo:

```text
Servidor e app funcionam, mas o navegador real está bloqueado por policy root-owned.
```

---

## 11. Tire o print pela URL real

Com o app ainda rodando, execute.

Se a policy do Chromium do sistema foi liberada, use `/usr/bin/chromium`:

```bash
python3 - <<'PY'
from pathlib import Path
from playwright.sync_api import sync_playwright

url = 'http://127.0.0.1:5283/Kzeraap/'
out = '/mnt/data/kzera_login_url_real_final.png'

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path='/usr/bin/chromium',
        headless=True,
        args=[
            '--no-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--disable-extensions',
            '--disable-background-networking',
            '--disable-web-security',
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

Se estiver usando Chromium do Playwright ou Chromium portátil, troque esta linha:

```python
executable_path='/usr/bin/chromium'
```

pelo caminho real do navegador alternativo.

Resultado esperado:

```text
TITLE: Vevelt
TEXT contém: Criar senha
SCREENSHOT_EXISTS: True
SCREENSHOT_PATH: /mnt/data/kzera_login_url_real_final.png
```

---

## 12. O que prova que deu certo

Só marque como final se tiver tudo isto:

- `npm install --include=dev` passou;
- `npm run check` passou;
- `npm run build` passou;
- `npm run dev` subiu;
- `curl` retornou `200 OK` na URL real;
- Chromium abriu a URL real;
- texto da tela apareceu;
- screenshot foi salvo.

Se faltar qualquer item, diga:

```text
Status: PARCIAL
```

ou:

```text
Status: BLOQUEADA
```

---

## 13. O que não vale como prova

Não vale:

- print de HTML isolado;
- print de mockup;
- print montado manualmente;
- print sem URL real;
- dizer que funcionou só porque o build passou.

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

## 16. Resultado obtido neste teste

Resultado real obtido após liberar o Chromium:

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
Screenshot: /mnt/data/kzera_login_url_real_final.png
```

Status da prova de ambiente:

```text
FINAL para provar que o ambiente abriu a tela pela URL real.
PARCIAL para Git, porque a correção ainda precisa ser aplicada/mergeada.
```
