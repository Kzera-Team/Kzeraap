import type { Perfil } from '../../../domain/perfil/Perfil';
import { badge as renderBadge, type BadgeTone } from '../../shared/ui/Badge';
import { infoItem } from '../../shared/ui/InfoItem';
import perfilListCardHtml from '../components/PerfilListCard/PerfilListCard.html?raw';
import { injetarTemplate } from '../../shared/ui/InjetarTemplate';

const TEMPLATE_ID = 'perfil-list-card-template';

function resolverBadgeLabel(perfil: Perfil): string {
  if (perfil.status === 'arquivado') return 'Arquivado';
  if (!perfil.bairro || !perfil.codigo) return 'Pendente';
  return 'Ativo';
}

function resolverBadgeTone(label: string): BadgeTone {
  if (label === 'Ativo') return 'success';
  if (label === 'Pendente') return 'warning';
  return 'neutral';
}

function resumoAtualizacao(perfil: Perfil): string {
  return perfil.updatedAt ? new Date(perfil.updatedAt).toLocaleDateString('pt-BR') : 'Sem atualização';
}

export class PerfilCardRenderer {
  render(perfil: Perfil): HTMLElement {
    injetarTemplate(TEMPLATE_ID, perfilListCardHtml);

    const template = document.getElementById(TEMPLATE_ID) as HTMLTemplateElement | null;
    if (!template) throw new Error(`Template #${TEMPLATE_ID} não encontrado`);

    const clone = template.content.cloneNode(true) as DocumentFragment;
    const article = clone.querySelector<HTMLElement>('article');
    if (!article) throw new Error('Estrutura do template inválida: <article> não encontrado');

    const badgeLabel = resolverBadgeLabel(perfil);
    article.classList.add(`perfil-${perfil.status}`);
    article.setAttribute('data-testid', 'perfil-card');

    const nomeEl = article.querySelector<HTMLElement>('[data-slot="nome"]');
    if (nomeEl) nomeEl.textContent = perfil.nome;

    const metaEl = article.querySelector<HTMLElement>('[data-slot="meta"]');
    if (metaEl) metaEl.textContent = `${perfil.telefone || 'Sem telefone'} • ${perfil.email || 'Sem e-mail'}`;

    const badgeSlot = article.querySelector('[data-slot="status-badge"]');
    if (badgeSlot) badgeSlot.innerHTML = renderBadge(badgeLabel, resolverBadgeTone(badgeLabel));

    const infoSlot = article.querySelector('[data-slot="info-grid"]');
    if (infoSlot) {
      infoSlot.innerHTML = [
        infoItem('Código', perfil.codigo || 'Sem código'),
        infoItem('Bairro', perfil.bairro || 'Sem bairro'),
        infoItem('Cidade', perfil.municipio || 'Brasília'),
        infoItem('Atualizado', resumoAtualizacao(perfil))
      ].join('');
    }

    const tagsSlot = article.querySelector('[data-slot="tags"]');
    if (tagsSlot) {
      tagsSlot.innerHTML = [
        perfil.conhecePessoalmente ? renderBadge('Perfil conhecido', 'success') : '',
        !perfil.codigo ? renderBadge('Sem código', 'warning') : '',
        !perfil.bairro ? renderBadge('Sem bairro', 'warning') : ''
      ].filter(Boolean).join('');
    }

    const actionsSlot = article.querySelector('[data-slot="actions"]');
    if (actionsSlot) {
      const actions: string[] = [];
      if (!perfil.codigo && perfil.bairro && perfil.status === 'ativo') {
        actions.push(`<button class="icon-button text-icon" type="button" data-action="definir-codigo" data-id="${perfil.id}" aria-label="Definir código" title="Definir código"># Código</button>`);
      }
      if (perfil.status === 'ativo') {
        actions.push(`<button class="icon-button text-icon" type="button" data-action="arquivar" data-id="${perfil.id}" aria-label="Arquivar perfil" title="Arquivar perfil">⌫ Arquivar</button>`);
      } else {
        actions.push(`<button class="icon-button text-icon" type="button" data-action="reativar" data-id="${perfil.id}" aria-label="Reativar perfil" title="Reativar perfil">↻ Reativar</button>`);
      }
      actionsSlot.innerHTML = actions.join('');
    }

    return article;
  }
}
