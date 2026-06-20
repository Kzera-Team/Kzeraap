const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function exists(file) { return fs.existsSync(path.join(root, file)); }

const appVersion = read('src/app/appVersion.ts');
const pkg = read('package.json');
const analyzer = read('src/application/uxMetricas/UxExploratoryAnalyzer.ts');
const domain = read('src/domain/uxMetricas/UxMetricas.ts');
const docs = read('docs/ux/TESTE_EXPLORATORIO_UX_1.19.3.md');

assert(appVersion.includes("APP_VERSION = '1.19.5'"), 'Versão deve estar em 1.19.3.');
assert(pkg.includes('"version": "1.19.5"'), 'package.json deve estar em 1.19.3.');
assert(exists('src/application/uxMetricas/UxExploratoryAnalyzer.ts'), 'Analyzer exploratório deve existir em application.');
assert(!exists('src/domain/uxMetricas/UxExploratoryAnalyzer.ts'), 'Analyzer não pode ficar em domain.');

for (const term of [
  'UxExploratoryAnalyzer',
  'maxAcoesPorFluxo',
  'maxTempoFluxoMs',
  'maxVoltasPorFluxo',
  'maxErrosPorFluxo',
  'maxRenderizacaoLista',
  'podeSeguirParaRelatorios'
]) {
  assert(analyzer.includes(term), `Analyzer deve conter ${term}`);
}

for (const problema of ['cliques_demais', 'tempo_alto', 'voltas_demais', 'erros_demais', 'abandono', 'lista_grande']) {
  assert(analyzer.includes(problema), `Analyzer deve detectar ${problema}`);
}

for (const fluxo of [
  'criar_perfil',
  'editar_perfil',
  'buscar_perfil',
  'arquivar_perfil',
  'criar_item',
  'editar_item',
  'criar_variacao',
  'registrar_estoque',
  'separar_peso',
  'importar_perfis',
  'importar_itens',
  'confirmar_historico',
  'salvar_copia_seguranca',
  'salvar_lista',
  'configurar_codigo_perfil'
]) {
  assert(docs.includes(fluxo), `Documento 1.19.3 deve cobrir fluxo ${fluxo}`);
}

assert(docs.includes('Relatórios só devem começar'), 'Documento deve travar Relatórios até leitura de UX.');
assert(docs.includes('Não salva nome, telefone, item, valor, texto digitado'), 'Documento deve reafirmar privacidade.');
assert(!domain.includes('tempo_parado_detectado'), 'Evento removido não pode voltar.');
assert(!domain.includes('atrito_detectado'), 'Evento removido não pode voltar.');
assert(!domain.includes('campo_interagido'), 'Evento removido não pode voltar.');
assert(!analyzer.includes('pontuacaoAtrito'), 'Lógica de pontuação de atrito não pode voltar.');

console.log('ux-exploratorio-metricas-1193 ok');
