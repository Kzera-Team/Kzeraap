import type { Repository } from '../ports/Repository';
import type { Perfil } from '../../domain/perfil/Perfil';
import type { PerfilExportacaoOptions } from '../../domain/perfil/PerfilExportacao';
import { perfisExportacaoParaCsv, prepararPerfisParaExportacao } from '../../domain/perfil/PerfilExportacao';
import { releaseObject } from '../../runtime/RuntimeCleanup';

export class ExportarPerfisUseCase {
  constructor(private readonly perfis: Repository<Perfil>) {}

  async execute(options: PerfilExportacaoOptions = {}): Promise<string> {
    const perfis = await this.perfis.list();
    const linhas = prepararPerfisParaExportacao(perfis, options);

    const csv = perfisExportacaoParaCsv(linhas);
    releaseObject(linhas);
    return csv;
  }
}
