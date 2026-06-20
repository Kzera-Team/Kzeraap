import type { PerfilImportacaoLinha } from './PerfilImportacao';
import { resolvePerfilImportField } from './PerfilImportacaoTemplate';

export interface PerfilImportacaoParseResult {
  linhas: PerfilImportacaoLinha[];
  colunasIgnoradas: string[];
  erros: string[];
}

function detectDelimiter(content: string): ',' | ';' | '\t' {
  const firstLine = content.split(/\r?\n/)[0] || '';
  const candidates: Array<',' | ';' | '\t'> = [',', ';', '\t'];

  return candidates
    .map(delimiter => ({ delimiter, count: firstLine.split(delimiter).length }))
    .sort((a, b) => b.count - a.count)[0]?.delimiter || ',';
}

function parseDelimitedLine(line: string, delimiter: string): string[] {
  const values: string[] = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index++) {
    const char = line[index] || '';
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index++;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === delimiter && !quoted) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function buildLinha(record: Record<string, string>): PerfilImportacaoLinha {
  const linha: PerfilImportacaoLinha = {
    nome: record.nome || ''
  };

  if (record.telefone) linha.telefone = record.telefone;
  if (record.email) linha.email = record.email;
  if (record.bairro) linha.bairro = record.bairro;
  if (record.cidade) linha.cidade = record.cidade;

  return linha;
}

export function parsePerfilImportacaoCsvTsv(content: string): PerfilImportacaoParseResult {
  const clean = content.replace(/^\uFEFF/, '').trim();

  if (!clean) {
    return {
      linhas: [],
      colunasIgnoradas: [],
      erros: ['Arquivo vazio.']
    };
  }

  const delimiter = detectDelimiter(clean);
  const lines = clean.split(/\r?\n/).filter(line => line.trim());

  const first = lines[0];
  if (!first) {
    return {
      linhas: [],
      colunasIgnoradas: [],
      erros: ['Arquivo sem cabeçalho.']
    };
  }

  const headers = parseDelimitedLine(first, delimiter);

  const mapped = headers.map(header => ({
    header,
    field: resolvePerfilImportField(header)
  }));

  const colunasIgnoradas = mapped
    .filter(item => !item.field)
    .map(item => item.header);

  const linhas: PerfilImportacaoLinha[] = [];

  for (const line of lines.slice(1)) {
    const values = parseDelimitedLine(line, delimiter);
    const record: Record<string, string> = {};

    mapped.forEach((item, index) => {
      if (!item.field) return;

      const value = values[index] || '';
      const current = record[item.field];

      if (value.trim()) {
        record[item.field] = value;
        return;
      }

      if (current === undefined) {
        record[item.field] = '';
      }
    });

    linhas.push(buildLinha(record));
  }

  return {
    linhas,
    colunasIgnoradas,
    erros: []
  };
}
