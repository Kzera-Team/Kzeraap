// v0.19.27
import type { ImportacaoRascunhoRepository, RascunhoImportacao } from '../../infrastructure/repositories/ImportacaoRascunhoRepository';

export type TipoRascunho = 'perfis' | 'itens' | 'transacoes';

export interface SalvarRascunhoPerfilInput {
  tipo: 'perfis';
  previewCount: number;
}

export interface SalvarRascunhoItemInput {
  tipo: 'itens';
  previewCount: number;
}

export interface SalvarRascunhoTransacoesInput {
  tipo: 'transacoes';
}

export type SalvarRascunhoInput =
  | SalvarRascunhoPerfilInput
  | SalvarRascunhoItemInput
  | SalvarRascunhoTransacoesInput;

export class ImportacaoRascunhoUseCase {
  constructor(private readonly repo: ImportacaoRascunhoRepository) {}

  async salvar(input: SalvarRascunhoInput): Promise<void> {
    const agora = new Date().toISOString();
    let rascunho: RascunhoImportacao;

    if (input.tipo === 'transacoes') {
      rascunho = {
        id: `rascunho-${input.tipo}`,
        tipo: input.tipo,
        tela: 'transacoes',
        updatedAt: agora
      };
    } else {
      rascunho = {
        id: `rascunho-${input.tipo}`,
        tipo: input.tipo,
        tela: input.tipo === 'perfis' ? 'importacao-perfis' : 'importacao-itens',
        previewCount: input.previewCount,
        updatedAt: agora
      };
    }

    await this.repo.salvar(rascunho);
  }

  async listar(): Promise<RascunhoImportacao[]> {
    return this.repo.listar();
  }

  async descartar(tipo: TipoRascunho): Promise<void> {
    await this.repo.remover(`rascunho-${tipo}`);
  }

  async descartarTodos(): Promise<void> {
    const todos = await this.repo.listar();
    await Promise.all(todos.map(r => this.repo.remover(r.id)));
  }
}
