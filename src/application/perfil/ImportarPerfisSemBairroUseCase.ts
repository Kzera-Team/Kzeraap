import type { Repository } from '../ports/Repository';
import type { Clock } from '../../core/Clock';
import type { Perfil } from '../../domain/perfil/Perfil';
import { CIDADE_PADRAO_IMPORTACAO_CLIENTE } from '../../domain/perfil/PerfilImportacao';
import { CriarPerfilUseCase, type CriarPerfilInput } from './CriarPerfilUseCase';

export interface ImportarPerfilInput {
  nome: string;
  telefone?: string;
  email?: string;
  conhecePessoalmente?: boolean;
  cidade?: string;
  bairro?: string;
  observacoes?: string;
}

export interface ImportarPerfisResultado {
  importados: Perfil[];
  rejeitados: Array<{ input: ImportarPerfilInput; motivo: string }>;
}

function montarCriarInput(input: ImportarPerfilInput): CriarPerfilInput {
  const criar: CriarPerfilInput = {
    nome: input.nome,
    municipio: input.cidade || CIDADE_PADRAO_IMPORTACAO_CLIENTE,
    conhecePessoalmente: Boolean(input.conhecePessoalmente)
  };

  if (input.telefone !== undefined) criar.telefone = input.telefone;
  if (input.email !== undefined) criar.email = input.email;
  if (input.bairro !== undefined) criar.bairro = input.bairro;
  if (input.observacoes !== undefined) criar.observacoes = input.observacoes;

  return criar;
}

export class ImportarPerfisSemBairroUseCase {
  private readonly criarPerfil: CriarPerfilUseCase;

  constructor(
    private readonly perfis: Repository<Perfil>,
    private readonly clock: Clock,
    private readonly idFactory: () => string
  ) {
    this.criarPerfil = new CriarPerfilUseCase(perfis, clock, idFactory);
  }

  async execute(inputs: ImportarPerfilInput[]): Promise<ImportarPerfisResultado> {
    const importados: Perfil[] = [];
    const rejeitados: Array<{ input: ImportarPerfilInput; motivo: string }> = [];

    for (const input of inputs) {
      try {
        const perfil = await this.criarPerfil.execute(montarCriarInput(input));
        importados.push(perfil);
      } catch (error) {
        rejeitados.push({
          input,
          motivo: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }

    return {
      importados,
      rejeitados
    };
  }
}

// Contrato de importação: bairro: input.bairro quando preenchido.
