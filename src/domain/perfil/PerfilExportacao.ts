import type { Perfil } from './Perfil';

export interface PerfilExportacaoOptions {
  incluirArquivados?: boolean;
  incluirNomeReal?: boolean;
}

export interface PerfilExportacaoLinha {
  perfil: string;
  telefone?: string;
  email?: string;
  bairro?: string;
  municipio?: string;
  conhecePessoalmente: boolean;
  status: Perfil['status'];
}

function setOptional<K extends keyof PerfilExportacaoLinha>(
  target: PerfilExportacaoLinha,
  key: K,
  value: PerfilExportacaoLinha[K] | undefined
): void {
  if (value !== undefined) {
    Object.assign(target, { [key]: value });
  }
}

export function prepararPerfisParaExportacao(
  perfis: Perfil[],
  options: PerfilExportacaoOptions = {}
): PerfilExportacaoLinha[] {
  return perfis
    .filter(perfil => options.incluirArquivados || perfil.status === 'ativo')
    .map(perfil => {
      const linha: PerfilExportacaoLinha = {
        perfil: options.incluirNomeReal ? perfil.nome : (perfil.codigo || 'Sem codigo'),
        conhecePessoalmente: perfil.conhecePessoalmente,
        status: perfil.status
      };

      if (options.incluirNomeReal) {
        setOptional(linha, 'telefone', perfil.telefone);
        setOptional(linha, 'email', perfil.email);
        setOptional(linha, 'bairro', perfil.bairro);
        setOptional(linha, 'municipio', perfil.municipio);
      }

      return linha;
    });
}

export function perfisExportacaoParaCsv(linhas: PerfilExportacaoLinha[]): string {
  const headers = ['Perfil', 'Telefone', 'E-mail', 'Bairro', 'Cidade', 'Conhece Pessoalmente', 'Status'];

  const escape = (value: unknown) => {
    const text = String(value ?? '');
    return `"${text.replace(/"/g, '""')}"`;
  };

  const rows = linhas.map(linha => [
    linha.perfil,
    linha.telefone || '',
    linha.email || '',
    linha.bairro || '',
    linha.municipio || '',
    linha.conhecePessoalmente ? 'Sim' : 'Não',
    linha.status
  ].map(escape).join(','));

  return [headers.map(escape).join(','), ...rows].join('\n');
}
