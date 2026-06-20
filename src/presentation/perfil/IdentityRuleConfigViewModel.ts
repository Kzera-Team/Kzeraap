import { IDENTITY_ALLOWED_CLIENT_COLUMNS } from '../../domain/identidade/IdentityRuleConfig';

export const IDENTITY_RULE_CONFIG_VIEW_MODEL = {
  title: 'Configurar Codigo',
  addFieldLabel: 'Adicionar campo',
  allowedColumns: IDENTITY_ALLOWED_CLIENT_COLUMNS,
  sourceTypes: ['column', 'staticText'],
  formats: ['original', 'upper', 'lower'],
  transformations: ['none', 'reverse'],
  extractionTypes: [
    'full',
    'firstLetter',
    'firstLetterOfEachWord',
    'lastLetter',
    'lastLetterOfEachWord',
    'firstName',
    'lastName',
    'firstN',
    'lastN',
    'length'
  ],
  previewEnabled: true
} as const;
