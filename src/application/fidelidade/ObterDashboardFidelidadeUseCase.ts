export interface DashboardFidelidadeResultado {
  comCartao: number;
  semCartao: number;
}

export class ObterDashboardFidelidadeUseCase {
  async execute(): Promise<DashboardFidelidadeResultado> {
    return { comCartao: 0, semCartao: 0 };
  }
}
