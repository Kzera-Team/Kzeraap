export const appClock = { now: () => new Date() };

let counter = 0;

export function nextId(prefix: string): string {
  return `${prefix}-${Date.now()}-${++counter}`;
}

export function nextPerfilId(): string {
  return nextId('perfil');
}

export function nextItemId(): string {
  return nextId('item');
}

export function nextBalancaId(): string {
  return nextId('balanca');
}

export function nextCalibragemId(): string {
  return nextId('calibragem');
}

export function nextUxId(): string {
  return nextId('ux');
}

export function nextUxSessaoId(): string {
  return nextId('sessao');
}

export function nextUxFluxoId(): string {
  return nextId('ux-fluxo');
}
