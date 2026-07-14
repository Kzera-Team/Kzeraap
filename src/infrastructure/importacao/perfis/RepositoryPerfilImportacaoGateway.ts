import type { Repository } from '../../../application/ports/Repository';
import type {
  ImportacaoPerfisLock,
  PerfilCriadoImportacao,
  PerfilImportacaoGateway
} from '../../../application/importacao/perfis/ImportacaoPerfisSeguraPorts';
import type { Clock } from '../../../core/Clock';
import {
  ImportacaoPerfisDomainError,
  normalizarEmailImportacaoPerfil,
  normalizarTelefoneImportacaoPerfil,
  type CandidatoDuplicidadePerfil,
  type EscopoImportacaoPerfis,
  type EvidenciaDuplicidadePerfil,
  type PerfilImportacaoSeguraInput
} from '../../../domain/importacao/perfis/ImportacaoPerfisSegura';
import type { Perfil } from '../../../domain/perfil/Perfil';

function assignOptional<K extends keyof Perfil>(
  target: Perfil,
  key: K,
  value: Perfil[K] | undefined
): void {
  if (value !== undefined && value !== '') {
    Object.assign(target, { [key]: value });
  }
}

export class RepositoryPerfilImportacaoGateway implements PerfilImportacaoGateway {
  constructor(
    private readonly usuarioId: string,
    private readonly perfis: Repository<Perfil>,
    private readonly clock: Clock,
    private readonly idFactory: () => string
  ) {
    if (!usuarioId.trim()) {
      throw new ImportacaoPerfisDomainError(
        'Usuario proprietario do gateway e obrigatorio.',
        'GATEWAY_SEM_USUARIO'
      );
    }
  }

  async localizarCandidatos(
    escopo: EscopoImportacaoPerfis,
    input: PerfilImportacaoSeguraInput
  ): Promise<CandidatoDuplicidadePerfil[]> {
    this.assertUsuario(escopo);
    const telefone = normalizarTelefoneImportacaoPerfil(input.telefone);
    const email = normalizarEmailImportacaoPerfil(input.email);
    const candidatos: CandidatoDuplicidadePerfil[] = [];

    for (const perfil of await this.perfis.list()) {
      const evidencias: EvidenciaDuplicidadePerfil[] = [];
      if (telefone && normalizarTelefoneImportacaoPerfil(perfil.telefone) === telefone) {
        evidencias.push('telefone');
      }
      if (email && normalizarEmailImportacaoPerfil(perfil.email) === email) {
        evidencias.push('email');
      }
      if (evidencias.length > 0) {
        candidatos.push({ perfilId: perfil.id, evidencias });
      }
    }

    return candidatos;
  }

  async obterPorId(
    escopo: EscopoImportacaoPerfis,
    perfilId: string
  ): Promise<CandidatoDuplicidadePerfil | null> {
    this.assertUsuario(escopo);
    const perfil = await this.perfis.getById(perfilId);
    return perfil ? { perfilId: perfil.id, evidencias: [] } : null;
  }

  async criar(
    escopo: EscopoImportacaoPerfis,
    input: PerfilImportacaoSeguraInput,
    operationKey: string
  ): Promise<PerfilCriadoImportacao> {
    this.assertUsuario(escopo);
    const idempotente = (await this.perfis.list()).find(
      perfil => perfil.ultimaImportacaoId === operationKey
    );
    if (idempotente) return { perfilId: idempotente.id };

    const agora = this.clock.now().toISOString();
    const perfil: Perfil = {
      id: this.idFactory(),
      nome: input.nome.trim(),
      conhecePessoalmente: input.conhecePessoalmente,
      status: 'ativo',
      createdAt: agora,
      updatedAt: agora,
      ultimaImportacaoId: operationKey
    };

    assignOptional(perfil, 'telefone', input.telefone?.trim());
    assignOptional(perfil, 'email', input.email?.trim());
    assignOptional(perfil, 'bairro', input.bairro?.trim());
    assignOptional(perfil, 'municipio', input.municipio?.trim());

    const salvo = await this.perfis.save(perfil);
    return { perfilId: salvo.id };
  }

  private assertUsuario(escopo: EscopoImportacaoPerfis): void {
    if (escopo.usuarioId !== this.usuarioId) {
      throw new ImportacaoPerfisDomainError(
        'Tentativa de operar perfis de outra usuaria.',
        'VIOLACAO_ISOLAMENTO_USUARIO'
      );
    }
  }
}

export class InMemoryImportacaoPerfisLock implements ImportacaoPerfisLock {
  private readonly emExecucao = new Set<string>();

  async executarExclusivo<T>(chave: string, action: () => Promise<T>): Promise<T> {
    if (this.emExecucao.has(chave)) {
      throw new ImportacaoPerfisDomainError(
        'Submissao simultanea bloqueada.',
        'DUPLA_SUBMISSAO_BLOQUEADA'
      );
    }

    this.emExecucao.add(chave);
    try {
      return await action();
    } finally {
      this.emExecucao.delete(chave);
    }
  }
}
