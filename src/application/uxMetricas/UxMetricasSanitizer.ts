import { UX_EVENTOS_PERMITIDOS, type UxEvento } from '../../domain/uxMetricas/UxMetricas';

const FORBIDDEN_KEY_PATTERNS = [
  /nome/i,
  /telefone/i,
  /endereco/i,
  /endere[cç]o/i,
  /municipio/i,
  /munic[ií]pio/i,
  /bairro/i,
  /email/i,
  /cpf/i,
  /cnpj/i,
  /perfilid/i,
  /perfil_id/i,
  /cliente/i,
  /itemid/i,
  /item_id/i,
  /produto/i,
  new RegExp('ven' + 'da', 'i'),
  /transacaoid/i,
  /transa[cç][aã]oid/i,
  /valor/i,
  /preco/i,
  /pre[cç]o/i,
  /custo/i,
  /lucro/i,
  /observacao/i,
  /observa[cç][aã]o/i,
  /texto/i,
  /conteudo/i,
  /conte[uú]do/i,
  /arquivo/i,
  /stack/i,
  /message/i,
  /mensagem/i,
  /payload/i,
  /raw/i,
  /idreal/i
];

const FORBIDDEN_STRING_PATTERNS = [
  /\b\d{2}\s?9?\d{4}[-\s]?\d{4}\b/,
  /@/,
  /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/,
  /R\$\s?\d/i
];

function safeText(value: unknown, fallback = ''): string {
  const raw = String(value ?? '').trim();
  if (!raw) return fallback;
  return raw
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_:-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 64);
}

function safeNumber(value: unknown): number | undefined {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.round(number) : undefined;
}

export class UxMetricasSanitizer {
  sanitize(evento: UxEvento): UxEvento {
    if (!UX_EVENTOS_PERMITIDOS.includes(evento.tipo)) {
      throw new Error(`Evento de UX não permitido nesta versão: ${evento.tipo}`);
    }

    const sanitized: Record<string, unknown> = {
      id: safeText(evento.id, `ux-${Date.now()}`),
      criadoEm: evento.criadoEm || new Date().toISOString(),
      sessaoId: safeText(evento.sessaoId, 'sessao'),
      fluxoId: evento.fluxoId ? safeText(evento.fluxoId) : undefined,
      tipo: evento.tipo,
      tela: evento.tela ? safeText(evento.tela) : undefined,
      fluxo: evento.fluxo ? safeText(evento.fluxo) : undefined,
      acao: evento.acao ? safeText(evento.acao) : undefined,
      tipoAcao: evento.tipoAcao,
      origem: evento.origem,
      duracaoMs: safeNumber(evento.duracaoMs),
      tempoTotalMs: safeNumber(evento.tempoTotalMs),
      quantidadeAcoes: safeNumber(evento.quantidadeAcoes),
      quantidadeVoltas: safeNumber(evento.quantidadeVoltas),
      quantidadeErros: safeNumber(evento.quantidadeErros),
      concluiu: typeof evento.concluiu === 'boolean' ? evento.concluiu : undefined,
      abandonoMotivoGenerico: evento.abandonoMotivoGenerico,
      tipoErro: evento.tipoErro,
      criticidade: evento.criticidade,
      recuperavel: typeof evento.recuperavel === 'boolean' ? evento.recuperavel : undefined,
      quantidadeTotalAproximada: safeNumber(evento.quantidadeTotalAproximada),
      quantidadeRenderizada: safeNumber(evento.quantidadeRenderizada),
      metadataSegura: this.sanitizeMetadata(evento.metadataSegura)
    };

    return Object.fromEntries(Object.entries(sanitized).filter(([, value]) => value !== undefined)) as unknown as UxEvento;
  }

  sanitizeMetadata(metadata: UxEvento['metadataSegura']): UxEvento['metadataSegura'] {
    if (!metadata) return undefined;
    const safeEntries: [string, string | number | boolean][] = [];
    for (const [key, value] of Object.entries(metadata)) {
      if (this.isForbiddenKey(key) || this.isForbiddenValue(value)) continue;
      const safeKey = safeText(key);
      if (!safeKey) continue;
      if (typeof value === 'boolean') safeEntries.push([safeKey, value]);
      if (typeof value === 'number' && Number.isFinite(value)) safeEntries.push([safeKey, Math.round(value)]);
      if (typeof value === 'string') safeEntries.push([safeKey, safeText(value)]);
    }
    return safeEntries.length ? Object.fromEntries(safeEntries) : undefined;
  }

  private isForbiddenKey(key: string): boolean {
    return FORBIDDEN_KEY_PATTERNS.some(pattern => pattern.test(key));
  }

  private isForbiddenValue(value: unknown): boolean {
    if (typeof value !== 'string') return false;
    return FORBIDDEN_STRING_PATTERNS.some(pattern => pattern.test(value));
  }
}
