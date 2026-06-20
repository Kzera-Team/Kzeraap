const fs = require('fs');
const path = require('path');

const root = process.cwd();
const backlog = path.join(root, 'docs', 'backlog', 'LIMPEZA_FINAL_VOCABULARIO_OFICIAL.md');
if (!fs.existsSync(backlog)) {
  throw new Error('Backlog de limpeza final de vocabulário oficial não encontrado.');
}
const text = fs.readFileSync(backlog, 'utf8');
for (const termo of ['Perfil', 'Item', 'Transação']) {
  if (!text.includes(termo)) {
    throw new Error(`Termo oficial ausente no backlog final: ${termo}`);
  }
}
for (const trecho of ['Última ação do projeto', 'código-fonte', 'testes', 'documentação', 'comentários', 'histórico preservado']) {
  if (!text.includes(trecho)) {
    throw new Error(`Escopo ausente no backlog final: ${trecho}`);
  }
}
if (!text.includes('Não executar agora')) {
  throw new Error('Backlog final precisa deixar claro que não é para executar agora.');
}
console.log('backlog-limpeza-vocabulario-final-1154.test.cjs OK');
