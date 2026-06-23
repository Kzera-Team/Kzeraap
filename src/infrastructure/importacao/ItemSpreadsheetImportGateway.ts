import { ERRO_IMPORTACAO_ITEM_ARQUIVO_NAO_SUPORTADO } from '../../domain/item/ItemImportacaoErro';
import type { ItemImportacaoParseResult } from '../../domain/item/ItemImportacaoParser';

export interface ItemSpreadsheetImportGateway {
  read(file: File): Promise<ItemImportacaoParseResult>;
}

/**
 * 1.18.7: gateway de planilha isolado do build oficial.
 *
 * XLS/XLSX não pode impedir o app de instalar/gerar build. Enquanto o adaptador
 * robusto de Excel não entra, o gateway devolve erro semântico para a camada de apresentação.
 */
export class BuildSafeItemSpreadsheetImportGateway implements ItemSpreadsheetImportGateway {
  async read(_file: File): Promise<ItemImportacaoParseResult> {
    return {
      linhas: [],
      colunasIgnoradas: [],
      erros: [ERRO_IMPORTACAO_ITEM_ARQUIVO_NAO_SUPORTADO]
    };
  }
}
