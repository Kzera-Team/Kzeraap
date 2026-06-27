import type { IdentityColumn, IdentityRule, IdentityRulePart } from '../../domain/identidade/IdentityRule';

const CODE_RULE_STORAGE_KEY = 'codigoPerfilRule';
const LEGACY_CODE_RULE_STORAGE_KEY = 'codigoPerfilRule';

interface KeyValueStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}

interface LegacyCodigoPerfilConfig {
  fields: IdentityColumn[];
  separator: string;
}

export const DEFAULT_CODIGO_PERFIL_RULE: IdentityRule = {
  id: 'codigo-perfil-config',
  version: 1,
  active: true,
  createdAt: new Date(0).toISOString(),
  parts: []
};

export function cloneIdentityRule(rule: IdentityRule): IdentityRule {
  return JSON.parse(JSON.stringify(rule)) as IdentityRule;
}

function mapLegacyConfig(config: LegacyCodigoPerfilConfig): IdentityRule {
  const parts: IdentityRulePart[] = [];
  config.fields.forEach((field, index) => {
    if (index > 0 && config.separator) {
      parts.push({ type: 'staticText', value: config.separator, caseFormat: 'original', transform: 'none' });
    }
    parts.push({ type: 'column', column: field, extraction: 'firstLetter', caseFormat: 'upper', transform: 'none' });
  });
  return { ...cloneIdentityRule(DEFAULT_CODIGO_PERFIL_RULE), parts };
}

export class CodigoPerfilRuleService {
  private cachedRule: IdentityRule = cloneIdentityRule(DEFAULT_CODIGO_PERFIL_RULE);

  constructor(private readonly configStore: KeyValueStore) {}

  getCachedRule(): IdentityRule {
    return this.cachedRule;
  }

  async load(): Promise<IdentityRule | null> {
    const raw = await this.configStore.get(CODE_RULE_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as IdentityRule;
    const legacy = await this.configStore.get(LEGACY_CODE_RULE_STORAGE_KEY);
    if (legacy) return mapLegacyConfig(JSON.parse(legacy) as LegacyCodigoPerfilConfig);
    return null;
  }

  async save(rule: IdentityRule): Promise<void> {
    await this.configStore.set(CODE_RULE_STORAGE_KEY, JSON.stringify(rule));
    this.cachedRule = cloneIdentityRule(rule);
  }

  async ensure(): Promise<IdentityRule | null> {
    const saved = await this.load();
    if (saved) this.cachedRule = cloneIdentityRule(saved);
    return saved;
  }
}
