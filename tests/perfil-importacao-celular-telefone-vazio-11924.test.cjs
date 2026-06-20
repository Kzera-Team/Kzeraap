const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const parser = fs.readFileSync('src/domain/perfil/PerfilImportacaoParser.ts', 'utf8');
const template = fs.readFileSync('src/domain/perfil/PerfilImportacaoTemplate.ts', 'utf8');

assert(template.includes("aliases: ['celular']"), 'Coluna oficial para telefone deve continuar sendo celular.');
assert(parser.includes('const current = record[item.field]'), 'Parser deve verificar valor já importado para o campo.');
assert(parser.includes('if (value.trim())'), 'Parser deve salvar somente valor preenchido.');
assert(parser.includes('if (current === undefined)'), 'Parser não pode sobrescrever valor preenchido com coluna vazia posterior.');
assert(parser.includes("record[item.field] = value"), 'Parser deve salvar valor preenchido no campo interno.');

console.log('perfil-importacao-celular-telefone-vazio-11924.test.cjs OK');
