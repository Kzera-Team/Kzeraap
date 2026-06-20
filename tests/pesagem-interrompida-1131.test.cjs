const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = process.cwd();
function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

const domain = read('src/domain/operacao/PesagemRapida.ts');
assert(domain.includes('LIMITE_INTERRUPCAO_PESAGEM_MS'), 'domínio deve definir limite operacional de interrupção');
assert(domain.includes('deveMarcarPesagemComoInterrompida'), 'domínio deve detectar sessão abandonada sem pausa');
assert(domain.includes('marcarSessaoPesagemInterrompida'), 'domínio deve marcar sessão como interrompida');
assert(domain.includes("status: 'interrompida'"), 'sessão precisa ter estado interrompida persistível');
assert(domain.includes("sessao.status === 'interrompida'"), 'retomar precisa aceitar sessão interrompida');

const useCase = read('src/application/item/PesagemRapidaFracionamentoUseCase.ts');
assert(useCase.includes('normalizarSessoesInterrompidas'), 'use case deve normalizar sessões interrompidas antes da ação');
assert(useCase.includes('marcarSessaoPesagemInterrompida'), 'use case deve persistir status interrompida quando houver ação de retomada');
assert(useCase.includes("sessao.status === 'interrompida'"), 'use case deve tratar sessão interrompida como aberta');

const renderer = read('src/presentation/item/renderers/LoteOperacionalRenderer.ts');
assert(renderer.includes('statusOperacionalSessaoPesagem'), 'UI deve calcular status operacional ao renderizar');
assert(renderer.includes('continuação pendente'), 'UI deve avisar continuação pendente');
assert(renderer.includes('Nenhum peso foi perdido'), 'UI deve tranquilizar sem esconder o risco operacional');
assert(renderer.includes('▶️ Continuar'), 'UI deve oferecer botão textual de continuar');
assert(renderer.includes('atalhosDesabilitados'), 'UI deve bloquear atalhos até a sessão ser retomada');

const docs = read('docs/PESAGEM_INTERROMPIDA_1.13.1.md');
assert(docs.includes('ir ao banheiro'), 'documento deve registrar o cenário real da Usuária');
assert(docs.includes('não inventa horário exato'), 'documento deve impedir horário inventado na interrupção');

const appVersion = read('src/app/appVersion.ts');
assert(appVersion.includes("1.19.5"), 'appVersion deve estar em 1.13.1');
console.log('pesagem-interrompida-1131 ok');
