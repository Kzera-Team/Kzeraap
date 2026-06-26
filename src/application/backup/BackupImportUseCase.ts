import type { Repository } from '../ports/Repository';
import { PayloadProvider } from '../../runtime/PayloadProvider';
import type { SessionContext } from '../../runtime/SessionContext';
import type { Perfil } from '../../domain/perfil/Perfil';
import type { ItemCatalogo } from '../../domain/item/ItemCatalogo';
import type { Balanca } from '../../domain/operacao/Balanca';
import type { ContaFinanceira, MovimentoFinanceiro, PagamentoTransacao, TransacaoFinanceira } from '../../domain/financeiro/Financeiro';
import type { LoteImportacaoFinanceira, LoteImportacaoTransacoes, RegistroImportacaoFinanceira, RegistroImportacaoTransacao } from '../../domain/importacao/ImportacaoTransacoesFinanceiro';
import type { BackupEnvelopeV1, BackupPayload } from './BackupExportUseCase';

export interface BackupImportRepositories {
  perfis: Repository<Perfil>;
  itens: Repository<ItemCatalogo>;
  balancas: Repository<Balanca>;
  contasFinanceiras: Repository<ContaFinanceira>;
  movimentosFinanceiros: Repository<MovimentoFinanceiro>;
  pagamentosTransacao: Repository<PagamentoTransacao>;
  transacoesFinanceiras: Repository<TransacaoFinanceira>;
  lotesImportacaoTransacoes: Repository<LoteImportacaoTransacoes>;
  registrosImportacaoTransacoes: Repository<RegistroImportacaoTransacao>;
  lotesImportacaoFinanceira: Repository<LoteImportacaoFinanceira>;
  registrosImportacaoFinanceira: Repository<RegistroImportacaoFinanceira>;
}

export interface BackupImportResult {
  perfis: number;
  itens: number;
  financeiros: number;
  importacao: number;
}

async function saveAll<T extends { id: string }>(repository: Repository<T>, records: T[] | undefined): Promise<number> {
  const list = records || [];
  for (const record of list) await repository.save(record);
  return list.length;
}

export class BackupImportUseCase {
  constructor(
    private readonly repositories: BackupImportRepositories,
    private readonly session: SessionContext
  ) {}

  async execute(fileText: string): Promise<BackupImportResult> {
    const envelope = JSON.parse(fileText) as BackupEnvelopeV1;
    if (envelope.schemaVersion !== 1 || !envelope.encryptedPayload) {
      throw new Error('Arquivo de backup inválido.');
    }

    const provider = new PayloadProvider(this.session);
    const payload = await provider.unpackJson<BackupPayload>(envelope.encryptedPayload, 'backup:v1');
    const data = payload.data;

    const perfis = await saveAll(this.repositories.perfis, data.perfis as Perfil[]);
    const itens = await saveAll(this.repositories.itens, data.itens as ItemCatalogo[]);
    await saveAll(this.repositories.balancas, data.balancas as Balanca[] | undefined);

    const contas = await saveAll(this.repositories.contasFinanceiras, data.contasFinanceiras as ContaFinanceira[] | undefined);
    const movimentos = await saveAll(this.repositories.movimentosFinanceiros, data.movimentosFinanceiros as MovimentoFinanceiro[] | undefined);
    const pagamentos = await saveAll(this.repositories.pagamentosTransacao, data.pagamentosTransacao as PagamentoTransacao[] | undefined);
    const transacoes = await saveAll(this.repositories.transacoesFinanceiras, data.transacoesFinanceiras as TransacaoFinanceira[] | undefined);

    const lotesTransacoes = await saveAll(this.repositories.lotesImportacaoTransacoes, data.lotesImportacaoTransacoes as LoteImportacaoTransacoes[] | undefined);
    const registrosTransacoes = await saveAll(this.repositories.registrosImportacaoTransacoes, data.registrosImportacaoTransacoes as RegistroImportacaoTransacao[] | undefined);
    const lotesFinanceiros = await saveAll(this.repositories.lotesImportacaoFinanceira, data.lotesImportacaoFinanceira as LoteImportacaoFinanceira[] | undefined);
    const registrosFinanceiros = await saveAll(this.repositories.registrosImportacaoFinanceira, data.registrosImportacaoFinanceira as RegistroImportacaoFinanceira[] | undefined);

    return {
      perfis,
      itens,
      financeiros: contas + movimentos + pagamentos + transacoes,
      importacao: lotesTransacoes + registrosTransacoes + lotesFinanceiros + registrosFinanceiros
    };
  }
}
