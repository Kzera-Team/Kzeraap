export const CIDADE_PADRAO_IMPORTACAO_CLIENTE = 'Brasília';
export const CIDADE_PADRAO_IMPORTACAO_PERFIL = CIDADE_PADRAO_IMPORTACAO_CLIENTE;

export interface PerfilImportacaoLinha {
  nome: string;
  telefone?: string;
  email?: string;
  bairro?: string;
  cidade?: string;
}

export interface PerfilImportacaoPreviewRegistro {
  index: number;
  nome: string;
  telefone?: string;
  email?: string;
  bairro?: string;
  cidade: string;
  conhecePessoalmente: boolean;
  valido: boolean;
  erros: string[];
  excluido?: boolean;
}

function setOptional<T extends object, K extends keyof PerfilImportacaoPreviewRegistro>(
  target: T,
  key: K,
  value: PerfilImportacaoPreviewRegistro[K] | undefined
): void {
  if (value !== undefined && value !== '') {
    Object.assign(target, { [key]: value });
  }
}

export function normalizarTelefoneBrasil(value = ''): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function validarPreviewImportacaoPerfil(registro: PerfilImportacaoPreviewRegistro): string[] {
  const erros: string[] = [];

  if (!registro.nome.trim()) {
    erros.push('Nome é obrigatório.');
  }

  if (!registro.telefone?.trim()) {
    erros.push('Telefone é obrigatório.');
  }

  return erros;
}

export function criarPreviewImportacaoPerfil(
  linhas: PerfilImportacaoLinha[]
): PerfilImportacaoPreviewRegistro[] {
  return linhas.map((linha, index) => {
    const nome = (linha.nome || '').trim();
    const bairro = (linha.bairro || '').trim();

    const preview: PerfilImportacaoPreviewRegistro = {
      index,
      nome,
      cidade: CIDADE_PADRAO_IMPORTACAO_PERFIL,
      conhecePessoalmente: false,
      valido: true,
      erros: []
    };

    setOptional(preview, 'telefone', normalizarTelefoneBrasil(linha.telefone || ''));
    setOptional(preview, 'email', linha.email?.trim());
    setOptional(preview, 'bairro', bairro || undefined);

    const erros = validarPreviewImportacaoPerfil(preview);

    return {
      ...preview,
      valido: erros.length === 0,
      erros
    };
  });
}
