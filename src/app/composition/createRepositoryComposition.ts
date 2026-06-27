import { InMemoryRepository } from '../../infrastructure/repositories/InMemoryRepository';
import type { Repository } from '../../application/ports/Repository';
import type { Perfil } from '../../domain/perfil/Perfil';
import type { PerfilRecord } from '../../runtime/PerfilPayloadFields';
import { PerfilRepository } from '../../infrastructure/repositories/PerfilRepository';
import type { ItemCatalogo } from '../../domain/item/ItemCatalogo';
import type { Balanca } from '../../domain/operacao/Balanca';
import type { ContaFinanceira, MovimentoFinanceiro, PagamentoTransacao, TransacaoFinanceira } from '../../domain/financeiro/Financeiro';
import { FinanceiroProtegidoRepository, type FinanceiroProtegidoRecord } from '../../infrastructure/repositories/FinanceiroProtegidoRepository';
import type { LoteImportacaoFinanceira, LoteImportacaoTransacoes, PacoteConfirmacaoHistorica, PacoteConfirmacaoHistoricaRecord, RegistroImportacaoFinanceira, RegistroImportacaoFinanceiraRecord, RegistroImportacaoTransacao, RegistroImportacaoTransacaoRecord } from '../../domain/importacao/ImportacaoTransacoesFinanceiro';
import { RegistroImportacaoFinanceiraRepository, RegistroImportacaoTransacaoRepository } from '../../infrastructure/repositories/ImportacaoStagingRepository';
import { PacoteConfirmacaoHistoricaRepository } from '../../infrastructure/repositories/PacoteConfirmacaoHistoricaRepository';
import { ImportacaoRascunhoRepository } from '../../infrastructure/repositories/ImportacaoRascunhoRepository';
import { ImportacaoRascunhoUseCase } from '../../application/importacao/ImportacaoRascunhoUseCase';
import type { SessionContext } from '../../runtime/SessionContext';
import { createOperationalPersistence } from '../createOperationalPersistence';

export function createRepositoryComposition(session: SessionContext) {
  const perfisBase = createOperationalPersistence<Perfil>('perfis');
  const perfis: Repository<Perfil> = typeof indexedDB === 'undefined'
    ? new InMemoryRepository<Perfil>()
    : new PerfilRepository(perfisBase as unknown as Repository<PerfilRecord>, session);
  const itens = createOperationalPersistence<ItemCatalogo>('itens');
  const balancas = createOperationalPersistence<Balanca>('balancas');

  const contasFinanceirasBase = createOperationalPersistence<FinanceiroProtegidoRecord>('contasFinanceiras');
  const contasFinanceiras: Repository<ContaFinanceira> = typeof indexedDB === 'undefined'
    ? new InMemoryRepository<ContaFinanceira>()
    : new FinanceiroProtegidoRepository<ContaFinanceira>(contasFinanceirasBase, session, 'conta_financeira');

  const movimentosFinanceirosBase = createOperationalPersistence<FinanceiroProtegidoRecord>('movimentosFinanceiros');
  const movimentosFinanceiros: Repository<MovimentoFinanceiro> = typeof indexedDB === 'undefined'
    ? new InMemoryRepository<MovimentoFinanceiro>()
    : new FinanceiroProtegidoRepository<MovimentoFinanceiro>(movimentosFinanceirosBase, session, 'movimento_financeiro');

  const pagamentosTransacaoBase = createOperationalPersistence<FinanceiroProtegidoRecord>('pagamentosTransacao');
  const pagamentosTransacao: Repository<PagamentoTransacao> = typeof indexedDB === 'undefined'
    ? new InMemoryRepository<PagamentoTransacao>()
    : new FinanceiroProtegidoRepository<PagamentoTransacao>(pagamentosTransacaoBase, session, 'pagamento_transacao');

  const transacoesFinanceirasBase = createOperationalPersistence<FinanceiroProtegidoRecord>('transacoesFinanceiras');
  const transacoesFinanceiras: Repository<TransacaoFinanceira> = typeof indexedDB === 'undefined'
    ? new InMemoryRepository<TransacaoFinanceira>()
    : new FinanceiroProtegidoRepository<TransacaoFinanceira>(transacoesFinanceirasBase, session, 'transacao_financeira');

  const lotesImportacaoTransacoes = createOperationalPersistence<LoteImportacaoTransacoes>('lotesImportacaoTransacoes');
  const registrosImportacaoTransacoesBase = createOperationalPersistence<RegistroImportacaoTransacaoRecord>('registrosImportacaoTransacoes');
  const registrosImportacaoTransacoes: Repository<RegistroImportacaoTransacao> = typeof indexedDB === 'undefined'
    ? new InMemoryRepository<RegistroImportacaoTransacao>()
    : new RegistroImportacaoTransacaoRepository(registrosImportacaoTransacoesBase, session);

  const lotesImportacaoFinanceira = createOperationalPersistence<LoteImportacaoFinanceira>('lotesImportacaoFinanceira');
  const registrosImportacaoFinanceiraBase = createOperationalPersistence<RegistroImportacaoFinanceiraRecord>('registrosImportacaoFinanceira');
  const registrosImportacaoFinanceira: Repository<RegistroImportacaoFinanceira> = typeof indexedDB === 'undefined'
    ? new InMemoryRepository<RegistroImportacaoFinanceira>()
    : new RegistroImportacaoFinanceiraRepository(registrosImportacaoFinanceiraBase, session);

  const pacotesConfirmacaoHistoricaBase = createOperationalPersistence<PacoteConfirmacaoHistoricaRecord>('pacotesConfirmacaoHistorica');
  const pacotesConfirmacaoHistorica: Repository<PacoteConfirmacaoHistorica> = typeof indexedDB === 'undefined'
    ? new InMemoryRepository<PacoteConfirmacaoHistorica>()
    : new PacoteConfirmacaoHistoricaRepository(pacotesConfirmacaoHistoricaBase, session);

  const importacaoRascunhoRepo = new ImportacaoRascunhoRepository(session);
  const importacaoRascunho = new ImportacaoRascunhoUseCase(importacaoRascunhoRepo);

  return {
    perfis,
    itens,
    balancas,
    contasFinanceiras,
    movimentosFinanceiros,
    pagamentosTransacao,
    transacoesFinanceiras,
    lotesImportacaoTransacoes,
    registrosImportacaoTransacoes,
    lotesImportacaoFinanceira,
    registrosImportacaoFinanceira,
    pacotesConfirmacaoHistorica,
    importacaoRascunho
  };
}
