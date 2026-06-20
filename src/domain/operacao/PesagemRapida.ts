export type PesagemRapidaStatus = 'em_andamento' | 'pausada' | 'interrompida' | 'finalizada' | 'cancelada';

export interface RegistroPesoFracao {
  id: string;
  sequencia: number;
  etiqueta?: number;
  pesoMg: number;
  dataHora: string;
  balancaId: string;
  corrigidoDeMg?: number;
  corrigidoEm?: string;
}

export interface PausaPesagemRapida {
  inicio: string;
  fim?: string;
  duracaoMs?: number;
  motivo?: string;
}

export interface SessaoPesagemRapida {
  id: string;
  fracionamentoId: string;
  balancaId: string;
  status: PesagemRapidaStatus;
  alvoMg: number;
  usarEtiquetas: boolean;
  etiquetaInicial?: number;
  ultimaEtiquetaUsada?: number;
  proximaEtiqueta?: number;
  registros: RegistroPesoFracao[];
  pausas: PausaPesagemRapida[];
  inicioEm: string;
  fimEm?: string;
  ultimaAtividadeEm: string;
  tempoProdutivoMs: number;
  tempoPausadoMs: number;
  tempoInterrompidoMs: number;
}


export const LIMITE_INTERRUPCAO_PESAGEM_MS = 5 * 60 * 1000;

export function deveMarcarPesagemComoInterrompida(sessao: SessaoPesagemRapida, dataHora: string, limiteMs = LIMITE_INTERRUPCAO_PESAGEM_MS): boolean {
  if (sessao.status !== 'em_andamento') return false;
  const ultima = new Date(sessao.ultimaAtividadeEm).getTime();
  const atual = new Date(dataHora).getTime();
  if (!Number.isFinite(ultima) || !Number.isFinite(atual)) return false;
  return atual - ultima >= limiteMs;
}

export function marcarSessaoPesagemInterrompida(sessao: SessaoPesagemRapida, dataHora: string, limiteMs = LIMITE_INTERRUPCAO_PESAGEM_MS): SessaoPesagemRapida {
  if (!deveMarcarPesagemComoInterrompida(sessao, dataHora, limiteMs)) return sessao;
  const ultima = new Date(sessao.ultimaAtividadeEm).getTime();
  const atual = new Date(dataHora).getTime();
  const tempoInterrompidoMs = sessao.tempoInterrompidoMs + Math.max(0, atual - ultima);
  return { ...sessao, status: 'interrompida', tempoInterrompidoMs, ultimaAtividadeEm: dataHora };
}

export function statusOperacionalSessaoPesagem(sessao: SessaoPesagemRapida, dataHora: string, limiteMs = LIMITE_INTERRUPCAO_PESAGEM_MS): PesagemRapidaStatus {
  return deveMarcarPesagemComoInterrompida(sessao, dataHora, limiteMs) ? 'interrompida' : sessao.status;
}

export interface CriarSessaoPesagemRapidaInput {
  fracionamentoId: string;
  balancaId: string;
  alvoMg: number;
  usarEtiquetas: boolean;
  etiquetaInicial?: number;
}

export function criarSessaoPesagemRapida(input: CriarSessaoPesagemRapidaInput, id: string, now: string): SessaoPesagemRapida {
  if (!input.fracionamentoId.trim()) throw new Error('Pesagem exige fracionamento.');
  if (!input.balancaId.trim()) throw new Error('Pesagem exige balança.');
  if (input.alvoMg <= 0) throw new Error('Peso alvo deve ser maior que zero.');
  const sessao: SessaoPesagemRapida = {
    id,
    fracionamentoId: input.fracionamentoId,
    balancaId: input.balancaId,
    status: 'em_andamento',
    alvoMg: input.alvoMg,
    usarEtiquetas: input.usarEtiquetas,
    registros: [],
    pausas: [],
    inicioEm: now,
    ultimaAtividadeEm: now,
    tempoProdutivoMs: 0,
    tempoPausadoMs: 0,
    tempoInterrompidoMs: 0
  };
  if (input.usarEtiquetas) {
    const inicial = input.etiquetaInicial && input.etiquetaInicial > 0 ? Math.floor(input.etiquetaInicial) : 1;
    sessao.etiquetaInicial = inicial;
    sessao.proximaEtiqueta = inicial;
  }
  return sessao;
}

function acumularTempoProdutivo(sessao: SessaoPesagemRapida, dataHora: string): number {
  const anterior = new Date(sessao.ultimaAtividadeEm).getTime();
  const atual = new Date(dataHora).getTime();
  const delta = Number.isFinite(anterior) && Number.isFinite(atual) ? Math.max(0, atual - anterior) : 0;
  return sessao.tempoProdutivoMs + delta;
}

export function registrosEfetivosDaSessao(sessao: SessaoPesagemRapida): number {
  return sessao.registros.length;
}

export function divergenciaRegistrosFracionamento(totalEsperado: number, sessoes: SessaoPesagemRapida[] = []): { esperado: number; registrado: number; divergencia: number; excedeu: boolean; pendente: boolean } {
  const registrado = sessoes.reduce((total, sessao) => total + registrosEfetivosDaSessao(sessao), 0);
  const divergencia = registrado - totalEsperado;
  return { esperado: totalEsperado, registrado, divergencia, excedeu: divergencia > 0, pendente: divergencia < 0 };
}

