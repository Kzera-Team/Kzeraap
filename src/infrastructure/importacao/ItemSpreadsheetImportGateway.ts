import type { ItemImportacaoParseResult } from '../../domain/item/ItemImportacaoParser';

export interface ItemSpreadsheetImportGateway {
  read(file: File): Promise<ItemImportacaoParseResult>;
}

/**
 * 1.18.7: gateway de planilha isolado do build oficial.
 *
 * XLS/XLSX não pode impedir o app de instalar/gerar build. Enquanto o adaptador
 * robusto de Excel não entra, a usuária recebe orientação clara para CSV.
 */
export class BuildSafeItemSpreadsheetImportGateway implements ItemSpreadsheetImportGateway {
  async read(_file: File): Promise<ItemImportacaoParseResult> {
    return {
      linhas: [],
      colunasIgnoradas: [],
      erros: [
        'Planilha Excel temporariamente bloqueada nesta versão para proteger a instalação. Exporte como CSV e importe novamente.'
      ]
    };
  }
}
