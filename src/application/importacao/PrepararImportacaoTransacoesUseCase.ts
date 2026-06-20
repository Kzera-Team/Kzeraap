import type { Repository } from '../ports/Repository';
import type { Clock } from '../../core/Clock';
import type { Perfil } from '../../domain/perfil/Perfil';
import type { ItemCatalogo } from '../../domain/item/ItemCatalogo';
import {
  criarLoteImportacaoTransacoes,
  encontrarPerfilPorNome,
  normalizarTransacaoImportada,
  parseTabelaDelimitada,
  resumirRegistrosImportacao,
  statusRegistroPorPendencias,
  type LoteImportacaoTransacoes,
  type PendenciaImportacao,
  type RegistroImportacaoTransacao,
  type ResumoStagingImportacao
} from '../../domain/importacao/ImportacaoTransacoesFinanceiro';

export interface PrepararImportacaoTransacoesInput {
  nomeArquivo: string;
  conteudo: string;
}

export interface PrepararImportacaoTransacoesResultado {
  lote: LoteImportacaoTransacoes;
  registros: RegistroImportacaoTransacao[];
  resumo: ResumoStagingImportacao;
}

export class PrepararImportacaoTransacoesUseCase {
  constructor(
    private readonly lotes: Repository<LoteImportacaoTransacoes>,
    private readonly registros: Repository<RegistroImportacaoTransacao>,
    private readonly perfis: Repository<Perfil>,
    private readonly itens: Repository<ItemCatalogo>,
    private readonly clock: Clock,
    private readonly idFactory: (prefix: string) => string
  ) {}

  async execute(input: PrepararImportacaoTransacoesInput): Promise<PrepararImportacaoTransacoesResultado> {
    const parsed = parseTabelaDelimitada(input.conteudo);
    const now = this.clock.now().toISOString();
    const perfis = await this.perfis.list();
    const itens = await this.itens.list();
    const lote = criarLoteImportacaoTransacoes(input.nomeArquivo || 'transacoes.csv', parsed.rows.length, this.idFactory('imp-transacoes'), now);
    const registros: RegistroImportacaoTransacao[] = [];

    for (const [index, row] of parsed.rows.entries()) {
      const pendencias: PendenciaImportacao[] = [];
      let normalizados;
      try {
        normalizados = normalizarTransacaoImportada(row, itens);
        if (!normalizados.numero) pendencias.push({ tipo: 'coluna_obrigatoria', campo: 'Número', mensagem: 'Número da transacao é obrigatório na importação.' });
        if (!normalizados.clienteNome) pendencias.push({ tipo: 'coluna_obrigatoria', campo: 'Perfil', mensagem: 'Nome do comprador é obrigatório na importação.' });
        if (normalizados.total <= 0) pendencias.push({ tipo: 'valor_invalido', campo: 'Total', mensagem: 'Total da transacao precisa ser maior que zero.' });
        const perfil = normalizados.clienteNome ? encontrarPerfilPorNome(normalizados.clienteNome, perfis) : undefined;
        if (normalizados.clienteNome && !perfil) pendencias.push({ tipo: 'cliente_nao_encontrado', campo: 'Perfil', valor: normalizados.clienteNome, mensagem: `Perfil não encontrado para comprador: ${normalizados.clienteNome}` });
        normalizados.itens.forEach(item => pendencias.push(...item.pendencias));
        if (normalizados.itens.some(item => item.pendencias.some(p => p.tipo === 'item_nao_encontrado'))) {
          pendencias.push({ tipo: 'item_nao_encontrado', campo: 'Descrição', mensagem: 'Um ou mais itens da transacao precisam ser mapeados antes da confirmação.' });
        }
        const registro: RegistroImportacaoTransacao = {
          id: this.idFactory('reg-transacao'),
          loteImportacaoId: lote.id,
          linha: index + 2,
          numeroOriginal: normalizados.numero,
          dadosBrutos: row,
          dadosNormalizados: normalizados,
          clienteNomeImportado: normalizados.clienteNome,
          status: statusRegistroPorPendencias(pendencias),
          pendencias,
          createdAt: now,
          updatedAt: now
        };
        if (perfil?.id) registro.perfilIdResolvido = perfil.id;
        registros.push(await this.registros.save(registro));
      } catch (error) {
        pendencias.push({ tipo: 'descricao_invalida', mensagem: error instanceof Error ? error.message : 'Erro ao interpretar linha de transacao.' });
        registros.push(await this.registros.save({ id: this.idFactory('reg-transacao'), loteImportacaoId: lote.id, linha: index + 2, dadosBrutos: row, status: 'erro', pendencias, createdAt: now, updatedAt: now }));
      }
    }

    const resumo = resumirRegistrosImportacao(registros);
    const loteFinal: LoteImportacaoTransacoes = { ...lote, totalValidas: resumo.validos, totalPendentes: resumo.pendentes + resumo.erros, status: resumo.pendentes || resumo.erros ? 'em_preparacao' : 'parcialmente_resolvido', updatedAt: now };
    await this.lotes.save(loteFinal);
    return { lote: loteFinal, registros, resumo };
  }
}
