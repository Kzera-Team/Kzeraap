import { TokenVocabularioOperacional } from '../../domain/vocabulario/VocabularioOperacional';

export class VocabularioOperacionalSession {
  private readonly rotulos = new Map<TokenVocabularioOperacional, string>();

  carregar(entradas: Array<{ token: TokenVocabularioOperacional; rotulo: string }>): void {
    this.rotulos.clear();
    for (const entrada of entradas) this.rotulos.set(entrada.token, entrada.rotulo);
  }

  obterRotulo(token: TokenVocabularioOperacional): string | undefined {
    return this.rotulos.get(token);
  }

  limpar(): void {
    this.rotulos.clear();
  }

  estaCarregado(): boolean {
    return this.rotulos.size > 0;
  }
}
