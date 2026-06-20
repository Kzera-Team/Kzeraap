export interface PerfilImportacaoColunaTemplate {
  campo: string;
  obrigatorio: boolean;
  aliases: string[];
}

export const CLIENTE_IMPORTACAO_TEMPLATE: PerfilImportacaoColunaTemplate[] = [
  {
    campo: 'nome',
    obrigatorio: true,
    aliases: ['nome', 'perfil', 'nome do perfil']
  },
  {
    campo: 'telefone',
    obrigatorio: true,
    aliases: ['celular']
  },
  {
    campo: 'email',
    obrigatorio: false,
    aliases: ['email', 'e-mail', 'mail']
  },
  {
    campo: 'bairro',
    obrigatorio: false,
    aliases: ['bairro']
  },
  {
    campo: 'cidade',
    obrigatorio: false,
    aliases: ['cidade', 'município', 'municipio']
  },
  {
    campo: 'observacoes',
    obrigatorio: false,
    aliases: ['observação', 'observacao', 'observações', 'observacoes', 'obs']
  }
];

export const CLIENTE_IMPORTACAO_COLUNAS_RECOMENDADAS = [
  'Nome',
  'Celular',
  'E-mail',
  'Bairro',
  'Cidade',
  'Observação'
];

export function normalizeImportHeader(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

export function resolvePerfilImportField(header: string): string | null {
  const normalized = normalizeImportHeader(header);

  for (const column of CLIENTE_IMPORTACAO_TEMPLATE) {
    if (column.aliases.some(alias => normalizeImportHeader(alias) === normalized)) {
      return column.campo;
    }
  }

  return null;
}
