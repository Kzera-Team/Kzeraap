import {
  EntradaVocabularioOperacional,
  PayloadVocabularioOperacionalProtegido,
  RegistroVocabularioOperacionalProtegido,
  criarPayloadVocabularioOperacional,
} from '../../domain/vocabulario/VocabularioOperacional';

export interface CriptografadorVocabularioOperacional {
  proteger(payload: PayloadVocabularioOperacionalProtegido): Promise<{
    iv: string;
    payloadProtegido: string;
  }>;
}

export class PrepararVocabularioOperacionalUseCase {
  constructor(private readonly criptografador: CriptografadorVocabularioOperacional) {}

  async executar(entradas: EntradaVocabularioOperacional[], agora = new Date().toISOString()): Promise<RegistroVocabularioOperacionalProtegido> {
    if (!entradas.length) throw new Error('VOCABULARIO_OPERACIONAL_VAZIO');

    const payload = criarPayloadVocabularioOperacional(entradas, agora);
    const protegido = await this.criptografador.proteger(payload);

    return {
      id: 'vocabulario-operacional',
      versao: 1,
      algoritmo: 'AES-GCM',
      iv: protegido.iv,
      saltRef: 'senha-mestra-atual',
      payloadProtegido: protegido.payloadProtegido,
      atualizadoEm: agora,
    };
  }
}
