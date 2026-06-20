const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const domainDir = path.join(root, 'src/domain/relatorio');
const applicationDir = path.join(root, 'src/application/relatorio');

assert(fs.existsSync(domainDir), 'domain/relatorio deve existir');
assert(fs.existsSync(applicationDir), 'application/relatorio deve existir');

for (const file of fs.readdirSync(domainDir).filter(name => name.endsWith('.ts'))) {
  const content = fs.readFileSync(path.join(domainDir, file), 'utf8');
  assert(!/class\s+.*(Service|UseCase|Engine|Calculator|Validator)/.test(content), `domain/relatorio/${file} nao pode conter service/usecase/engine/calculator/validator`);
  assert(!content.includes('../application/'), `domain/relatorio/${file} nao pode importar application`);
  assert(!content.includes('../infrastructure/') && !content.includes('../../infrastructure/'), `domain/relatorio/${file} nao pode importar infrastructure`);
  assert(!content.includes('../presentation/') && !content.includes('../../presentation/'), `domain/relatorio/${file} nao pode importar presentation`);
  assert(!content.includes('Repository'), `domain/relatorio/${file} nao deve declarar repository`);
}

const useCase = fs.readFileSync(path.join(applicationDir, 'GerarRelatorioOperacionalUseCase.ts'), 'utf8');
assert(useCase.includes("from '../ports/Repository'"), 'application/relatorio deve depender de ports');
assert(useCase.includes("from '../../domain/relatorio/RelatorioOperacional'"), 'application deve usar tipos de domain/relatorio');
assert(!useCase.includes('IndexedDb'), 'application/relatorio nao deve depender de IndexedDB');

console.log('relatorios-arquitetura-1194: ok');
