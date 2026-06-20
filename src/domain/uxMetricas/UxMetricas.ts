export type UxEventoTipo =
  | 'app_sessao_iniciada'
  | 'app_sessao_finalizada'
  | 'app_bloqueado'
  | 'app_desbloqueado'
  | 'app_reaberto'
  | 'tela_aberta'
  | 'tela_fechada'
  | 'fluxo_iniciado'
  | 'fluxo_concluido'
  | 'fluxo_abandonado'
  | 'acao_executada'
  | 'voltar_usado'
  | 'navegacao_repetida'
  | 'erro_exibido'
  | 'lista_limitada';

export type UxAcaoTipo = 'principal' | 'secundaria' | 'perigosa' | 'navegacao';
export type UxFluxoStatus = 'em_andamento' | 'concluido' | 'abandonado';
export type UxOrigemNavegacao = 'menu' | 'atalho' | 'voltar' | 'fluxo';
export type UxErroTipo = 'validacao' | 'seguranca' | 'importacao' | 'dados' | 'sistema';
export type UxCriticidade = 'baixa' | 'media' | 'alta';
export type UxAbandonoMotivo = 'saiu_da_tela' | 'bloqueio' | 'recarregou' | 'cancelou';

export interface UxEvento {
  id: string;
  criadoEm: string;
  sessaoId: string;
  fluxoId?: string;
  tipo: UxEventoTipo;
  tela?: string;
  fluxo?: string;
  acao?: string;
  tipoAcao?: UxAcaoTipo;
  origem?: UxOrigemNavegacao;
  duracaoMs?: number;
  tempoTotalMs?: number;
  quantidadeAcoes?: number;
  quantidadeVoltas?: number;
  quantidadeErros?: number;
  concluiu?: boolean;
  abandonoMotivoGenerico?: UxAbandonoMotivo;
  tipoErro?: UxErroTipo;
  criticidade?: UxCriticidade;
  recuperavel?: boolean;
  quantidadeTotalAproximada?: number;
  quantidadeRenderizada?: number;
  metadataSegura?: Record<string, string | number | boolean>;
}

export interface UxFluxoResumo {
  id: string;
  fluxo: string;
  iniciadoEm: string;
  finalizadoEm?: string;
  status: UxFluxoStatus;
  tempoTotalMs: number;
  quantidadeAcoes: number;
  quantidadeTelas: number;
  quantidadeVoltas: number;
  quantidadeErros: number;
}

export const UX_EVENTOS_PERMITIDOS: readonly UxEventoTipo[] = [
  'app_sessao_iniciada',
  'app_sessao_finalizada',
  'app_bloqueado',
  'app_desbloqueado',
  'app_reaberto',
  'tela_aberta',
  'tela_fechada',
  'fluxo_iniciado',
  'fluxo_concluido',
  'fluxo_abandonado',
  'acao_executada',
  'voltar_usado',
  'navegacao_repetida',
  'erro_exibido',
  'lista_limitada'
];
