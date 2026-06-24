import type { ItemCatalogo, ItemVariacao } from '../../../domain/item/ItemCatalogo';
import { estoqueDaVariacao } from '../../../domain/item/ItemCatalogo';

function createInput(id: string, value: string, placeholder: string): HTMLInputElement {
  const input = document.createElement('input');
  input.id = id;
  input.value = value;
  input.placeholder = placeholder;
  return input;
}

function createEditTab(label: string, target: 'informacoes' | 'variacoes', itemId: string, active = false): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  if (active) button.classList.add('active');
  button.dataset['itemEditTab'] = target;
  button.dataset['id'] = itemId;
  button.setAttribute('aria-label', label);
  button.title = label;
  button.textContent = target === 'informacoes' ? 'ⓘ' : '▦';
  return button;
}

function createVariationCard(variacao: ItemVariacao): HTMLElement {
  const card = document.createElement('article');
  card.classList.add('item-variation-card');

  const header = document.createElement('header');
  header.classList.add('variation-card-header');

  const titleWrap = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = variacao.nome;
  const count = document.createElement('small');
  count.textContent = `${variacao.lotes.length} entrada(s)`;
  titleWrap.append(title, count);

  const badge = document.createElement('span');
  badge.classList.add('badge', 'badge-neutral');
  badge.textContent = variacao.unidade;
  header.append(titleWrap, badge);

  const stock = document.createElement('div');
  stock.classList.add('variation-stock-summary');
  const stockValue = document.createElement('strong');
  stockValue.textContent = estoqueDaVariacao(variacao).toFixed(3);
  const stockLabel = document.createElement('span');
  stockLabel.textContent = `${variacao.unidade} em estoque`;
  stock.append(stockValue, stockLabel);

  const loteList = document.createElement('div');
  loteList.classList.add('item-lote-list', 'item-lote-grid');
  variacao.lotes.forEach(lote => {
    const row = document.createElement('div');
    row.classList.add('item-lote-row');

    const nome = document.createElement('strong');
    nome.textContent = lote.nome || 'Entrada';
    const quantidade = document.createElement('span');
    quantidade.textContent = `${lote.quantidade.toFixed(3)} ${variacao.unidade}`;
    const valor = document.createElement('span');
    valor.textContent = `V ${lote.valor.toFixed(2)}`;
    const custo = document.createElement('span');
    custo.textContent = `C ${lote.custo.toFixed(2)}`;

    row.append(nome, quantidade, valor, custo);
    loteList.appendChild(row);
  });

  card.append(header, stock, loteList);
  return card;
}

function createActionButton(label: string, action: string, itemId: string, classes: string[] = []): HTMLButtonElement {
  const button = document.createElement('button');
  button.classList.add(...classes);
  button.type = 'button';
  button.dataset['action'] = action;
  button.dataset['id'] = itemId;
  button.setAttribute('aria-label', label);
  button.title = label;
  button.textContent = label;
  return button;
}

export class ItemEditCardRenderer {
  render(item: ItemCatalogo): HTMLElement {
    const article = document.createElement('article');
    article.classList.add('kzera-card', 'item-card', 'item-edit-card');
    article.dataset['testid'] = 'item-edit-card';

    const title = document.createElement('h3');
    title.textContent = `Editar ${item.nome}`;

    const tabs = document.createElement('nav');
    tabs.classList.add('item-tabs');
    tabs.dataset['testid'] = `item-edit-tabs-${item.id}`;
    tabs.setAttribute('aria-label', 'Edição do item');
    tabs.append(
      createEditTab('Informações', 'informacoes', item.id, true),
      createEditTab('Variações e estoque', 'variacoes', item.id)
    );

    const informacoesPanel = document.createElement('div');
    informacoesPanel.dataset['itemEditTabPanel'] = 'informacoes';
    informacoesPanel.dataset['id'] = item.id;

    const infoFieldset = document.createElement('fieldset');
    infoFieldset.classList.add('item-form-section');
    const infoLegend = document.createElement('legend');
    infoLegend.textContent = 'Informações';
    infoFieldset.append(
      infoLegend,
      createInput(`edit-nome-${item.id}`, item.nome, 'Nome'),
      createInput(`edit-categoria-${item.id}`, item.categoria, 'Categoria opcional'),
      createInput(`edit-descricao-${item.id}`, item.descricao || '', 'Descrição'),
      createInput(`edit-tags-${item.id}`, item.tags.join(', '), 'Tags separadas por vírgula'),
      createInput(`edit-observacao-${item.id}`, item.observacao || '', 'Observação')
    );
    informacoesPanel.appendChild(infoFieldset);

    const variacoesPanel = document.createElement('div');
    variacoesPanel.dataset['itemEditTabPanel'] = 'variacoes';
    variacoesPanel.dataset['id'] = item.id;
    variacoesPanel.hidden = true;

    const variacoesFieldset = document.createElement('fieldset');
    variacoesFieldset.classList.add('item-form-section', 'item-variation-section');
    const variacoesLegend = document.createElement('legend');
    variacoesLegend.textContent = 'Variações e estoque';
    const hint = document.createElement('p');
    hint.classList.add('form-hint');
    hint.textContent = 'Variação pertence ao item. Unidade pertence à variação. Valor, custo e quantidade pertencem à entrada de estoque.';
    variacoesFieldset.append(variacoesLegend, hint);

    if (item.variacoes?.length) {
      item.variacoes.forEach(variacao => variacoesFieldset.appendChild(createVariationCard(variacao)));
    } else {
      const empty = document.createElement('p');
      empty.classList.add('empty-state');
      empty.textContent = 'Nenhuma variação cadastrada para este item.';
      variacoesFieldset.appendChild(empty);
    }
    variacoesPanel.appendChild(variacoesFieldset);

    const actions = document.createElement('div');
    actions.classList.add('action-row');
    actions.append(
      createActionButton('✓ Salvar', 'salvar', item.id, ['icon-button', 'primary-icon', 'text-icon']),
      createActionButton('×', 'cancelar-edicao', item.id, ['icon-button'])
    );

    article.append(title, tabs, informacoesPanel, variacoesPanel, actions);
    return article;
  }
}
