import type {
  CandidatoDuplicidadePerfil,
  EscopoImportacaoPerfis,
  ImportacaoPerfisAggregate,
  PerfilImportacaoSeguraInput
} from '../../../domain/importacao/perfis/ImportacaoPerfisSegura';

export interface ImportacaoPerfisStore {
  obter(escopo: EscopoImportacaoPerfis): Promise<ImportacaoPerfisAggregate | null>;
  salvar(aggregate: ImportacaoPerfisAggregate): Promise<void>;
  remover(escopo: EscopoImportacaoPerfis): Promise<void>;
}

export interface PerfilCriadoImportacao {
  perfilId: string;
}

export interface PerfilImportacaoGateway {
  localizarCandidatos(
    escopo: EscopoImportacaoPerfis,
    input: PerfilImportacaoSeguraInput
  ): Promise<CandidatoDuplicidadePerfil[]>;

  obterPorId(
    escopo: EscopoImportacaoPerfis,
    perfilId: string
  ): Promise<CandidatoDuplicidadePerfil | null>;

  criar(
    escopo: EscopoImportacaoPerfis,
    input: PerfilImportacaoSeguraInput
  ): Promise<PerfilCriadoImportacao>;
}

export interface ImportacaoPerfisLock {
  executarExclusivo<T>(
    chave: string,
    action: () => Promise<T>
  ): Promise<T>;
}

export interface ImportacaoPerfisClock {
  now(): Date;
}
