# Deploy Netlify — ZIP estático manual

## Objetivo

Gerar um ZIP estático para subir manualmente no Netlify sem erro de caminho de assets.

Este modo usa caminhos relativos com `--base=./`, evitando erro com `/Kzeraap/assets`.

## 1. Projeto correto

Repositório:

```txt
jjjtestejoao-ui/Kzeraap
```

Branch:

```txt
claude/leia-agents-jose-rjkzjt
```

Nome interno do pacote:

```txt
kzera
```

Versão esperada no `package.json`:

```txt
0.19.50
```

Observação: a versão do ZIP de entrega pode ser diferente da versão interna do `package.json`. Para a entrega atual, o nome do ZIP usado é:

```txt
Kzeraap-Netlify-0.20.0-STATIC-FIXED.zip
```

## 2. Requisitos

Instalar:

- `git`
- `node`
- `npm`
- `zip`

Node obrigatório:

```txt
20 ou superior
```

Conferir:

```bash
git --version
node -v
npm -v
zip -v
```

## 3. Baixar a branch correta

```bash
git clone --branch claude/leia-agents-jose-rjkzjt --single-branch https://github.com/jjjtestejoao-ui/Kzeraap.git
cd Kzeraap
```

Conferir branch:

```bash
git branch --show-current
```

Resultado esperado:

```txt
claude/leia-agents-jose-rjkzjt
```

Conferir commit:

```bash
git rev-parse HEAD
```

Guardar esse SHA no relatório final.

## 4. Conferir nome e versão do pacote

```bash
node -p "require('./package.json').name"
node -p "require('./package.json').version"
```

Resultado esperado:

```txt
kzera
0.19.50
```

Se não bater, parar e registrar o erro.

## 5. Instalar dependências

Se existir `package-lock.json`:

```bash
npm ci
```

Se não existir:

```bash
npm install
```

## 6. Rodar validação antes do build

Antes de gerar o ZIP, rodar:

```bash
npm run check
```

Se falhar, não gerar ZIP como pronto. Corrigir a falha primeiro.

Falhas conhecidas que devem bloquear a entrega:

- HTML estrutural em arquivo TypeScript não permitido;
- uso de `innerHTML` fora dos arquivos permitidos;
- erro em regra de versionamento/documentação;
- erro em teste/check configurado no projeto.

## 7. Gerar build estático

Este é o comando correto para ZIP estático:

```bash
rm -rf dist
npm exec vite -- build --base=./
```

Conferir saída:

```bash
ls dist
```

Precisa aparecer:

```txt
index.html
assets
```

## 8. Criar arquivos Netlify

```bash
printf "/* /index.html 200\n" > dist/_redirects
```

```bash
cat > dist/_headers <<'EOF'
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=()
EOF
```

Conferir:

```bash
cat dist/_redirects
cat dist/_headers
```

## 9. Conferir caminhos no `index.html`

Rodar:

```bash
grep -E "assets/|/Kzeraap/|src=|href=" dist/index.html
```

Correto: caminhos relativos, exemplo:

```html
<script type="module" crossorigin src="./assets/index-HASH.js"></script>
<link rel="stylesheet" crossorigin href="./assets/index-HASH.css">
```

Errado:

```html
<script type="module" crossorigin src="/Kzeraap/assets/index-HASH.js"></script>
```

Se aparecer `/Kzeraap/assets`, refazer build com:

```bash
rm -rf dist
npm exec vite -- build --base=./
```

## 10. Testar localmente como estático real

Opção simples com Python:

```bash
cd dist
python3 -m http.server 8080
```

Abrir:

```txt
http://localhost:8080
```

Testar:

- página abre;
- CSS carrega;
- JS carrega;
- não há tela branca;
- não há erro 404 em assets.

Depois parar o servidor com:

```txt
CTRL + C
```

Voltar:

```bash
cd ..
```

## 11. Criar ZIP correto

Entrar na pasta `dist`:

```bash
cd dist
```

Gerar ZIP:

```bash
zip -r ../Kzeraap-Netlify-0.20.0-STATIC-FIXED.zip .
```

Voltar:

```bash
cd ..
```

## 12. Conferir ZIP

```bash
unzip -l Kzeraap-Netlify-0.20.0-STATIC-FIXED.zip
```

Certo:

```txt
index.html
_headers
_redirects
assets/index-HASH.js
assets/index-HASH.css
```

Errado:

```txt
dist/index.html
dist/assets/index-HASH.js
```

Regra:

- se aparecer `dist/` dentro do ZIP, está errado;
- se `index.html` aparecer direto na raiz, está certo.

## 13. Subir no Netlify

No Netlify:

