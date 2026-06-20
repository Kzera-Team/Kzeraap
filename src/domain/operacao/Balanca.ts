import type { Entity } from '../../core/Entity';
import { DomainError } from '../../core/DomainError';

export type BalancaStatus = 'ativa' | 'inativa';
export type CalibragemResultado = 'aprovada' | 'atencao' | 'reprovada';

export interface BalancaCalibragem {
  id: string;
  dataHora: string;
  pesoUsado: number;
  unidade: 'mg' | 'g' | 'kg';
  resultado: CalibragemResultado;
  observacao?: string;
}

export interface Balanca extends Entity {
  nome: string;
  codigo: string;
  status: BalancaStatus;
  padrao?: boolean;
  observacao?: string;
  calibragens: BalancaCalibragem[];
}

export interface CriarBalancaInput {
  nome: string;
  codigo?: string;
  status?: BalancaStatus;
  padrao?: boolean;
  observacao?: string;
}

export interface RegistrarCalibragemInput {
  pesoUsado: number;
  unidade: 'mg' | 'g' | 'kg';
  resultado: CalibragemResultado;
  dataHora?: string;
  observacao?: string;
}

export function validarBalanca(input: Pick<Balanca, 'nome' | 'status'>): void {
  if (!input.nome.trim()) throw new DomainError('Balança exige nome ou apelido.', 'BALANCA_NOME_OBRIGATORIO');
  if (!['ativa', 'inativa'].includes(input.status)) throw new DomainError('Status da balança inválido.', 'BALANCA_STATUS_INVALIDO');
}

export function validarCalibragemBalanca(input: RegistrarCalibragemInput): void {
  if (input.pesoUsado <= 0) throw new DomainError('Peso usado na calibragem deve ser maior que zero.', 'BALANCA_CALIBRAGEM_PESO_INVALIDO');
  if (!['mg', 'g', 'kg'].includes(input.unidade)) throw new DomainError('Unidade de calibragem inválida.', 'BALANCA_CALIBRAGEM_UNIDADE_INVALIDA');
  if (!['aprovada', 'atencao', 'reprovada'].includes(input.resultado)) throw new DomainError('Resultado de calibragem inválido.', 'BALANCA_CALIBRAGEM_RESULTADO_INVALIDO');
}

export function criarBalanca(input: CriarBalancaInput, id: string, now: string): Balanca {
  const balanca: Balanca = {
    id,
    nome: input.nome.trim(),
    codigo: input.codigo?.trim() || '',
    status: input.status || 'ativa',
    padrao: Boolean(input.padrao),
    calibragens: [],
    createdAt: now,
    updatedAt: now
  };
  if (input.observacao?.trim()) balanca.observacao = input.observacao.trim();
  validarBalanca(balanca);
  return balanca;
}

export function registrarCalibragemNaBalanca(balanca: Balanca, input: RegistrarCalibragemInput, id: string, now: string): Balanca {
  validarCalibragemBalanca(input);
  const calibragem: BalancaCalibragem = {
    id,
    dataHora: input.dataHora || now,
    pesoUsado: input.pesoUsado,
    unidade: input.unidade,
    resultado: input.resultado
  };
  if (input.observacao?.trim()) calibragem.observacao = input.observacao.trim();
  return { ...balanca, calibragens: [calibragem, ...balanca.calibragens], updatedAt: now };
}

export function selecionarBalancaOperacional(balancas: Balanca[]): Balanca | undefined {
  const ativas = balancas.filter(balanca => balanca.status === 'ativa');
  return ativas.find(balanca => balanca.padrao) || (ativas.length === 1 ? ativas[0] : undefined);
}

export function exigirBalancaParaPesagem(balancas: Balanca[]): { pronta: boolean; mensagem: string; balanca?: Balanca } {
  const ativas = balancas.filter(balanca => balanca.status === 'ativa');
  if (!ativas.length) return { pronta: false, mensagem: 'Cadastre uma balança ativa em Configurações antes de iniciar pesagem.' };
  const selecionada = selecionarBalancaOperacional(balancas);
  if (selecionada) return { pronta: true, mensagem: `Balança sugerida: ${selecionada.nome}.`, balanca: selecionada };
  return { pronta: false, mensagem: 'Escolha qual balança ativa será usada antes de pesar.' };
}
