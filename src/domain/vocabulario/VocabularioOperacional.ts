export type TokenVocabularioOperacional =
  | 'UNIT_DISPLAY_PRIMARY'
  | 'UNIT_INTERNAL_PRECISION'
  | 'UNIT_DISPLAY_SECONDARY'
  | 'SHORTCUT_PRIMARY_HALF'
  | 'SHORTCUT_PRIMARY_ONE'
  | 'SHORTCUT_PRIMARY_TWO';

export interface EntradaVocabularioOperacional {
  token: TokenVocabularioOperacional;
  rotulo: string;
}

export interface PayloadVocabularioOperacionalProtegido {
  versao: number;
  criadoEm: string;
  atualizadoEm: string;
  entradas: EntradaVocabularioOperacional[];
}

export interface RegistroVocabularioOperacionalProtegido {
  id: 'vocabulario-operacional';
  versao: number;
  algoritmo: 'AES-GCM';
  iv: string;
  saltRef: string;
  payloadProtegido: string;
  atualizadoEm: string;
}

export const TOKENS_VOCABULARIO_OPERACIONAL: TokenVocabularioOperacional[] = [
  'UNIT_DISPLAY_PRIMARY',
  'UNIT_INTERNAL_PRECISION',
  'UNIT_DISPLAY_SECONDARY',
  'SHORTCUT_PRIMARY_HALF',
  'SHORTCUT_PRIMARY_ONE',
  'SHORTCUT_PRIMARY_TWO',
];

export const POLITICA_VOCABULARIO_OPERACIONAL = {
  rotuloSensivelNaoNasceHardcoded: true,
  configurarSomenteAposSenhaMestra: true,
  persistirSomenteComoPayloadProtegido: true,
  carregarRotulosSomenteEmMemoriaAutenticada: true,
  limparMemoriaAoBloquearOuSair: true,
  usarTokensNeutrosEmRegistrosOperacionais: true,
} as const;

export function criarPayloadVocabularioOperacional(
  entradas: EntradaVocabularioOperacional[],
  agora: string,
): PayloadVocabularioOperacionalProtegido {
  return {
    versao: 1,
    criadoEm: agora,
    atualizadoEm: agora,
    entradas,
  };
}
