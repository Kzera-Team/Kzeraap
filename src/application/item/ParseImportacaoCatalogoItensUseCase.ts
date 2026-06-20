import type { ItemImportacaoParseResult } from '../../domain/item/ItemImportacaoParser';
import { parseItemImportacaoCsvTsv } from '../../domain/item/ItemImportacaoParser';
import type { ItemSpreadsheetImportGateway } from '../../infrastructure/importacao/ItemSpreadsheetImportGateway';

export class ParseImportacaoCatalogoItensUseCase {
  constructor(private readonly spreadsheetGateway?: ItemSpreadsheetImportGateway) {}

  async execute(file: File): Promise<ItemImportacaoParseResult> {
    const name = file.name.toLowerCase();

    if ((name.endsWith('.xls') || name.endsWith('.xlsx')) && this.spreadsheetGateway) {
      return this.spreadsheetGateway.read(file);
    }

    return parseItemImportacaoCsvTsv(await file.text());
  }
}
