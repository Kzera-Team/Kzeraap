import type { IdentityRulePart } from '../../domain/identidade/IdentityRule';
import { escaped, fillTemplate } from '../sharedTemplate';
import { CASE_LABELS, EXTRACTION_LABELS, FIELD_LABELS, TRANSFORM_LABELS } from './CodigoPerfilLabels';
import columnFieldTemplate from './codigo-perfil-column-field.html?raw';
import extractionFieldTemplate from './codigo-perfil-extraction-field.html?raw';
import optionTemplate from './option.html?raw';
import rulePartTemplate from './codigo-perfil-rule-part.html?raw';
import textFieldTemplate from './codigo-perfil-text-field.html?raw';

export class CodigoPerfilRulePartRenderer {
  render(part: IdentityRulePart, index: number): string {
    const column = part.type === 'column' ? part.column : 'perfil.nome';
    const extraction = part.type === 'column' ? part.extraction : 'full';
    const value = part.type === 'staticText' ? part.value : '';

    return fillTemplate(rulePartTemplate, {
      index,
      number: index + 1,
      typeOptions: this.option('staticText', 'Texto livre', part.type === 'staticText') + this.option('column', 'Coluna', part.type === 'column'),
      textField: part.type === 'staticText' ? fillTemplate(textFieldTemplate, { value: escaped(value) }) : '',
      columnField: part.type === 'column' ? fillTemplate(columnFieldTemplate, { options: this.optionList(FIELD_LABELS, column) }) : '',
      extractionField: part.type === 'column' ? fillTemplate(extractionFieldTemplate, { options: this.optionList(EXTRACTION_LABELS, extraction) }) : '',
      caseOptions: this.optionList(CASE_LABELS, part.caseFormat),
      transformOptions: this.optionList(TRANSFORM_LABELS, part.transform)
    });
  }

  private optionList<T extends string>(labels: Record<T, string>, selected: T): string {
    return Object.entries(labels).map(([value, label]) => this.option(value, String(label), value === selected)).join('');
  }

  private option(value: string, label: string, selected: boolean): string {
    return fillTemplate(optionTemplate, {
      value: escaped(value),
      label: escaped(label),
      selected: selected ? 'selected' : ''
    });
  }
}
