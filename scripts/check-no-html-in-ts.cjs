'use strict';

/**
 * Verifica que arquivos TypeScript fora de *Template.ts não contêm HTML inline.
 * Escopo atual: src/presentation/fidelizacao/ (módulo novo; legado migra gradualmente).
 *
 * Padrão detectado: closing tags </tag> dentro de template literals — inequívoco HTML.
 * Falso-negativo aceitável: tag de abertura sem fechamento detectada (raro e inofensivo).
 */

const fs = require('fs');
const path = require('path');

const CLOSING_TAG_IN_TEMPLATE = /`[^`]*<\/[a-zA-Z][a-zA-Z0-9]*/s;
const ALLOWED_SUFFIX = 'Template.ts';

// Módulos protegidos pela trava (adicionar novos módulos aqui conforme migração)
const GUARDED_DIRS = [
  path.join(__dirname, '..', 'src', 'presentation', 'fidelizacao'),
];

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, results);
    } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
      results.push(full);
    }
  }
  return results;
}

const violations = [];

for (const dir of GUARDED_DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const file of walk(dir)) {
    if (file.endsWith(ALLOWED_SUFFIX)) continue;
    const content = fs.readFileSync(file, 'utf8');
    if (CLOSING_TAG_IN_TEMPLATE.test(content)) {
      violations.push(path.relative(process.cwd(), file));
    }
  }
}

if (violations.length > 0) {
  console.error('\n[TRAVA] HTML inline encontrado em arquivo TypeScript que não é *Template.ts:');
  violations.forEach(f => console.error('  - ' + f));
  console.error('\nRegra: HTML pertence a *Template.ts. Mova o markup e importe a função/constante.\n');
  process.exit(1);
}

console.log('[OK] Nenhum HTML inline fora de *Template.ts em módulos protegidos.');