export function podeRegistrarPesoNaSessao(sessao: SessaoPesagemRapida, totalEsperado: number): boolean {
  return registrosEfetivosDaSessao(sessao) < totalEsperado;
}

export function formatarAtalhoPesoHumano(mg: number): string {
  if (mg >= 1000 && mg % 1000 === 0) return `${mg / 1000} g`;
  if (mg === 500) return '0,5 g';
  return `${mg} mg`;
}

export function registrarPesoRapido(sessao: SessaoPesagemRapida, pesoMg: number, dataHora: string): SessaoPesagemRapida {
  if (sessao.status !== 'em_andamento') throw new Error('Só é possível registrar peso em sessão em andamento.');
  if (pesoMg <= 0) throw new Error('Peso deve ser maior que zero.');
  const etiqueta = sessao.usarEtiquetas ? sessao.proximaEtiqueta : undefined;
  const novoRegistro: RegistroPesoFracao = {
    id: `${sessao.id}-${sessao.registros.length + 1}`,
    sequencia: sessao.registros.length + 1,
    pesoMg,
    dataHora,
    balancaId: sessao.balancaId
  };
  if (etiqueta !== undefined) novoRegistro.etiqueta = etiqueta;
  const registros = [...sessao.registros, novoRegistro];
  const atualizada: SessaoPesagemRapida = {
    ...sessao,
    registros,
    ultimaAtividadeEm: dataHora,
    tempoProdutivoMs: acumularTempoProdutivo(sessao, dataHora),
    status: 'em_andamento'
  };
  if (etiqueta !== undefined) {
    atualizada.ultimaEtiquetaUsada = etiqueta;
    atualizada.proximaEtiqueta = etiqueta + 1;
  }
  return atualizada;
}

export function calcularResumoSessao(sessao: SessaoPesagemRapida): { quantidade: number; pesoTotalMg: number; pesoMedioMg: number; mediaTempoPorUnidadeMs: number } {
  const quantidade = sessao.registros.length;
  const pesoTotalMg = sessao.registros.reduce((total, registro) => total + registro.pesoMg, 0);
  return {
    quantidade,
    pesoTotalMg,
    pesoMedioMg: quantidade ? pesoTotalMg / quantidade : 0,
    mediaTempoPorUnidadeMs: quantidade ? sessao.tempoProdutivoMs / quantidade : 0
  };
}


export function pausarSessaoPesagemRapida(sessao: SessaoPesagemRapida, dataHora: string, motivo?: string): SessaoPesagemRapida {
  if (sessao.status !== 'em_andamento') return sessao;
  const pausa: PausaPesagemRapida = { inicio: dataHora };
  if (motivo?.trim()) pausa.motivo = motivo.trim();
  return { ...sessao, status: 'pausada', pausas: [...sessao.pausas, pausa], ultimaAtividadeEm: dataHora, tempoProdutivoMs: acumularTempoProdutivo(sessao, dataHora) };
}

export function retomarSessaoPesagemRapida(sessao: SessaoPesagemRapida, dataHora: string): SessaoPesagemRapida {
  if (sessao.status === 'interrompida') {
    return { ...sessao, status: 'em_andamento', ultimaAtividadeEm: dataHora };
  }
  if (sessao.status !== 'pausada') return sessao;
  const pausas = sessao.pausas.map((pausa, index) => {
    if (index !== sessao.pausas.length - 1 || pausa.fim) return pausa;
    const inicio = new Date(pausa.inicio).getTime();
    const fim = new Date(dataHora).getTime();
    return { ...pausa, fim: dataHora, duracaoMs: Math.max(0, fim - inicio) };
  });
  const tempoPausadoMs = pausas.reduce((total, pausa) => total + (pausa.duracaoMs || 0), 0);
  return { ...sessao, status: 'em_andamento', pausas, tempoPausadoMs, ultimaAtividadeEm: dataHora };
}

export function finalizarSessaoPesagemRapida(sessao: SessaoPesagemRapida, dataHora: string): SessaoPesagemRapida {
  if (sessao.status === 'finalizada' || sessao.status === 'cancelada') return sessao;
  const base = sessao.status === 'pausada' ? retomarSessaoPesagemRapida(sessao, dataHora) : sessao;
  return { ...base, status: 'finalizada', fimEm: dataHora, ultimaAtividadeEm: dataHora, tempoProdutivoMs: acumularTempoProdutivo(base, dataHora) };
}

export function corrigirRegistroPesoRapido(sessao: SessaoPesagemRapida, registroId: string, novoPesoMg: number, dataHora: string): SessaoPesagemRapida {
  if (novoPesoMg <= 0) throw new Error('Peso corrigido deve ser maior que zero.');
  const registros = sessao.registros.map(registro => registro.id === registroId ? { ...registro, corrigidoDeMg: registro.pesoMg, pesoMg: novoPesoMg, corrigidoEm: dataHora } : registro);
  return { ...sessao, registros, ultimaAtividadeEm: dataHora };
}
