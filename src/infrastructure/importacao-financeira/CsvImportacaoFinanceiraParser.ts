import type { ImportacaoFinanceiraParserPort, ParsedImportacaoRow } from '../../application/importacao-financeira/ImportacaoFinanceiraPorts';

function normalizeHeader(header: string): string {
  return header.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function parseNumber(value: string | undefined): number {
  const raw = String(value ?? '').replace(/R\$/gi, '').replace(/\s/g, '');
  if (!raw) return 0;
  const normalized = raw.includes(',') ? raw.replace(/\./g, '').replace(',', '.') : raw;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function get(row: Record<string, string>, ...names: string[]): string {
  const keys = new Map(Object.keys(row).map(key => [normalizeHeader(key), key]));
  for (const name of names) {
    const key = keys.get(normalizeHeader(name));
    if (key) return row[key] || '';
  }
  return '';
}

function parseDelimited(content: string): Record<string, string>[] {
  const text = content.replace(/^\uFEFF/, '').trim();
  if (!text) return [];
  const firstLine = text.split(/\r?\n/, 1)[0] || '';
  const separator = ['\t', ';', ','].sort((a, b) => firstLine.split(b).length - firstLine.split(a).length)[0] || ';';
  const records: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"') {
      if (quoted && next === '"') { cell += '"'; index += 1; }
      else quoted = !quoted;
      continue;
    }
    if (!quoted && char === separator) { row.push(cell.trim()); cell = ''; continue; }
    if (!quoted && (char === '\n' || char === '\r')) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(cell.trim());
      if (row.some(value => value)) records.push(row);
      row = [];
      cell = '';
      continue;
    }
    cell += char;
  }
  row.push(cell.trim());
  if (row.some(value => value)) records.push(row);
  const headers = records.shift() || [];
  return records.map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] || ''])));
}

function paymentTypes(value: string): string[] {
  const values = value.split(/[,/;+]/).map(item => normalizeHeader(item)).filter(Boolean);
  return values.length ? Array.from(new Set(values)) : ['outro'];
}

export class CsvImportacaoFinanceiraParser implements ImportacaoFinanceiraParserPort {
  parseTransacoes(conteudo: string): ParsedImportacaoRow[] {
    return parseDelimited(conteudo).map((row, index) => {
      const total = parseNumber(get(row, 'Total'));
      const custo = parseNumber(get(row, 'Custo'));
      return {
        tipo: 'transacao',
        linha: index + 2,
        dadosBrutos: row,
        dadosNormalizados: {
          numero: get(row, 'Número', 'Numero', '#').replace(/^#/, '').trim() || undefined,
          clienteNome: get(row, 'Cliente').trim(),
          dataTransacao: get(row, 'Data'),
          descricao: get(row, 'Descrição', 'Descricao'),
          total,
          valorPago: parseNumber(get(row, 'Valor Pago')),
          custo,
          lucro: parseNumber(get(row, 'Lucro')) || Math.round((total - custo) * 100) / 100,
          tiposPagamento: paymentTypes(get(row, 'Tipos de Pagamento'))
        }
      };
    });
  }

  parseFinanceiro(conteudo: string): ParsedImportacaoRow[] {
    return parseDelimited(conteudo).map((row, index) => {
      const descricao = get(row, 'Descrição', 'Descricao');
      const reference = descricao.match(/#\s*(\d+)/)?.[1];
      return {
        tipo: 'financeiro',
        linha: index + 2,
        dadosBrutos: row,
        dadosNormalizados: {
          numeroTransacaoReferenciado: reference,
          clienteNome: get(row, 'Cliente').trim(),
          dataPagamento: get(row, 'Data do Pagamento', 'Data de Criação', 'Data de Criacao'),
          valor: parseNumber(get(row, 'Valor')),
          valorPago: parseNumber(get(row, 'Valor Pago')),
          metodoPagamento: normalizeHeader(get(row, 'Método de Pagamento', 'Metodo de Pagamento')) || 'outro',
          pago: normalizeHeader(get(row, 'Pago')).startsWith('sim')
        }
      };
    });
  }
}
