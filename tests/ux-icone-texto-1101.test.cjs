const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const appVersion = fs.readFileSync(path.join(root, 'src/app/appVersion.ts'), 'utf8');
const card = fs.readFileSync(path.join(root, 'src/presentation/item/renderers/ItemCardRenderer.ts'), 'utf8');
const licoes = fs.readFileSync(path.join(root, 'docs/governanca/05_LICOES_APRENDIDAS.md'), 'utf8');
const resumo = fs.readFileSync(path.join(root, 'docs/governanca/07_LICOES_RESUMO_RAPIDO.md'), 'utf8');
const checklist = fs.readFileSync(path.join(root, 'docs/governanca/06_CHECKLIST_ENTREGA_OBRIGATORIO.md'), 'utf8');
const doc = fs.readFileSync(path.join(root, 'docs/UX_ICONES_BOTOES_1.10.1.md'), 'utf8');
const estado = fs.readFileSync(path.join(root, 'docs/governanca/04_ESTADO_ATUAL_OFICIAL.md'), 'utf8');

assert.strictEqual(pkg.version, '1.19.5', 'Versão atual deve refletir última funcionalidade relevante.');
assert(appVersion.includes("APP_VERSION = '1.19.5'"), 'APP_VERSION deve estar em 1.12.0.');
assert(card.includes('>📦 Estoque</button>'), 'Botão deve permitir ícone com texto claro.');
assert(!card.includes('>📦</button>'), 'Botão de lote não pode depender de ícone sozinho.');
assert(licoes.includes('O erro não é ter ícone; é esperar que o usuário seja vidente.'), 'Lições devem registrar a nuance correta sobre ícones.');
assert(resumo.includes('Ícone pode, mas não sozinho'), 'Resumo rápido deve fixar a regra de ícone com clareza.');
assert(checklist.includes('ícone sozinho em ação não óbvia'), 'Checklist deve barrar ícone sozinho quando não for óbvio.');
assert(doc.includes('ícone + texto'), 'Documento 1.10.1 deve explicar ícone + texto.');
assert(estado.includes('1.10.1 — Ícone permitido com texto'), 'Estado atual deve registrar o ajuste 1.10.1.');

console.log('ux icone texto 1.10.1 ok');
