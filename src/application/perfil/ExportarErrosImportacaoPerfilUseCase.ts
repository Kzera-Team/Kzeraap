import type { PerfilImportacaoErro } from '../../domain/perfil/PerfilImportacaoErro';
import { exportarErrosImportacaoCsv } from '../../domain/perfil/PerfilImportacaoErro';

export class ExportarErrosImportacaoPerfilUseCase {
  execute(erros: PerfilImportacaoErro[]): string {
    return exportarErrosImportacaoCsv(erros);
  }
}
