import type { IdentityCaseFormat, IdentityColumn, IdentityExtraction, IdentityTransform } from '../../domain/identidade/IdentityRule';

export const FIELD_LABELS: Record<IdentityColumn, string> = {
  'perfil.nome': 'Nome',
  'perfil.bairro': 'Bairro',
  'perfil.municipio': 'Município',
  'perfil.classificacao': 'Conhecido',
  'perfil.codigoInterno': 'Código interno'
};

export const EXTRACTION_LABELS: Record<IdentityExtraction, string> = {
  full: 'Valor completo',
  firstLetter: 'Primeira letra',
  firstN: 'Duas primeiras letras',
  firstLetterOfEachWord: 'Primeira letra dos nomes',
  lastLetter: 'Última letra',
  lastLetterOfEachWord: 'Última letra dos nomes',
  firstName: 'Primeiro nome',
  lastName: 'Último nome',
  lastN: 'Últimas letras',
  length: 'Quantidade de caracteres'
};

export const CASE_LABELS: Record<IdentityCaseFormat, string> = {
  original: 'Original',
  upper: 'Maiúsculo',
  lower: 'Minúsculo'
};

export const TRANSFORM_LABELS: Record<IdentityTransform, string> = {
  none: 'Normal',
  reverse: 'Invertido'
};
