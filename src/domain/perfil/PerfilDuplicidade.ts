import type { Perfil } from './Perfil';

export type PerfilDuplicidadeMotivo = 'telefone_igual' | 'nome_muito_parecido' | 'email_igual';

export interface PerfilDuplicidade {
  perfilAId: string;
  perfilBId: string;
  motivos: PerfilDuplicidadeMotivo[];
  score: number;
}

function normalizarTexto(value: string | undefined): string {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizarTelefone(value: string | undefined): string {
  return (value || '').replace(/\D/g, '');
}

function normalizarEmail(value: string | undefined): string {
  return (value || '').trim().toLowerCase();
}

function palavras(value: string): Set<string> {
  return new Set(normalizarTexto(value).split(' ').filter(Boolean));
}

function similaridadeNome(a: string | undefined, b: string | undefined): number {
  const pa = palavras(a || '');
  const pb = palavras(b || '');

  if (!pa.size || !pb.size) return 0;

  const intersection = [...pa].filter(item => pb.has(item)).length;
  const union = new Set([...pa, ...pb]).size;

  return intersection / union;
}

export function detectarDuplicidadePerfil(a: Perfil, b: Perfil): PerfilDuplicidade | null {
  if (a.id === b.id) return null;

  const motivos: PerfilDuplicidadeMotivo[] = [];
  let score = 0;

  const telefoneA = normalizarTelefone(a.telefone);
  const telefoneB = normalizarTelefone(b.telefone);

  if (telefoneA && telefoneB && telefoneA === telefoneB) {
    motivos.push('telefone_igual');
    score += 70;
  }

  const emailA = normalizarEmail(a.email);
  const emailB = normalizarEmail(b.email);

  if (emailA && emailB && emailA === emailB) {
    motivos.push('email_igual');
    score += 70;
  }

  const nomeScore = similaridadeNome(a.nome, b.nome);

  if (nomeScore >= 0.67) {
    motivos.push('nome_muito_parecido');
    score += Math.round(nomeScore * 40);
  }

  if (!motivos.length) return null;

  return {
    perfilAId: a.id,
    perfilBId: b.id,
    motivos,
    score: Math.min(score, 100)
  };
}

export function detectarDuplicidadesPerfis(perfis: Perfil[]): PerfilDuplicidade[] {
  const duplicidades: PerfilDuplicidade[] = [];

  for (let i = 0; i < perfis.length; i++) {
    for (let j = i + 1; j < perfis.length; j++) {
      const a = perfis[i];
      const b = perfis[j];
      if (!a || !b) continue;
      const duplicidade = detectarDuplicidadePerfil(a, b);

      if (duplicidade) {
        duplicidades.push(duplicidade);
      }
    }
  }

  return duplicidades.sort((a, b) => b.score - a.score);
}
