import type { PerfilImportacaoParseResult } from '../../domain/perfil/PerfilImportacaoParser';
import { parsePerfilImportacaoCsvTsv } from '../../domain/perfil/PerfilImportacaoParser';

export class ParseImportacaoPerfisUseCase {
  execute(content: string): PerfilImportacaoParseResult {
    return parsePerfilImportacaoCsvTsv(content);
  }
}
