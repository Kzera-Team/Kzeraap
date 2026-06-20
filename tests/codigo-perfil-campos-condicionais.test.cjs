const fs = require('fs');
function assert(condition, message) { if (!condition) throw new Error(message); }
const app = fs.readFileSync('src/app/createKzeraAuthenticatedApp.ts', 'utf8');
assert(app.includes("const textField = part.type === 'staticText'"), 'Campo Texto livre deve ser renderizado somente para tipo Texto livre.');
assert(app.includes("const columnField = part.type === 'column'"), 'Campo Coluna deve ser renderizado somente para tipo Coluna.');
assert(app.includes("const extractionField = part.type === 'column'"), 'Regra de extração deve aparecer somente para blocos do tipo Coluna.');
assert(!app.includes('<label data-column-row><span>Coluna</span><select data-code-field="column">${optionList(FIELD_LABELS, column)}</select></label>\n    <label data-column-row><span>Regra de extração'), 'Campos de Coluna não podem ficar renderizados sempre no bloco.');
console.log('codigo-perfil-campos-condicionais.test.cjs OK');
