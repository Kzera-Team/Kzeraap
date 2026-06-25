export const FIDELIZACAO_CONFIG_TEMPLATE = `
<div class="fc-root">
  <div class="app-header">
    <button class="hamburger" data-menu-toggle><span></span><span></span><span></span></button>
    <h1>Config. Fidelidade</h1>
    <button class="btn-header" data-salvar type="button">Salvar</button>
  </div>

  <div class="screen">
    <div class="toast" id="fc-toast" hidden></div>

    <div class="section">
      <div class="section-head">Identificação</div>
      <div class="card">
        <div class="field">
          <label for="fc-nome">Nome da regra</label>
          <input class="field-input" id="fc-nome" placeholder="Nome da regra" />
        </div>
        <div class="field">
          <label>Status</label>
          <div class="status-selector">
            <button type="button" class="status-option" data-status="ativa">Ativa</button>
            <button type="button" class="status-option" data-status="inativa">Inativa</button>
            <button type="button" class="status-option" data-status="arquivada">Arquivada</button>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-head">Parâmetros</div>
      <div class="card">
        <div class="field">
          <label for="fc-passos">Quantidade de passos do cartão</label>
          <input class="field-input" id="fc-passos" type="number" min="1" />
        </div>
        <div class="field">
          <label>Período válido</label>
          <div class="field-row">
            <div>
              <input class="field-input" id="fc-inicio" type="date" />
              <div class="hint">Início</div>
            </div>
            <div>
              <input class="field-input" id="fc-fim" type="date" placeholder="—" />
              <div class="hint">Fim (opcional)</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-head">Regra de passo</div>
      <div class="card">
        <div class="field">
          <label for="fc-item-nome">Item</label>
          <input class="field-input" id="fc-item-nome" placeholder="Código · Nome do item" />
        </div>
        <div class="field-row">
          <div class="field">
            <label for="fc-qtd">Quantidade</label>
            <input class="field-input" id="fc-qtd" type="number" min="1" />
          </div>
          <div class="field">
            <label for="fc-unidade">Unidade</label>
            <input class="field-input" id="fc-unidade" placeholder="un" />
          </div>
        </div>
        <div class="field" style="margin-top:10px;">
          <label for="fc-passos-gerados">Passos gerados</label>
          <input class="field-input" id="fc-passos-gerados" type="number" min="1" />
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-head">Prêmios por passo</div>
      <div class="card">
        <div id="fc-premios-list"></div>
        <button type="button" class="btn-add" data-open-sheet>+ Adicionar prêmio</button>
      </div>
    </div>

    <div class="section" style="margin-bottom:0;">
      <div class="actions-bar">
        <button type="button" class="btn-primary" data-salvar>Salvar regra</button>
        <button type="button" class="btn-danger" data-arquivar hidden>Arquivar regra</button>
      </div>
    </div>
  </div>

  <template id="fc-premio-tpl">
    <div class="prize-card">
      <div class="prize-card-header">
        <span class="prize-step-badge" data-prize-step>Passo</span>
        <button class="btn-remove" data-remove-prize type="button">×</button>
      </div>
      <div class="field">
        <label>Descrição</label>
        <input class="field-input" data-prize-desc />
      </div>
      <div class="field">
        <label>Item do prêmio</label>
        <input class="field-input" data-prize-item />
      </div>
      <div class="toggle-row">
        <span class="toggle-label">Ativo</span>
        <div class="toggle" data-toggle-prize role="switch" aria-checked="true"></div>
      </div>
    </div>
  </template>

  <div class="overlay" data-close-sheet hidden></div>
  <div class="bottom-sheet" id="fc-sheet" hidden>
    <div class="sheet-handle"></div>
    <div class="sheet-title">Adicionar prêmio</div>
    <div class="sheet-sub">Passo deve estar entre 1 e o total de passos do cartão</div>
    <div class="field">
      <label for="fc-sheet-passo">Passo</label>
      <input class="field-input" id="fc-sheet-passo" type="number" min="1" placeholder="Ex: 5" />
      <div class="hint" id="fc-sheet-hint">1 ≤ passo ≤ 10</div>
    </div>
    <div class="field">
      <label for="fc-sheet-desc">Descrição</label>
      <input class="field-input" id="fc-sheet-desc" placeholder="Ex: Desconto 15%" />
    </div>
    <div class="field">
      <label for="fc-sheet-item">Item do prêmio</label>
      <input class="field-input" id="fc-sheet-item" placeholder="Buscar item..." />
      <div class="hint">Apenas itens marcados como prêmio de fidelidade</div>
    </div>
    <div class="toggle-row" style="margin-bottom:20px;">
      <span class="toggle-label">Ativo ao salvar</span>
      <div class="toggle" id="fc-sheet-toggle" data-ativo="true"></div>
    </div>
    <button type="button" class="btn-primary" data-sheet-adicionar>Adicionar</button>
    <button type="button" class="btn-cancel" data-close-sheet>Cancelar</button>
  </div>
</div>
`;
