const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const template = fs.readFileSync('src/domain/perfil/PerfilImportacaoTemplate.ts', 'utf8');
const parser = fs.readFileSync('src/domain/perfil/PerfilImportacaoParser.ts', 'utf8');

assert(template.includes("campo: 'telefone'"), 'Template deve manter campo interno telefone.');
assert(template.includes("aliases: ['celular']"), 'Telefone deve aceitar somente alias celular.');
assert(!template.includes("'telefone', 'whatsapp'"), 'Alias telefone/whatsapp não pode alimentar telefone.');
assert(template.includes("'Celular'"), 'Colunas recomendadas devem orientar Celular, não Telefone.');
assert(parser.includes('resolvePerfilImportField(header)'), 'Parser deve mapear colunas pelo template atualizado.');

console.log('perfil-importacao-celular-unico-11912.test.cjs OK');
