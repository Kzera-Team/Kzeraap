import {
  ImportacaoFinanceiraError,
  type EscopoImportacaoFinanceira,
  type RegistroImportacaoFinanceira
} from './ImportacaoFinanceira';

export function exigirEscopo(scope: EscopoImportacaoFinanceira): void {
  if (!scope.usuarioId.trim()) throw new ImportacaoFinanceiraError('USUARIO_OBRIGATORIO', 'Usuária obrigatória para a importação.');
  if (!scope.loteId.trim()) throw new ImportacaoFinanceiraError('LOTE_OBRIGATORIO', 'Lote obrigatório para a importação.');
}

export function pertenceAoEscopo(entity: EscopoImportacaoFinanceira, scope: EscopoImportacaoFinanceira): boolean {
  return entity.usuarioId === scope.usuarioId && entity.loteId === scope.loteId;
}

export function exigirPertencimento(entity: EscopoImportacaoFinanceira, scope: EscopoImportacaoFinanceira): void {
  exigirEscopo(scope);
  if (!pertenceAoEscopo(entity, scope)) {
    throw new ImportacaoFinanceiraError('ESCOPO_VIOLADO', 'Registro fora do escopo da usuária ou do lote.');
  }
}

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object).sort().map(key => `${JSON.stringify(key)}:${stableStringify(object[key])}`).join(',')}}`;
}

export function hashDeterministico(input: string): string {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function fingerprintRegistro(tipo: string, dados: unknown): string {
  return `${tipo}:${hashDeterministico(stableStringify(dados))}`;
}

export function snapshotComparavel(registro: RegistroImportacaoFinanceira): string {
  const clone = structuredClone(registro) as Partial<RegistroImportacaoFinanceira>;
  delete clone.updatedAt;
  delete clone.previaId;
  delete clone.artefatosOficiaisIds;
  delete clone.ultimaFalha;
  return stableStringify(clone);
}
