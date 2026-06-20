import type { Perfil } from './Perfil';

export interface PerfilBuscaFiltro {
  termo?: string;
  incluirArquivados?: boolean;
  conhecePessoalmente?: boolean;
  bairro?: string;
  municipio?: string;
  status?: Perfil['status'] | 'todos';
}

function normalizar(value: string | undefined): string {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizarTelefone(value: string | undefined): string {
  return (value || '').replace(/\D/g, '');
}

export function buscarPerfis(perfis: Perfil[], filtro: PerfilBuscaFiltro = {}): Perfil[] {
  const termo = normalizar(filtro.termo);
  const telefoneTermo = normalizarTelefone(filtro.termo);

  return perfis.filter(perfil => {
    if (!filtro.incluirArquivados && filtro.status !== 'todos' && perfil.status !== 'ativo') return false;
    if (filtro.status && filtro.status !== 'todos' && perfil.status !== filtro.status) return false;
    if (typeof filtro.conhecePessoalmente === 'boolean' && perfil.conhecePessoalmente !== filtro.conhecePessoalmente) return false;
    if (filtro.bairro && normalizar(perfil.bairro) !== normalizar(filtro.bairro)) return false;
    if (filtro.municipio && normalizar(perfil.municipio) !== normalizar(filtro.municipio)) return false;

    if (!termo) return true;

    const campos = [
      perfil.nome,
      perfil.codigo,
      perfil.email,
      perfil.bairro,
      perfil.municipio
    ].map(normalizar);

    const matchText = campos.some(campo => campo.includes(termo));
    const matchTelefone = telefoneTermo && normalizarTelefone(perfil.telefone).includes(telefoneTermo);

    return Boolean(matchText || matchTelefone);
  });
}
