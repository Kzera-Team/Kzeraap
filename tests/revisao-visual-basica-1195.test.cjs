const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = [
  'src/presentation/perfil/templates/PerfilTemplate.ts',
  'src/presentation/item/templates/ItemCatalogoTemplate.ts',
  'src/presentation/configuracoes/ConfiguracoesOperacionaisView.ts',
  'src/app/createKzeraAuthenticatedApp.ts'
];

function stripTags(value) {
  return value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

for (const relative of files) {
  const content = fs.readFileSync(path.join(root, relative), 'utf8');

  const operationalTitleRegex = /<div class="kzera-operational-title">([\s\S]*?)<\/div>/g;
  let match;
  while ((match = operationalTitleRegex.exec(content))) {
    const block = match[1];
    const eyebrow = block.match(/<span class="eyebrow">([^<]+)<\/span>/)?.[1]?.trim();
    const heading = block.match(/<h1>([^<]+)<\/h1>/)?.[1]?.trim();
    if (eyebrow && heading) {
      assert.notStrictEqual(
        eyebrow.toLowerCase(),
        heading.toLowerCase(),
        `${relative} repete "${heading}" no apoio e no título principal`
      );
    }
  }

  const repeatedVisualWords = [
    /<span class="eyebrow">Perfis<\/span><h1>Perfis<\/h1>/,
    /<span class="eyebrow">Itens<\/span><h1>Itens<\/h1>/,
    /<span class="eyebrow">Configurações<\/span><h1>Configurações<\/h1>/,
    /<span class="eyebrow">Importação<\/span><h1>Importação<\/h1>/
  ];

  for (const pattern of repeatedVisualWords) {
    assert(!pattern.test(content), `${relative} mantém repetição visual básica bloqueadora`);
  }
}

const perfilTemplate = fs.readFileSync(path.join(root, 'src/presentation/perfil/templates/PerfilTemplate.ts'), 'utf8');
assert(perfilTemplate.includes('<span class="eyebrow">Área de trabalho</span><h1>Perfis</h1>'), 'Tela Perfis deve diferenciar apoio visual e título');
assert(!perfilTemplate.includes('<span class="eyebrow">Perfis</span><h1>Perfis</h1>'), 'Tela Perfis não pode repetir título em sequência');

const checklist = fs.readFileSync(path.join(root, 'docs/governanca/06_CHECKLIST_ENTREGA_OBRIGATORIO.md'), 'utf8');
assert(/revisão visual/i.test(checklist), 'Checklist obrigatório deve exigir revisão visual');
assert(/duplicad[oa]/i.test(checklist), 'Checklist obrigatório deve bloquear texto/título duplicado');

console.log('revisao-visual-basica-1195: ok');
