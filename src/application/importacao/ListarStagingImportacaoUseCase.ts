import type { Repository } from '../ports/Repository';
import { resumirRegistrosImportacao, type LoteImportacaoFinanceira, type LoteImportacaoTransacoes, type RegistroImportacaoFinanceira, type RegistroImportacaoTransacao, type ResumoStagingImportacao } from '../../domain/importacao/ImportacaoTransacoesFinanceiro';

export interface StagingImportacaoResumo {
  totalRegistrosTransacoes: number;
  totalRegistrosFinanceiros: number;
  limiteVisualizacao: number;
  lotesTransacoes: LoteImportacaoTransacoes[];
  registrosTransacoes: RegistroImportacaoTransacao[];
  resumoTransacoes: ResumoStagingImportacao;
  lotesFinanceiros: LoteImportacaoFinanceira[];
  registrosFinanceiros: RegistroImportacaoFinanceira[];
  resumoFinanceiro: ResumoStagingImportacao;
}

export class ListarStagingImportacaoUseCase {
  constructor(
    private readonly lotesTransacoes: Repository<LoteImportacaoTransacoes>,
    private readonly registrosTransacoes: Repository<RegistroImportacaoTransacao>,
    private readonly lotesFinanceiros: Repository<LoteImportacaoFinanceira>,
    private readonly registrosFinanceiros: Repository<RegistroImportacaoFinanceira>
  ) {}

  async execute(): Promise<StagingImportacaoResumo> {
    const limiteVisualizacao = 80;
    const registrosTransacoes = await this.registrosTransacoes.list();
    const registrosFinanceiros = await this.registrosFinanceiros.list();
    const resumoTransacoes = resumirRegistrosImportacao(registrosTransacoes);
    const resumoFinanceiro = resumirRegistrosImportacao(registrosFinanceiros);
    return {
      totalRegistrosTransacoes: registrosTransacoes.length,
      totalRegistrosFinanceiros: registrosFinanceiros.length,
      limiteVisualizacao,
      lotesTransacoes: await this.lotesTransacoes.list(),
      registrosTransacoes: registrosTransacoes.slice(-limiteVisualizacao),
      resumoTransacoes,
      lotesFinanceiros: await this.lotesFinanceiros.list(),
      registrosFinanceiros: registrosFinanceiros.slice(-limiteVisualizacao),
      resumoFinanceiro
    };
  }
}
