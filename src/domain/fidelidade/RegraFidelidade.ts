export type RegraFidelidadeStatus = 'ativa' | 'inativa' | 'arquivada';

export interface PremioFidelidade {
  passo: number;
  descricao: string;
  itemId: string;
  itemNome: string;
  ativo: boolean;
}

export interface RegraFidelidade {
  id: string;
  nome: string;
  status: RegraFidelidadeStatus;
  totalPassos: number;
  periodoInicio: string;
  periodoFim?: string;
  regraPassoItemId: string;
  regraPassoItemNome: string;
  regraPassoQuantidade: number;
  regraPassoUnidade: string;
  regraPassoPassosGerados: number;
  premios: PremioFidelidade[];
  createdAt: string;
  updatedAt: string;
}

export function validarRegraFidelidade(input: {
  nome?: string;
  totalPassos?: number;
  periodoInicio?: string;
  regraPassoItemId?: string;
  regraPassoQuantidade?: number;
  premios?: PremioFidelidade[];
}): string[] {
  const erros: string[] = [];
  if (!input.nome?.trim()) erros.push('Nome da regra é obrigatório.');
  if (!input.totalPassos || input.totalPassos < 1) erros.push('Total de passos deve ser no mínimo 1.');
  if (!input.periodoInicio) erros.push('Data de início é obrigatória.');
  if (!input.regraPassoItemId?.trim()) erros.push('Item da regra de passo é obrigatório.');
  if (!input.regraPassoQuantidade || input.regraPassoQuantidade < 1) erros.push('Quantidade mínima é 1.');
  for (const premio of input.premios ?? []) {
    if (premio.passo < 1 || premio.passo > (input.totalPassos ?? 1)) {
      erros.push(`Passo ${premio.passo} do prêmio "${premio.descricao}" está fora do intervalo válido.`);
    }
  }
  return erros;
}
