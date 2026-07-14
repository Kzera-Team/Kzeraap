import type {
  ImportacaoPerfisClock,
  ImportacaoPerfisStore,
  PerfilCriadoImportacao,
  PerfilImportacaoGateway
} from '../../src/application/importacao/perfis/ImportacaoPerfisSeguraPorts';
import { CancelarImportacaoPerfisSeguraUseCase } from '../../src/application/importacao/perfis/CancelarImportacaoPerfisSeguraUseCase';
import { ConfirmarImportacaoPerfisSeguraUseCase } from '../../src/application/importacao/perfis/ConfirmarImportacaoPerfisSeguraUseCase';
import { GerenciarRascunhoImportacaoPerfisUseCase } from '../../src/application/importacao/perfis/GerenciarRascunhoImportacaoPerfisUseCase';
import { PrepararImportacaoPerfisSeguraUseCase } from '../../src/application/importacao/perfis/PrepararImportacaoPerfisSeguraUseCase';
import { ReprocessarImportacaoPerfisSeguraUseCase } from '../../src/application/importacao/perfis/ReprocessarImportacaoPerfisSeguraUseCase';
import {
  chaveEscopoImportacaoPerfis,
  normalizarEmailImportacaoPerfil,
  normalizarTelefoneImportacaoPerfil,
  type CandidatoDuplicidadePerfil,
  type EscopoImportacaoPerfis,
  type ImportacaoPerfisAggregate,
  type PerfilImportacaoSeguraInput
} from '../../src/domain/importacao/perfis/ImportacaoPerfisSegura';
import { InMemoryImportacaoPerfisLock } from '../../src/infrastructure/importacao/perfis/RepositoryPerfilImportacaoGateway';

export class FixedClock implements ImportacaoPerfisClock {
  private tick = 0;

  now(): Date {
    this.tick += 1;
    return new Date(Date.UTC(2026, 6, 14, 12, 0, 0, this.tick));
  }
}

export class MemoryImportacaoPerfisStore implements ImportacaoPerfisStore {
  readonly values = new Map<string, ImportacaoPerfisAggregate>();
  failOnSave = false;

  async obter(escopo: EscopoImportacaoPerfis): Promise<ImportacaoPerfisAggregate | null> {
    const value = this.values.get(chaveEscopoImportacaoPerfis(escopo));
    return value ? structuredClone(value) : null;
  }

  async salvar(aggregate: ImportacaoPerfisAggregate): Promise<void> {
    if (this.failOnSave) throw new Error('persistencia indisponivel');
    this.values.set(aggregate.id, structuredClone(aggregate));
  }

  async remover(escopo: EscopoImportacaoPerfis): Promise<void> {
    this.values.delete(chaveEscopoImportacaoPerfis(escopo));
  }
}

interface FakePerfil {
  id: string;
  telefone?: string;
  email?: string;
}

export class FakePerfilGateway implements PerfilImportacaoGateway {
  readonly existing: FakePerfil[] = [];
  readonly operations = new Map<string, string>();
  readonly failOperationContains = new Set<string>();
  createdCount = 0;
  allowedUsuarioId = 'user-1';

  async localizarCandidatos(
    escopo: EscopoImportacaoPerfis,
    input: PerfilImportacaoSeguraInput
  ): Promise<CandidatoDuplicidadePerfil[]> {
    this.assertUser(escopo);
    const telefone = normalizarTelefoneImportacaoPerfil(input.telefone);
    const email = normalizarEmailImportacaoPerfil(input.email);

    return this.existing.flatMap(perfil => {
      const evidencias: CandidatoDuplicidadePerfil['evidencias'] = [];
      if (telefone && normalizarTelefoneImportacaoPerfil(perfil.telefone) === telefone) {
        evidencias.push('telefone');
      }
      if (email && normalizarEmailImportacaoPerfil(perfil.email) === email) {
        evidencias.push('email');
      }
      return evidencias.length > 0 ? [{ perfilId: perfil.id, evidencias }] : [];
    });
  }

  async obterPorId(
    escopo: EscopoImportacaoPerfis,
    perfilId: string
  ): Promise<CandidatoDuplicidadePerfil | null> {
    this.assertUser(escopo);
    return this.existing.some(perfil => perfil.id === perfilId)
      ? { perfilId, evidencias: [] }
      : null;
  }

  async criar(
    escopo: EscopoImportacaoPerfis,
    input: PerfilImportacaoSeguraInput,
    operationKey: string
  ): Promise<PerfilCriadoImportacao> {
    this.assertUser(escopo);
    const idempotente = this.operations.get(operationKey);
    if (idempotente) return { perfilId: idempotente };

    for (const fragment of this.failOperationContains) {
      if (operationKey.includes(fragment)) throw new Error(`falha ${fragment}`);
    }

    this.createdCount += 1;
    const perfilId = `created-${this.createdCount}`;
    this.operations.set(operationKey, perfilId);
    this.existing.push({
      id: perfilId,
      ...(input.telefone ? { telefone: input.telefone } : {}),
      ...(input.email ? { email: input.email } : {})
    });
    return { perfilId };
  }

  private assertUser(escopo: EscopoImportacaoPerfis): void {
    if (escopo.usuarioId !== this.allowedUsuarioId) {
      throw new Error('usuario fora do escopo');
    }
  }
}

export function escopo(overrides: Partial<EscopoImportacaoPerfis> = {}): EscopoImportacaoPerfis {
  return {
    usuarioId: 'user-1',
    importacaoId: 'import-1',
    loteId: 'batch-1',
    origem: 'csv-clientes',
    ...overrides
  };
}

export function registro(
  itemId: string,
  overrides: Partial<PerfilImportacaoSeguraInput> = {}
) {
  return {
    itemId,
    linha: Number(itemId.replace(/\D/g, '')) || 1,
    input: {
      nome: `Perfil ${itemId}`,
      telefone: `6199999${itemId.replace(/\D/g, '').padStart(4, '0')}`,
      conhecePessoalmente: false,
      ...overrides
    }
  };
}

export function createTestSystem() {
  const store = new MemoryImportacaoPerfisStore();
  const gateway = new FakePerfilGateway();
  const clock = new FixedClock();
  const lock = new InMemoryImportacaoPerfisLock();
  const confirmar = new ConfirmarImportacaoPerfisSeguraUseCase(store, gateway, lock, clock);

  return {
    store,
    gateway,
    clock,
    lock,
    preparar: new PrepararImportacaoPerfisSeguraUseCase(store, gateway, clock),
    confirmar,
    cancelar: new CancelarImportacaoPerfisSeguraUseCase(store, clock),
    reprocessar: new ReprocessarImportacaoPerfisSeguraUseCase(store, confirmar),
    rascunho: new GerenciarRascunhoImportacaoPerfisUseCase(store)
  };
}
