import { detectarFormatoImportacaoPerfil, isFormatoPlanilhaPerfil } from '../../domain/perfil/PerfilImportacaoArquivo';
import type { PerfilImportacaoParseResult } from '../../domain/perfil/PerfilImportacaoParser';
import { parsePerfilImportacaoCsvTsv } from '../../domain/perfil/PerfilImportacaoParser';
import type { PerfilSpreadsheetImportGateway } from '../../infrastructure/importacao/PerfilSpreadsheetImportGateway';

export class ImportacaoPerfisArquivoUseCase {
  constructor(private readonly spreadsheetGateway: PerfilSpreadsheetImportGateway) {}

  async execute(file: File): Promise<PerfilImportacaoParseResult> {
    const formato = detectarFormatoImportacaoPerfil(file.name);

    if (isFormatoPlanilhaPerfil(formato)) {
      return this.spreadsheetGateway.read(file);
    }

    const content = await file.text();
    return parsePerfilImportacaoCsvTsv(content);
  }
}
