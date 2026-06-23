import type { PerfilImportacaoPreviewRegistro } from '../../domain/perfil/PerfilImportacao';
import { CIDADE_PADRAO_IMPORTACAO_PERFIL } from '../../domain/perfil/PerfilImportacao';
import type { ImportarPerfilInput, ImportarPerfisResultado } from './ImportarPerfisSemBairroUseCase';
import { ImportarPerfisSemBairroUseCase } from './ImportarPerfisSemBairroUseCase';
import type { Repository } from '../ports/Repository';
import type { Clock } from '../../core/Clock';
import type { Perfil } from '../../domain/perfil/Perfil';

export interface ConfirmarImportacaoPerfisResultado extends ImportarPerfisResultado {
  ignoradosInvalidos: PerfilImportacaoPreviewRegistro[];
}

function toImportInput(registro: PerfilImportacaoPreviewRegistro): ImportarPerfilInput {
  const input: ImportarPerfilInput = {
    nome: registro.nome.trim(),
    cidade: CIDADE_PADRAO_IMPORTACAO_PERFIL,
    conhecePessoalmente: Boolean(registro.conhecePessoalmente)
  };

  if (registro.telefone !== undefined) input.telefone = registro.telefone;
  if (registro.email !== undefined) input.email = registro.email;
  if (registro.bairro !== undefined && registro.bairro !== '') input.bairro = registro.bairro;

  return input;
}

export class ConfirmarImportacaoPerfisUseCase {
  private readonly importar: ImportarPerfisSemBairroUseCase;

  constructor(
    perfis: Repository<Perfil>,
    clock: Clock,
    idFactory: () => string
  ) {
    this.importar = new ImportarPerfisSemBairroUseCase(perfis, clock, idFactory);
  }

  async execute(registros: PerfilImportacaoPreviewRegistro[]): Promise<ConfirmarImportacaoPerfisResultado> {
    const validos = registros.filter(registro => registro.valido && !registro.excluido);
    const invalidos = registros.filter(registro => !registro.valido || registro.excluido);

    if (validos.length === 0) {
      throw new Error('Nenhum registro válido para importar.');
    }

    const inputs: ImportarPerfilInput[] = validos.map(toImportInput);
    const resultado = await this.importar.execute(inputs);

    return {
      ...resultado,
      ignoradosInvalidos: invalidos
    };
  }
}
