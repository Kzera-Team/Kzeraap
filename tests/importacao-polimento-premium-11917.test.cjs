const fs = require('fs');
const css = fs.readFileSync('public/styles.css', 'utf8');
const tabs = fs.readFileSync('src/presentation/importacao/components/ImportacaoTabs.ts', 'utf8');

function mustInclude(label, text) {
  if (!css.includes(text)) {
    throw new Error(`Faltou CSS obrigatório: ${label}`);
  }
}

mustInclude('painel com largura útil', 'width: calc(100vw - 28px) !important;');
mustInclude('topo reduzido', 'padding: max(88px, calc(env(safe-area-inset-top) + 76px)) 0 0 !important;');
mustInclude('menu 58px', 'height: 58px !important;');
mustInclude('menu 1.25fr', 'grid-template-columns: 1fr 1fr 1.25fr !important;');
mustInclude('arquivo colunas', 'grid-template-columns: 64px minmax(0, 1fr) auto !important;');
mustInclude('botao trocar minimo', 'min-width: 94px !important;');
mustInclude('input 54px', 'height: 54px !important;');
mustInclude('badge 42px', 'height: 42px !important;');
mustInclude('botao importar 58px', 'height: 58px !important;');
mustInclude('sombra premium', 'box-shadow: 0 10px 24px rgba(30, 14, 70, 0.07) !important;');

if (!tabs.includes("label: 'Transações'")) {
  throw new Error('A aba final deve ser visualmente Transações, não Transações/Financeiro.');
}

if (tabs.includes('Transações/Financeiro')) {
  throw new Error('Não pode aparecer Transações/Financeiro nas abas compactas.');
}

console.log('importacao-polimento-premium-11917 ok');
