import type { Repository } from '../ports/Repository';
import type { Clock } from '../../core/Clock';
import type { ItemCatalogo, FracionamentoLote } from '../../domain/item/ItemCatalogo';
import type { Balanca } from '../../domain/operacao/Balanca';
import { exigirBalancaParaPesagem } from '../../domain/operacao/Balanca';
import {
  criarSessaoPesagemRapida,
  registrarPesoRapido,
  pausarSessaoPesagemRapida,
  retomarSessaoPesagemRapida,
  finalizarSessaoPesagemRapida,
  corrigirRegistroPesoRapido,
  marcarSessaoPesagemInterrompida,
  podeRegistrarPesoNaSessao,
  type SessaoPesagemRapida
} from '../../domain/operacao/PesagemRapida';

export type PesagemRapidaAcao = 'iniciar' | 'registrar_peso' | 'pausar' | 'retomar' | 'finalizar' | 'corrigir_peso';

export interface PesagemRapidaFracionamentoInput {
  acao: PesagemRapidaAcao;
  itemId: string;
  variacaoId: string;
  loteId: string;
  fracionamentoId: string;
  sessaoId?: string;
  balancaId?: string;
  alvoMg?: number;
  usarEtiquetas?: boolean;
  etiquetaInicial?: number;
  pesoMg?: number;
  registroId?: string;
}

function encontrarSessaoAberta(fracionamento: FracionamentoLote): SessaoPesagemRapida | undefined {
  return (fracionamento.pesagensRapidas || []).find(sessao => sessao.status === 'em_andamento' || sessao.status === 'pausada' || sessao.status === 'interrompida');
}

function normalizarSessoesInterrompidas(sessoes: SessaoPesagemRapida[], now: string): SessaoPesagemRapida[] {
  return sessoes.map(sessao => marcarSessaoPesagemInterrompida(sessao, now));
}

export class PesagemRapidaFracionamentoUseCase {
  constructor(
    private readonly items: Repository<ItemCatalogo>,
    private readonly balancas: Repository<Balanca>,
    private readonly clock: Clock,
    private readonly idFactory: () => string
  ) {}

  async execute(input: PesagemRapidaFracionamentoInput): Promise<ItemCatalogo> {
    const item = await this.items.getById(input.itemId);
    if (!item) throw new Error('Item não encontrado.');
    const balancas = await this.balancas.list();
    const statusBalanca = exigirBalancaParaPesagem(balancas);
    if (input.acao === 'iniciar' && !statusBalanca.pronta && !input.balancaId) throw new Error(statusBalanca.mensagem);
    const now = this.clock.now().toISOString();
    let alterou = false;

    const variacoes = item.variacoes.map(variacao => {
      if (variacao.id !== input.variacaoId) return variacao;
      const lotes = variacao.lotes.map(lote => {
        if (lote.id !== input.loteId) return lote;
        const fracionamentos = lote.fracionamentos.map(fracionamento => {
          if (fracionamento.id !== input.fracionamentoId) return fracionamento;
          alterou = true;
          const sessoes = normalizarSessoesInterrompidas(fracionamento.pesagensRapidas || [], now);
          const fracionamentoNormalizado = { ...fracionamento, pesagensRapidas: sessoes };
          const sessaoAtual = input.sessaoId ? sessoes.find(sessao => sessao.id === input.sessaoId) : encontrarSessaoAberta(fracionamentoNormalizado);
          if (input.acao === 'iniciar') {
            if (encontrarSessaoAberta(fracionamentoNormalizado)) throw new Error('Finalize ou continue a sessão atual antes de iniciar outra.');
            const balancaId = input.balancaId || statusBalanca.balanca?.id || '';
            const balancaExiste = balancas.some(balanca => balanca.id === balancaId && balanca.status === 'ativa');
            if (!balancaExiste) throw new Error('Escolha uma balança ativa para iniciar a pesagem.');
            const alvoMg = input.alvoMg || Math.round(fracionamento.tamanhoFracao * 1000);
            const sessaoInput = {
              fracionamentoId: fracionamento.id,
              balancaId,
              alvoMg,
              usarEtiquetas: Boolean(input.usarEtiquetas)
            } as { fracionamentoId: string; balancaId: string; alvoMg: number; usarEtiquetas: boolean; etiquetaInicial?: number };
            if (input.etiquetaInicial !== undefined) sessaoInput.etiquetaInicial = input.etiquetaInicial;
            const novaSessao = criarSessaoPesagemRapida(sessaoInput, this.idFactory(), now);
            return { ...fracionamento, pesagensRapidas: [...sessoes, novaSessao] };
          }
          if (!sessaoAtual) throw new Error('Sessão de pesagem não encontrada.');
          const atualizadas = sessoes.map(sessao => {
            if (sessao.id !== sessaoAtual.id) return sessao;
            if (input.acao === 'registrar_peso') {
              if (!podeRegistrarPesoNaSessao(sessao, fracionamento.quantidadeUnidadesCriadas)) {
                throw new Error('Pesagem já atingiu a quantidade de unidades deste fracionamento. Corrija um registro ou finalize a sessão.');
              }
              return registrarPesoRapido(sessao, input.pesoMg || 0, now);
            }
            if (input.acao === 'pausar') return pausarSessaoPesagemRapida(sessao, now, 'Pausa manual');
            if (input.acao === 'retomar') return retomarSessaoPesagemRapida(sessao, now);
            if (input.acao === 'finalizar') return finalizarSessaoPesagemRapida(sessao, now);
            if (input.acao === 'corrigir_peso') return corrigirRegistroPesoRapido(sessao, input.registroId || '', input.pesoMg || 0, now);
            return sessao;
          });
          return { ...fracionamento, pesagensRapidas: atualizadas };
        });
        return { ...lote, fracionamentos, updatedAt: now };
      });
      return { ...variacao, lotes, updatedAt: now };
    });

    if (!alterou) throw new Error('Fracionamento não encontrado.');
    return this.items.save({ ...item, variacoes, updatedAt: now });
  }
}
