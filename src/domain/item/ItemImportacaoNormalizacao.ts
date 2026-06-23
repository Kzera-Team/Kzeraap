export function normalizarNomeItemImportacao(valor: string): string {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

export function nomesItemImportacaoIguais(a: string, b: string): boolean {
  return normalizarNomeItemImportacao(a) === normalizarNomeItemImportacao(b);
}

export function nomeImportadoContemItemBase(nomeImportado: string, nomeBase: string): boolean {
  const importado = normalizarNomeItemImportacao(nomeImportado);
  const base = normalizarNomeItemImportacao(nomeBase);

  if (!importado || !base) return false;
  if (importado === base) return true;

  return importado.startsWith(`${base} `) || importado.endsWith(` ${base}`);
}

export function extrairVariacaoDoNomeImportado(nomeImportado: string, nomeBase: string): string {
  const importado = normalizarNomeItemImportacao(nomeImportado);
  const base = normalizarNomeItemImportacao(nomeBase);

  if (!importado || !base || importado === base) return '';
  if (importado.startsWith(`${base} `)) return nomeImportado.slice(nomeBase.length).trim();
  if (importado.endsWith(` ${base}`)) return nomeImportado.slice(0, -nomeBase.length).trim();

  return '';
}
