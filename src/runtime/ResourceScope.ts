export interface Releasable {
  release(): void;
}

export class ResourceScope {
  private items = new Set<Releasable>();

  register(item: Releasable): void {
    this.items.add(item);
  }

  unregister(item: Releasable): void {
    this.items.delete(item);
  }

  releaseAll(): void {
    const items = Array.from(this.items);

    for (const item of items) {
      item.release();
    }

    this.items.clear();
  }
}

export class ValueBox implements Releasable {
  private bytes: Uint8Array | null;

  constructor(value: string) {
    this.bytes = new TextEncoder().encode(value);
  }

  read(): string {
    if (this.bytes === null) {
      throw new Error('Valor indisponível.');
    }

    return new TextDecoder().decode(this.bytes);
  }

  release(): void {
    if (this.bytes) {
      this.bytes.fill(0);
    }

    this.bytes = null;
  }
}
