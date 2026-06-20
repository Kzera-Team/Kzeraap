import type { IdentityRule, IdentityRulePart, IdentityColumn } from './IdentityRule';
import { IdentityRuleEngine } from './IdentityRuleEngine';
import type { Perfil } from '../perfil/Perfil';

export interface IdentityRuleDraft {
  id: string;
  name: string;
  parts: IdentityRulePart[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IdentityRulePreviewInput {
  rule: IdentityRule;
  perfil: Perfil;
}

export interface IdentityRulePreviewResult {
  value: string;
  valid: boolean;
  errors: string[];
}

export const IDENTITY_ALLOWED_CLIENT_COLUMNS: IdentityColumn[] = [
  'perfil.nome',
  'perfil.bairro',
  'perfil.municipio',
  'perfil.classificacao',
  'perfil.codigoInterno'
];

export function validateIdentityRule(rule: IdentityRule): string[] {
  const errors: string[] = [];

  if (!rule.parts.length) {
    errors.push('Regra de identidade precisa ter pelo menos um campo.');
  }

  for (const part of rule.parts) {
    if (part.type === 'column' && !IDENTITY_ALLOWED_CLIENT_COLUMNS.includes(part.column)) {
      errors.push(`Coluna não permitida para identidade operacional: ${part.column}`);
    }

    if (part.type === 'staticText' && !part.value) {
      errors.push('Campo de texto fixo não pode ser vazio.');
    }
  }

  return errors;
}

export function previewIdentityRule(input: IdentityRulePreviewInput): IdentityRulePreviewResult {
  const errors = validateIdentityRule(input.rule);

  if (errors.length) {
    return {
      value: '',
      valid: false,
      errors
    };
  }

  const engine = new IdentityRuleEngine();
  const value = engine.generate(input.rule, input.perfil);

  return {
    value,
    valid: Boolean(value.trim()),
    errors: value.trim() ? [] : ['Regra gerou codigo vazio.']
  };
}
