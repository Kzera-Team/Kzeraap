const fs = require('fs');
const css = fs.readFileSync('public/styles.css', 'utf8');

function mustInclude(label, text) {
  if (!css.includes(text)) {
    throw new Error(`Faltou polimento final 1.19.19: ${label}`);
  }
}

mustInclude('arquivo com terceira coluna fixa', 'grid-template-columns: 64px minmax(0, 1fr) 96px !important;');
mustInclude('arquivo com gap 14px', 'column-gap: 14px !important;');
mustInclude('botao trocar 92px', 'min-width: 92px !important;');
mustInclude('abas com sombra suave', 'box-shadow: 0 8px 20px rgba(30, 14, 70, 0.06) !important;');
mustInclude('divisoria suave entre abas', 'border-right: 1px solid rgba(221, 212, 243, 0.55) !important;');
mustInclude('checkbox 30px', 'width: 30px !important;');
mustInclude('checkbox gradiente premium', 'background: linear-gradient(180deg, #191226 0%, #0B0715 100%) !important;');
mustInclude('botao final com respiro superior', 'margin-top: 24px !important;');
mustInclude('botao final com respiro inferior', 'margin-bottom: 28px !important;');
mustInclude('botao final 60px', 'height: 60px !important;');

console.log('importacao-polimento-final-11919 ok');
