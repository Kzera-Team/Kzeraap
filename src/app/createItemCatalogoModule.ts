import type { Repository } from '../application/ports/Repository';
import type { Clock } from '../core/Clock';
import type { ItemCatalogo } from '../domain/item/ItemCatalogo';
import type { Balanca } from '../domain/operacao/Balanca';
import { CriarCatalogoItemUseCase } from '../application/item/CriarCatalogoItemUseCase';
import { ListarCatalogoItensUseCase } from '../application/item/ListarCatalogoItensUseCase';
import { EditarCatalogoItemUseCase } from '../application/item/EditarCatalogoItemUseCase';
import { ArquivarCatalogoItemUseCase } from '../application/item/ArquivarCatalogoItemUseCase';
import { ReativarCatalogoItemUseCase } from '../application/item/ReativarCatalogoItemUseCase';
import { ItemDashboardUseCase } from '../application/item/ItemDashboardUseCase';
import { ExportarCatalogoItensUseCase } from '../application/item/ExportarCatalogoItensUseCase';
import { ImportarCatalogoItensUseCase } from '../application/item/ImportarCatalogoItensUseCase';
import { ParseImportacaoCatalogoItensUseCase } from '../application/item/ParseImportacaoCatalogoItensUseCase';
import { RegistrarFracionamentoLoteUseCase } from '../application/item/RegistrarFracionamentoLoteUseCase';
import { PesagemRapidaFracionamentoUseCase } from '../application/item/PesagemRapidaFracionamentoUseCase';
import { BuildSafeItemSpreadsheetImportGateway } from '../infrastructure/importacao/ItemSpreadsheetImportGateway';

export function createItemCatalogoModule(items: Repository<ItemCatalogo>, balancas: Repository<Balanca>, clock: Clock, idFactory: () => string) {
  return {
    criar: new CriarCatalogoItemUseCase(items, clock, idFactory),
    listar: new ListarCatalogoItensUseCase(items),
    editar: new EditarCatalogoItemUseCase(items),
    arquivar: new ArquivarCatalogoItemUseCase(items),
    reativar: new ReativarCatalogoItemUseCase(items),
    dashboard: new ItemDashboardUseCase(items),
    exportar: new ExportarCatalogoItensUseCase(items),
    importar: new ImportarCatalogoItensUseCase(items, clock, idFactory),
    parserImportacao: new ParseImportacaoCatalogoItensUseCase(new BuildSafeItemSpreadsheetImportGateway()),
    registrarFracionamento: new RegistrarFracionamentoLoteUseCase(items, clock, idFactory),
    pesagemRapida: new PesagemRapidaFracionamentoUseCase(items, balancas, clock, idFactory)
  };
}
