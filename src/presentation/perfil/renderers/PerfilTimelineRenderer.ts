import type { PerfilTimelineItem } from '../PerfilViewTypes';
import { escapeHtml } from '../../shared/ui/Html';
import { emptyState } from '../../shared/ui/EmptyState';

function groupTimelineByDate(items: PerfilTimelineItem[]): Map<string, PerfilTimelineItem[]> {
  const grouped = new Map<string, PerfilTimelineItem[]>();
  for (const item of items) {
    const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : 'Sem data';
    const current = grouped.get(date) || [];
    current.push(item);
    grouped.set(date, current);
  }
  return grouped;
}

export class PerfilTimelineRenderer {
  render(items: PerfilTimelineItem[]): string {
    if (!items.length) return emptyState('Nenhum evento registrado ainda.');

    const grouped = groupTimelineByDate(items);
    return Array.from(grouped.entries()).map(([date, group]) => `
      <div class="timeline-group"><h3>${escapeHtml(date)}</h3>
        ${group.map(item => `<div class="timeline-item"><strong>${escapeHtml(item.descricao)}</strong><span>${escapeHtml(item.tipo || 'evento')}</span></div>`).join('')}
      </div>
    `).join('');
  }
}
