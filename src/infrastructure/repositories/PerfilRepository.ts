import type { Repository } from '../../application/ports/Repository';
import type { Perfil } from '../../domain/perfil/Perfil';
import type { PerfilRecord, PerfilPayload } from '../../runtime/PerfilPayloadFields';
import { releaseObject } from '../../runtime/RuntimeCleanup';
import type { SessionContext } from '../../runtime/SessionContext';
import { PayloadProvider } from '../../runtime/PayloadProvider';
import {
  buildPerfilRecord,
  extractPerfilPayload,
  mergePerfilPayload
} from '../../runtime/PerfilPayloadFields';

export class PerfilRepository implements Repository<Perfil> {
  private readonly crypto: PayloadProvider;

  constructor(
    private readonly records: Repository<PerfilRecord>,
    private readonly session: SessionContext
  ) {
    this.crypto = new PayloadProvider(session);
  }

  async save(perfil: Perfil): Promise<Perfil> {
    this.session.touch();

    const packedPayload = await this.crypto.packJson(
      extractPerfilPayload(perfil),
      `perfil:${perfil.id}`
    );

    await this.records.save(buildPerfilRecord(perfil, packedPayload));
    return perfil;
  }

  async getById(id: string): Promise<Perfil | null> {
    this.session.touch();

    const record = await this.records.getById(id);
    if (!record) return null;

    const workingSet = await this.crypto.unpackJson<PerfilPayload>(
      record.packedPayload,
      `perfil:${record.id}`
    );

    try {
      return mergePerfilPayload(record, workingSet);
    } finally {
      releaseObject(workingSet);
    }
  }

  async list(): Promise<Perfil[]> {
    this.session.touch();

    const records = await this.records.list();

    return Promise.all(records.map(async record => {
      const workingSet = await this.crypto.unpackJson<PerfilPayload>(
        record.packedPayload,
        `perfil:${record.id}`
      );

      try {
        return mergePerfilPayload(record, workingSet);
      } finally {
        releaseObject(workingSet);
      }
    }));
  }
}
