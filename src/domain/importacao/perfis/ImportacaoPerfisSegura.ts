export type ImportacaoPerfisEstado =
  | 'rascunho'
  | 'confirmando'
  | 'parcial'
  | 'concluida'
  | 'cancelada';

export type ImportacaoPerfilItemEstado =
  | 'pronto'
  | 'pendente'
  | 'importado'
  | 'rejeitado'
  | 'cancelado';

export type EvidenciaDuplicidadePerfil = 'telefone' | 'email' | 'identificador_origem';

export interface EscopoImportacaoPerfis {
  usuarioId: string;
  importacaoId: string;
  loteId: string;
  origem: string;
}

export interface PerfilImportacaoSeguraInput {
  nome: string;
  telefone?: string;
  email?: string;
  bairro?: string;
  municipio?: string;
  conhecePessoalmente: boolean;
  identificadorOrigem?: string;
}

export interface CandidatoDuplicidadePerfil {
  perfilId: string;
  evidencias: EvidenciaDuplicidadePerfil[];
}

export type DecisaoDuplicidadePerfil =
  | { tipo: 'criar_novo'; confirmarApesarDeDuplicidade: boolean }
  | { tipo: 'usar_existente'; perfilId: string }
  | { tipo: 'rejeitar'; motivo: string };

export interface FalhaImportacaoPerfil {
  codigo: string;
  mensagem: string;
  retryable: boolean;
}

export interface ImportacaoPerfilItem {
  id: string;
  linha: number;
  input: PerfilImportacaoSeguraInput;
  estado: ImportacaoPerfilItemEstado;
  candidatos: CandidatoDuplicidadePerfil[];
  decisao?: DecisaoDuplicidadePerfil;
  falha?: FalhaImportacaoPerfil;
  perfilId?: string;
  acaoImportacao?: 'criado' | 'existente';
  tentativas: number;
  reprocessado: boolean;
}

export interface ImportacaoPerfilResultadoItem {
  itemId: string;
  linha: number;
  perfilId?: string;
  acao?: 'criado' | 'existente';
}

export interface ImportacaoPerfilResultadoFalha {
  itemId: string;
  linha: number;
  codigo: string;
  motivo: string;
  retryable: boolean;
}

export interface ImportacaoPerfilResultadoPendente {
  itemId: string;
  linha: number;
  codigo: string;
  motivo: string;
  candidatos: string[];
}

export interface ResultadoImportacaoPerfisEstruturado {
  importacaoId: string;
  loteId: string;
  estado: ImportacaoPerfisEstado;
  importados: ImportacaoPerfilResultadoItem[];
  rejeitados: ImportacaoPerfilResultadoFalha[];
  pendentes: ImportacaoPerfilResultadoPendente[];
  reprocessados: ImportacaoPerfilResultadoItem[];
}

export interface ConfirmacaoImportacaoPerfis {
  idempotencyKey: string;
  estado: 'processando' | 'concluida' | 'cancelada';
  iniciadaEm: string;
  atualizadaEm: string;
  resultado?: ResultadoImportacaoPerfisEstruturado;
}

export interface ImportacaoPerfisAggregate {
  id: string;
  escopo: EscopoImportacaoPerfis;
  estado: ImportacaoPerfisEstado;
  itens: ImportacaoPerfilItem[];
  confirmacoes: ConfirmacaoImportacaoPerfis[];
  criadaEm: string;
  atualizadaEm: string;
}

export class ImportacaoPerfisDomainError extends Error {
  constructor(
    message: string,
    readonly code: string
  ) {
    super(message);
    this.name = 'ImportacaoPerfisDomainError';
  }
}

function exigirTexto(value: string, field: keyof EscopoImportacaoPerfis): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new ImportacaoPerfisDomainError(
      `O campo de escopo ${field} e obrigatorio.`,
      'IMPORTACAO_ESCOPO_INVALIDO'
    );
  }
  return normalized;
}

