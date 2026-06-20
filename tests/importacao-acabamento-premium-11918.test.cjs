const fs = require('fs');
const css = fs.readFileSync('public/styles.css', 'utf8');

function mustInclude(label, text) {
  if (!css.includes(text)) {
    throw new Error(`Faltou ajuste premium 1.19.18: ${label}`);
  }
}

mustInclude('cards menos altos', 'padding: 16px !important;');
mustInclude('inputs 52px', 'height: 52px !important;');
mustInclude('input 16px', 'font-size: 16px !important;');
mustInclude('nome 17px', 'font-size: 17px !important;');
mustInclude('checkbox refinado', 'background: #141021 !important;');
mustInclude('checkbox com brilho interno', 'box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08) !important;');
mustInclude('label maior', 'font-size: 13.5px !important;');
mustInclude('titulo forte', 'font-size: 25px !important;');
mustInclude('botao gradiente', 'background: linear-gradient(180deg, #241044 0%, #18082F 100%) !important;');
mustInclude('sombra premium', 'box-shadow: 0 10px 24px rgba(30, 14, 70, 0.07) !important;');

console.log('importacao-acabamento-premium-11918 ok');
if (!css.includes('grid-template-columns: minmax(0, 1.18fr) minmax(0, 0.82fr) !important;')) {
  throw new Error('Telefone precisa ter largura maior que bairro para não cortar no iPhone.');
}
if (!css.includes('font-size: 15.4px !important;')) {
  throw new Error('Telefone precisa ficar legível sem corte visual.');
}
