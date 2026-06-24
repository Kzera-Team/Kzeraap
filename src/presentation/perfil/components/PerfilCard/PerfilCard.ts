// v0.19.27
import type { PerfilImportacaoPreviewRegistro } from '../../../../domain/perfil/PerfilImportacao';
import { normalizarTelefoneBrasil } from '../../../../domain/perfil/PerfilImportacao';
import { buscarLocalidadesPorGrupo, grupoPadraoLocalidade } from '../../../../domain/localidade/LocalidadeCatalogo';
import perfilCardHtml from './PerfilCard.html?raw';
import { injetarTemplate } from '../../../shared/ui/InjetarTemplate';

type StatusCard = 'ok' | 'warning' | 'error';

const TEMPLATE_ID = 'perfil-card-template';

function resolverStatus(registro: PerfilImportacaoPreviewRegistro): StatusCard {
  if (!registro.valido) return 'error';
  if (!registro.bairro?.trim()) return 'warning';
  return 'ok';
}

function resolverStatusLabel(status: StatusCard): string {
  if (status === 'ok') return '✓ Válido';
  if (status === 'warning') return '! Atenção';
  return '× Erro';
}

function resolverMensagemAjuda(registro: PerfilImportacaoPreviewRegistro, status: StatusCard): string {
  if (status === 'warning') return 'Bairro não informado';
  if (status === 'error') return registro.erros.join('; ');
  return '';
}

export function criarPerfilCard(registro: PerfilImportacaoPreviewRegistro): HTMLElement {
  injetarTemplate(TEMPLATE_ID, perfilCardHtml);

  const template = document.getElementById(TEMPLATE_ID) as HTMLTemplateElement | null;
  if (!template) throw new Error(`Template #${TEMPLATE_ID} não encontrado`);

  const clone = template.content.cloneNode(true) as DocumentFragment;
  const article = clone.querySelector<HTMLElement>('article');
  if (!article) throw new Error('Estrutura do template inválida: <article> não encontrado');

  const status = resolverStatus(registro);
  const linhaNumero = registro.index + 2;
  const telefone = normalizarTelefoneBrasil(registro.telefone ?? '');
  const mensagemAjuda = resolverMensagemAjuda(registro, status);
  const localidades = buscarLocalidadesPorGrupo(grupoPadraoLocalidade().id);

  // article
  article.dataset['cardStatus'] = status;
  article.dataset['previewIndex'] = String(registro.index);

  // linha
  const elLinha = article.querySelector<HTMLElement>('[data-linha]');
  if (elLinha) elLinha.textContent = `Linha ${linhaNumero}`;

  // badge de status
  const badge = article.querySelector<HTMLElement>('[data-status-badge]');
  if (badge) {
    badge.textContent = resolverStatusLabel(status);
    badge.dataset['status'] = status;
  }

  // nome
  const inputNome = article.querySelector<HTMLInputElement>('[data-nome]');
  if (inputNome) {
    inputNome.value = registro.nome;
    inputNome.dataset['previewIndex'] = String(registro.index);
  }

  // mensagem de ajuda
  const elErro = article.querySelector<HTMLElement>('[data-erro]');
  if (elErro) {
    if (mensagemAjuda) {
      elErro.textContent = mensagemAjuda;
      elErro.className = `perfil-import-help ${status}`;
      elErro.removeAttribute('hidden');
    } else {
      elErro.setAttribute('hidden', '');
    }
  }

  // telefone
  const inputTelefone = article.querySelector<HTMLInputElement>('[data-telefone]');
  if (inputTelefone) {
    inputTelefone.value = telefone;
    inputTelefone.dataset['previewIndex'] = String(registro.index);
  }

  // bairro (select)
  const selectBairro = article.querySelector<HTMLSelectElement>('[data-bairro]');
  if (selectBairro) {
    selectBairro.dataset['previewIndex'] = String(registro.index);
    const optVazio = document.createElement('option');
    optVazio.value = '';
    optVazio.textContent = 'Bairro';
    selectBairro.appendChild(optVazio);
    for (const localidade of localidades) {
      const opt = document.createElement('option');
      opt.value = localidade;
      opt.textContent = localidade;
      if (localidade === (registro.bairro ?? '')) opt.selected = true;
      selectBairro.appendChild(opt);
    }
  }

  // conhecePessoalmente
  const checkConhece = article.querySelector<HTMLInputElement>('[data-preview-field="conhecePessoalmente"]');
  if (checkConhece) {
    checkConhece.checked = registro.conhecePessoalmente;
    checkConhece.dataset['previewIndex'] = String(registro.index);
  }

  return article;
}