export function validarEscopoImportacaoPerfis(escopo: EscopoImportacaoPerfis): EscopoImportacaoPerfis {
  return {
    usuarioId: exigirTexto(escopo.usuarioId, 'usuarioId'),
    importacaoId: exigirTexto(escopo.importacaoId, 'importacaoId'),
    loteId: exigirTexto(escopo.loteId, 'loteId'),
    origem: exigirTexto(escopo.origem, 'origem')
  };
}

export function chaveEscopoImportacaoPerfis(escopo: EscopoImportacaoPerfis): string {
  const validado = validarEscopoImportacaoPerfis(escopo);
  return [validado.usuarioId, validado.importacaoId, validado.loteId, validado.origem]
    .map(value => encodeURIComponent(value))
    .join('::');
}

export function escoposImportacaoPerfisIguais(
  left: EscopoImportacaoPerfis,
  right: EscopoImportacaoPerfis
): boolean {
  return chaveEscopoImportacaoPerfis(left) === chaveEscopoImportacaoPerfis(right);
}

export function normalizarTelefoneImportacaoPerfil(value?: string): string | undefined {
  const normalized = value?.replace(/\D/g, '');
  return normalized ? normalized : undefined;
}

export function normalizarEmailImportacaoPerfil(value?: string): string | undefined {
  const normalized = value?.trim().toLocaleLowerCase('pt-BR');
  return normalized ? normalized : undefined;
}

export function normalizarIdentificadorOrigem(value?: string): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export function validarInputImportacaoPerfil(input: PerfilImportacaoSeguraInput): FalhaImportacaoPerfil | null {
  if (!input.nome.trim()) {
    return {
      codigo: 'PERFIL_NOME_OBRIGATORIO',
      mensagem: 'Nome e obrigatorio.',
      retryable: false
    };
  }

  const telefone = normalizarTelefoneImportacaoPerfil(input.telefone);
  const email = normalizarEmailImportacaoPerfil(input.email);
  const identificadorOrigem = normalizarIdentificadorOrigem(input.identificadorOrigem);

  if (!telefone && !email && !identificadorOrigem) {
    return {
      codigo: 'PERFIL_IDENTIDADE_INSUFICIENTE',
      mensagem: 'Telefone, email ou identificador de origem e obrigatorio para evitar associacao por nome.',
      retryable: false
    };
  }

  return null;
}

export function resultadoImportacaoPerfis(
  aggregate: ImportacaoPerfisAggregate
): ResultadoImportacaoPerfisEstruturado {
  const importados: ImportacaoPerfilResultadoItem[] = [];
  const rejeitados: ImportacaoPerfilResultadoFalha[] = [];
  const pendentes: ImportacaoPerfilResultadoPendente[] = [];
  const reprocessados: ImportacaoPerfilResultadoItem[] = [];

  for (const item of aggregate.itens) {
    if (item.estado === 'importado' && item.perfilId && item.acaoImportacao) {
      const resultado: ImportacaoPerfilResultadoItem = {
        itemId: item.id,
        linha: item.linha,
        perfilId: item.perfilId,
        acao: item.acaoImportacao
      };
      importados.push(resultado);
      if (item.reprocessado) reprocessados.push(resultado);
      continue;
    }

    if (item.estado === 'rejeitado' && item.falha) {
      rejeitados.push({
        itemId: item.id,
        linha: item.linha,
        codigo: item.falha.codigo,
        motivo: item.falha.mensagem,
        retryable: item.falha.retryable
      });
      continue;
    }

    if (item.estado === 'pendente') {
      pendentes.push({
        itemId: item.id,
        linha: item.linha,
        codigo: item.falha?.codigo ?? 'DECISAO_DUPLICIDADE_PENDENTE',
        motivo: item.falha?.mensagem ?? 'Decisao explicita de duplicidade obrigatoria.',
        candidatos: item.candidatos.map(candidate => candidate.perfilId)
      });
    }
  }

  return {
    importacaoId: aggregate.escopo.importacaoId,
    loteId: aggregate.escopo.loteId,
    estado: aggregate.estado,
    importados,
    rejeitados,
    pendentes,
    reprocessados
  };
}
