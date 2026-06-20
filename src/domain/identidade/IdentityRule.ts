export type IdentitySourceType = 'column' | 'staticText';

export type IdentityColumn =
  | 'perfil.nome'
  | 'perfil.bairro'
  | 'perfil.municipio'
  | 'perfil.classificacao'
  | 'perfil.codigoInterno';

export type IdentityExtraction =
  | 'full'
  | 'firstLetter'
  | 'firstLetterOfEachWord'
  | 'lastLetter'
  | 'lastLetterOfEachWord'
  | 'firstName'
  | 'lastName'
  | 'firstN'
  | 'lastN'
  | 'length';

export type IdentityCaseFormat = 'original' | 'upper' | 'lower';

export type IdentityTransform = 'none' | 'reverse';

export interface IdentityRulePartColumn {
  type: 'column';
  column: IdentityColumn;
  extraction: IdentityExtraction;
  n?: number;
  caseFormat: IdentityCaseFormat;
  transform: IdentityTransform;
}

export interface IdentityRulePartText {
  type: 'staticText';
  value: string;
  caseFormat: IdentityCaseFormat;
  transform: IdentityTransform;
}

export type IdentityRulePart = IdentityRulePartColumn | IdentityRulePartText;

export interface IdentityRule {
  id: string;
  version: number;
  active: boolean;
  createdAt: string;
  parts: IdentityRulePart[];
}
