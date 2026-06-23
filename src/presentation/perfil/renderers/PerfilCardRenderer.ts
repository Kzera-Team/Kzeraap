import type { Perfil } from '../../../domain/perfil/Perfil';
import { escapeHtml } from '../../shared/ui/Html';

function statusInfo(perfil: Perfil): { label: string; cls: string } {
  if (perfil.status === 'arquivado') return { label: 'Arquivado', cls: 'arquivado' };
  if (!perfil.bairro || !perfil.codigo) return { label: 'Pendente', cls: 'pendente' };
  return { label: 'Ativo', cls: 'ativo' };
}

export class PerfilCardRenderer {
  render(perfil: Perfil): string {
    const { label, cls } = statusInfo(perfil);
    return `<div class="perfil-card" data-testid="perfil-card" data-id="${escapeHtml(perfil.id)}">
      <span class="card-name">${escapeHtml(perfil.nome)}</span>
      <span class="badge ${cls}">${label}</span>
    </div>`;
  }
}
