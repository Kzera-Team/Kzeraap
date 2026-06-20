import type { Controller } from '../contracts/Controller';
import type { FluxoImportacaoPerfisUseCase } from '../../application/perfil/FluxoImportacaoPerfisUseCase';

export interface PerfilImportacaoView {
  renderEmpty(root: HTMLElement): Promise<void>;
  renderPreview(root: HTMLElement, data: unknown): Promise<void>;
  renderResult(root: HTMLElement, data: unknown): Promise<void>;
}

export class PerfilImportacaoController implements Controller {
  constructor(
    private readonly fluxo: FluxoImportacaoPerfisUseCase,
    private readonly view: PerfilImportacaoView
  ) {}

  async mount(root: HTMLElement): Promise<void> {
    await this.view.renderEmpty(root);
  }

  async carregarArquivo(root: HTMLElement, file: File): Promise<void> {
    const state = await this.fluxo.carregarArquivo(file);
    await this.view.renderPreview(root, state);
  }

  async atualizarRegistro(root: HTMLElement, index: number, patch: Record<string, unknown>): Promise<void> {
    const state = this.fluxo.atualizarRegistro(index, patch);
    await this.view.renderPreview(root, state);
  }

  async confirmar(root: HTMLElement): Promise<void> {
    const result = await this.fluxo.confirmar();
    await this.view.renderResult(root, result);
  }
}