1. Sites
2. Add new site
3. Deploy manually
4. Arrastar `Kzeraap-Netlify-0.20.0-STATIC-FIXED.zip`
5. Aguardar finalizar
6. Abrir URL gerada

## 14. Teste final no Netlify

Conferir:

- página abre;
- CSS carrega;
- JS carrega;
- não há tela branca;
- recarregar página funciona;
- abrir no celular funciona.

No DevTools > Network, não pode ter erro 404 para:

```txt
assets/index-HASH.js
assets/index-HASH.css
```

## 15. Script completo automático

Criar um arquivo chamado:

```txt
gerar-netlify-static.sh
```

Conteúdo:

```bash
#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/jjjtestejoao-ui/Kzeraap.git"
BRANCH="claude/leia-agents-jose-rjkzjt"
PROJECT_DIR="Kzeraap"
PACKAGE_VERSION_EXPECTED="0.19.50"
ZIP_NAME="Kzeraap-Netlify-0.20.0-STATIC-FIXED.zip"

echo "== Limpando pasta anterior =="
rm -rf "$PROJECT_DIR"
rm -f "$ZIP_NAME"

echo "== Clonando branch correta =="
git clone --branch "$BRANCH" --single-branch "$REPO_URL" "$PROJECT_DIR"

cd "$PROJECT_DIR"

echo "== Conferindo branch =="
CURRENT_BRANCH="$(git branch --show-current)"
echo "$CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
  echo "ERRO: branch errada. Esperado: $BRANCH"
  exit 1
fi

echo "== Conferindo commit =="
git rev-parse HEAD

echo "== Conferindo package name/version =="
PACKAGE_NAME="$(node -p "require('./package.json').name")"
PACKAGE_VERSION="$(node -p "require('./package.json').version")"

echo "name: $PACKAGE_NAME"
echo "version: $PACKAGE_VERSION"

if [ "$PACKAGE_NAME" != "kzera" ]; then
  echo "ERRO: package name inesperado."
  exit 1
fi

if [ "$PACKAGE_VERSION" != "$PACKAGE_VERSION_EXPECTED" ]; then
  echo "ERRO: package version inesperada."
  echo "Esperado: $PACKAGE_VERSION_EXPECTED"
  echo "Encontrado: $PACKAGE_VERSION"
  exit 1
fi

echo "== Instalando dependências =="
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

echo "== Rodando validação do projeto =="
npm run check

echo "== Gerando build estático =="
rm -rf dist
npm exec vite -- build --base=./

echo "== Criando arquivos Netlify =="
printf "/* /index.html 200\n" > dist/_redirects

cat > dist/_headers <<'EOF'
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=()
EOF

echo "== Conferindo dist =="
if [ ! -f dist/index.html ]; then
  echo "ERRO: dist/index.html não existe."
  exit 1
fi

if [ ! -d dist/assets ]; then
  echo "ERRO: dist/assets não existe."
  exit 1
fi

echo "== Conferindo se não existe /Kzeraap/assets no index =="
if grep -q "/Kzeraap/assets" dist/index.html; then
  echo "ERRO: index.html contém /Kzeraap/assets. Build não está estático correto."
  exit 1
fi

echo "== Conferindo arquivos gerados =="
find dist -maxdepth 3 -type f | sort

echo "== Gerando ZIP =="
cd dist
zip -r "../$ZIP_NAME" .
cd ..

echo "== Conferindo ZIP =="
unzip -l "$ZIP_NAME"

echo "== Verificando se ZIP contém dist/ por engano =="
if unzip -l "$ZIP_NAME" | awk '{print $4}' | grep -q '^dist/'; then
  echo "ERRO: ZIP contém pasta dist dentro dele."
  exit 1
fi

echo "== OK =="
echo "ZIP gerado:"
echo "$PROJECT_DIR/$ZIP_NAME"
```

Rodar:

```bash
chmod +x gerar-netlify-static.sh
./gerar-netlify-static.sh
```

O ZIP final ficará em:

```txt
Kzeraap/Kzeraap-Netlify-0.20.0-STATIC-FIXED.zip
```

## 16. Relatório que o programador deve entregar

```txt
Repositório: jjjtestejoao-ui/Kzeraap
Branch: claude/leia-agents-jose-rjkzjt
Commit SHA:
Nome no package.json: kzera
Versão no package.json: 0.19.50
Comando de validação: npm run check
Comando de build: npm exec vite -- build --base=./
ZIP: Kzeraap-Netlify-0.20.0-STATIC-FIXED.zip
Teste local estático: OK ou erro descrito
Teste no Netlify: OK ou erro descrito
```

## 17. Regra de qualidade

Não entregar ZIP como pronto se `npm run check` falhar.

Se a validação falhar, corrigir primeiro e só depois gerar o pacote final.
