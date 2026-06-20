import type { ItemImportacaoLinha } from './ItemImportacao';
import type { ItemUnidade } from './ItemCatalogo';

export interface ItemImportacaoParseResult {
  linhas: ItemImportacaoLinha[];
  colunasIgnoradas: string[];
  erros: string[];
}

const UNIDADES_VALIDAS: ItemUnidade[] = ['un', 'g', 'mg', 'ml', 'kg', 'l'];

function normalizarHeader(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function campoPorHeader(header: string): string | null {
  const h = normalizarHeader(header);
  const mapa: Record<string, string> = {
    nome: 'nome',
    item: 'nome',
    categoria: 'variacaoNome',
    variacao: 'variacaoNome',
    'variação': 'variacaoNome',
    'nome da variacao': 'variacaoNome',
    'nome da variação': 'variacaoNome',
    'categoria real': 'categoriaReal',
    descricao: 'descricao',
    tags: 'tags',
    unidade: 'unidade',
    observacao: 'observacao',
    obs: 'observacao',
    custo: 'custoLote',
    'custo lote': 'custoLote',
    estoque: 'quantidadeLote',
    quantidade: 'quantidadeLote',
    'quantidade lote': 'quantidadeLote',
    'estoque atual': 'quantidadeLote',
    preco: 'valorLote',
    valor: 'valorLote',
    'valor lote': 'valorLote',
    'preco 1+': 'valorLote',
    lote: 'loteNome' 
  };

  return mapa[h] || null;
}

function detectarSeparador(content: string): ',' | ';' | '\t' {
  const firstLine = content.split(/\r?\n/)[0] || '';
  const candidates: Array<',' | ';' | '\t'> = [',', ';', '\t'];

  return candidates
    .map(delimiter => ({ delimiter, count: firstLine.split(delimiter).length }))
    .sort((a, b) => b.count - a.count)[0]?.delimiter || ',';
}

function parseLine(line: string, delimiter: string): string[] {
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

function numero(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function unidade(value: string | undefined): ItemUnidade {
  const normalized = (value || 'un').trim().toLowerCase() as ItemUnidade;
  return UNIDADES_VALIDAS.includes(normalized) ? normalized : 'un';
}

function buildLinha(record: Record<string, string>): ItemImportacaoLinha {
  const linha: ItemImportacaoLinha = {
    nome: record.nome || '',
    categoria: record.variacaoNome || '',
    variacaoNome: record.variacaoNome || '',
    unidade: unidade(record.unidade)
  };

  const custoLote = numero(record.custoLote);
  const quantidadeLote = numero(record.quantidadeLote);
  const valorLote = numero(record.valorLote);

  if (custoLote !== undefined) linha.custoLote = custoLote;
  if (quantidadeLote !== undefined) linha.quantidadeLote = quantidadeLote;
  if (valorLote !== undefined) linha.valorLote = valorLote;
  if (record.categoriaReal) linha.categoriaReal = record.categoriaReal;
  if (record.loteNome) linha.loteNome = record.loteNome;
  if (record.descricao) linha.descricao = record.descricao;
  if (record.observacao) linha.observacao = record.observacao;
  if (record.tags) linha.tags = record.tags.split('|').map(tag => tag.trim()).filter(Boolean);

  return linha;
}

export function parseItemImportacaoCsvTsv(content: string): ItemImportacaoParseResult {
  const clean = content.replace(/^\uFEFF/, '').trim();

  if (!clean) {
    return { linhas: [], colunasIgnoradas: [], erros: ['Arquivo vazio.'] };
  }

  const delimiter = detectarSeparador(clean);
  const lines = clean.split(/\r?\n/).filter(line => line.trim());
  const first = lines[0];

  if (!first) {
    return { linhas: [], colunasIgnoradas: [], erros: ['Arquivo sem cabeçalho.'] };
  }

  const headers = parseLine(first, delimiter);
  const mapped = headers.map(header => ({ header, field: campoPorHeader(header) }));
  const colunasIgnoradas = mapped.filter(item => !item.field).map(item => item.header);
  const linhas: ItemImportacaoLinha[] = [];

  for (const line of lines.slice(1)) {
    const values = parseLine(line, delimiter);
    const record: Record<string, string> = {};

    mapped.forEach((item, index) => {
      if (item.field) record[item.field] = values[index] || '';
    });

    linhas.push(buildLinha(record));
  }

  return { linhas, colunasIgnoradas, erros: [] };
}
