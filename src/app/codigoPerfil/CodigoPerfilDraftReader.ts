import type { IdentityCaseFormat, IdentityColumn, IdentityExtraction, IdentityRule, IdentityRulePart, IdentityTransform } from '../../domain/identidade/IdentityRule';

export function readCodigoPerfilDraftRuleFromDom(root: HTMLElement, createdAt: string): IdentityRule {
  const parts: IdentityRulePart[] = [];

  root.querySelectorAll<HTMLElement>('[data-code-block]').forEach(block => {
    const type = (block.querySelector('[data-code-field="type"]') as HTMLSelectElement | null)?.value;
    const caseFormat = ((block.querySelector('[data-code-field="caseFormat"]') as HTMLSelectElement | null)?.value || 'original') as IdentityCaseFormat;
    const transform = ((block.querySelector('[data-code-field="transform"]') as HTMLSelectElement | null)?.value || 'none') as IdentityTransform;

    if (type === 'staticText') {
      const value = (block.querySelector('[data-code-field="value"]') as HTMLInputElement | null)?.value || '';
      parts.push({ type: 'staticText', value, caseFormat, transform });
      return;
    }

    const column = ((block.querySelector('[data-code-field="column"]') as HTMLSelectElement | null)?.value || 'perfil.nome') as IdentityColumn;
    const extraction = ((block.querySelector('[data-code-field="extraction"]') as HTMLSelectElement | null)?.value || 'full') as IdentityExtraction;
    const columnPart: IdentityRulePart = extraction === 'firstN'
      ? { type: 'column', column, extraction, n: 2, caseFormat, transform }
      : { type: 'column', column, extraction, caseFormat, transform };
    parts.push(columnPart);
  });

  return { id: 'codigo-perfil-config', version: 1, active: true, createdAt, parts };
}
