import type { PerfilImportacaoLinha } from '../../domain/perfil/PerfilImportacao';

export interface PerfilSpreadsheetImportResult {
  linhas: PerfilImportacaoLinha[];
  colunasIgnoradas: string[];
  erros: string[];
}

export interface PerfilSpreadsheetImportGateway {
  read(file: File): Promise<PerfilSpreadsheetImportResult>;
}

/**
 * 1.18.7: gateway de planilha isolado do build oficial.
 *
 * A dependência xlsx quebrava `npm ci` por causa do subpacote codepage no
 * registry do ambiente. Para não matar o app inteiro por causa de um parser
 * de planilha, XLS/XLSX fica bloqueado com mensagem humana até ser reintroduzido
 * por adaptador assíncrono testado. CSV/TSV/TXT continuam no use case.
 */
export class BuildSafePerfilSpreadsheetImportGateway implements PerfilSpreadsheetImportGateway {
  async read(_file: File): Promise<PerfilSpreadsheetImportResult> {
    return {
      linhas: [],
      colunasIgnoradas: [],
      erros: [
        'Planilha Excel temporariamente bloqueada nesta versão para proteger a instalação. Exporte como CSV e importe novamente.'
      ]
    };
  }
}
