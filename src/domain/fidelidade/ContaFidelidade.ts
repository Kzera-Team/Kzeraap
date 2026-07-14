import { ValorInvalidoError } from './FidelidadeErrors';

export interface ContaFidelidade {
  id: string;
  proprietariaId: string;
  clienteId: string;
  saldoPontos: number;
  versao: number;
  criadaEm: string;
  atualizadaEm: string;
}

export function criarContaFidelidade(id: string, proprietariaId: string, clienteId: string, agora: string): ContaFidelidade {
  validarId(id, 'id');
  validarId(proprietariaId, 'proprietariaId');
  validarId(clienteId, 'clienteId');
  return { id, proprietariaId, clienteId, saldoPontos: 0, versao: 0, criadaEm: agora, atualizadaEm: agora };
}

export function creditarPontos(conta: ContaFidelidade, pontos: number, agora: string): ContaFidelidade {
  validarPontos(pontos);
  return { ...conta, saldoPontos: conta.saldoPontos + pontos, versao: conta.versao + 1, atualizadaEm: agora };
}

export function debitarPontos(conta: ContaFidelidade, pontos: number, agora: string): ContaFidelidade {
  validarPontos(pontos);
  if (conta.saldoPontos < pontos) throw new ValorInvalidoError('saldoPontos');
  return { ...conta, saldoPontos: conta.saldoPontos - pontos, versao: conta.versao + 1, atualizadaEm: agora };
}

function validarPontos(pontos: number): void {
  if (!Number.isInteger(pontos) || pontos <= 0) throw new ValorInvalidoError('pontos');
}
function validarId(value: string, campo: string): void {
  if (value.trim().length === 0) throw new ValorInvalidoError(campo);
}
