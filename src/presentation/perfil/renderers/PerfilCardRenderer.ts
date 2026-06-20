import type { Perfil } from '../../../domain/perfil/Perfil';
import { escapeHtml } from '../../shared/ui/Html';
import { infoItem } from '../../shared/ui/InfoItem';
import { badge as renderBadge } from '../../shared/ui/Badge';

function resumoAtualizacao(perfil: Perfil): string {
  return perfil.updatedAt ? new Date(perfil.updatedAt).toLocaleDateString('pt-BR') : 'Sem atualização';
}

function statusBadge(perfil: Perfil): string {
  if (perfil.status === 'arquivado') return 'Arquivado';
  if (!perfil.bairro || !perfil.codigo) return 'Pendente';
  return 'Ativo';
}

export class PerfilCardRenderer {
  render(perfil: Perfil): string {
    const badge = statusBadge(perfil);
    const tags = [
      perfil.conhecePessoalmente ? renderBadge('Perfil conhecido', 'success') : '',
      !perfil.codigo ? renderBadge('Sem código', 'warning') : '',
      !perfil.bairro ? renderBadge('Sem bairro', 'warning') : ''
    ].filter(Boolean).join('');

    const actions = [
      !perfil.codigo && perfil.bairro && perfil.status === 'ativo' ? `<button class="icon-button text-icon" type="button" data-action="definir-codigo" data-id="${perfil.id}" aria-label="Definir código" title="Definir código"># Código</button>` : '',
      perfil.status === 'ativo'
        ? `<button class="icon-button text-icon" type="button" data-action="arquivar" data-id="${perfil.id}" aria-label="Arquivar perfil" title="Arquivar perfil">⌫ Arquivar</button>`
        : `<button class="icon-button text-icon" type="button" data-action="reativar" data-id="${perfil.id}" aria-label="Reativar perfil" title="Reativar perfil">↻ Reativar</button>`
    ].filter(Boolean).join('');

    return `<article class="kzera-entity-card perfil-card perfil-${perfil.status}" data-testid="perfil-card">
      <div class="perfil-card-header">
        <div>
          <h3>${escapeHtml(perfil.nome)}</h3>
          <p class="perfil-meta">${escapeHtml(perfil.telefone || 'Sem telefone')} • ${escapeHtml(perfil.email || 'Sem e-mail')}</p>
        </div>
        ${renderBadge(badge, badge === 'Ativo' ? 'success' : badge === 'Pendente' ? 'warning' : 'neutral')}
      </div>
      <div class="perfil-info-grid kzera-info-grid">
        ${infoItem('Código', perfil.codigo || 'Sem código')}
        ${infoItem('Bairro', perfil.bairro || 'Sem bairro')}
        ${infoItem('Cidade', perfil.municipio || 'Brasília')}
        ${infoItem('Atualizado', resumoAtualizacao(perfil))}
      </div>
      <div class="tag-row kzera-tag-row">${tags}</div>
      <div class="action-row kzera-action-row">${actions}</div>
    </article>`;
  }
}
