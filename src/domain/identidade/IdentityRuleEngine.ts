import type { Perfil } from '../perfil/Perfil';
import type {
  IdentityCaseFormat,
  IdentityExtraction,
  IdentityRule,
  IdentityRulePart,
  IdentityRulePartColumn,
  IdentityTransform
} from './IdentityRule';

function normalizeWords(value: string): string[] {
  return value.trim().split(/\s+/).filter(Boolean);
}

function getColumnValue(part: IdentityRulePartColumn, perfil: Perfil): string {
  switch (part.column) {
    case 'perfil.nome':
      return perfil.nome || '';
    case 'perfil.bairro':
      return perfil.bairro || '';
    case 'perfil.municipio':
      return perfil.municipio || '';
    case 'perfil.classificacao':
      return perfil.conhecePessoalmente ? 'conhece' : 'nao';
    case 'perfil.codigoInterno':
      return perfil.id || '';
    default:
      return '';
  }
}

function extract(value: string, extraction: IdentityExtraction, n = 1): string {
  const trimmed = value.trim();
  const words = normalizeWords(trimmed);

  switch (extraction) {
    case 'full':
      return trimmed;
    case 'firstLetter':
      return trimmed.charAt(0);
    case 'firstLetterOfEachWord':
      return words.map(word => word.charAt(0)).join('');
    case 'lastLetter':
      return trimmed.charAt(trimmed.length - 1);
    case 'lastLetterOfEachWord':
      return words.map(word => word.charAt(word.length - 1)).join('');
    case 'firstName':
      return words[0] || '';
    case 'lastName':
      return words[words.length - 1] || '';
    case 'firstN':
      return trimmed.slice(0, Math.max(0, n));
    case 'lastN':
      return trimmed.slice(Math.max(0, trimmed.length - Math.max(0, n)));
    case 'length':
      return String(trimmed.length);
    default:
      return trimmed;
  }
}

function applyCase(value: string, caseFormat: IdentityCaseFormat): string {
  if (caseFormat === 'upper') return value.toUpperCase();
  if (caseFormat === 'lower') return value.toLowerCase();
  return value;
}

function applyTransform(value: string, transform: IdentityTransform): string {
  if (transform === 'reverse') {
    return value.split('').reverse().join('');
  }

  return value;
}

function renderPart(part: IdentityRulePart, perfil: Perfil): string {
  const raw = part.type === 'column'
    ? extract(getColumnValue(part, perfil), part.extraction, part.n)
    : part.value;

  return applyTransform(applyCase(raw, part.caseFormat), part.transform);
}

export class IdentityRuleEngine {
  generate(rule: IdentityRule, perfil: Perfil): string {
    return rule.parts.map(part => renderPart(part, perfil)).join('');
  }
}
