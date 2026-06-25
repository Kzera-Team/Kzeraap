export const FIDELIZACAO_DASHBOARD_TEMPLATE = `
<div class="fd-root">
  <div class="app-header">
    <button class="hamburger" data-menu-toggle><span></span><span></span><span></span></button>
    <h1>Dashboard Fidelidade</h1>
    <div class="spacer"></div>
  </div>

  <div class="screen">
    <div class="toast" id="fd-toast" hidden></div>
    <div class="stat-row">
      <div class="stat-card has-card">
        <div class="stat-label">Com cartão gerado</div>
        <div class="stat-value" id="fd-com-cartao">0</div>
      </div>
      <div class="stat-card no-card">
        <div class="stat-label">Sem cartão</div>
        <div class="stat-value" id="fd-sem-cartao">0</div>
      </div>
    </div>
    <button class="btn-primary" data-abrir-sheet type="button">Regerar cartões</button>
  </div>

  <div class="overlay" data-close-sheet hidden></div>
  <div class="bottom-sheet" id="fd-sheet" hidden>
    <div class="sheet-handle"></div>
    <div class="sheet-title">Regerar cartões</div>
    <div class="sheet-desc">Escolha quais clientes terão os cartões regerados.</div>
    <div class="option-list">
      <button class="option-btn selected" data-opcao="semCartao" type="button">
        <div class="option-radio"></div>
        <div>
          <div class="option-label">Só quem não tem cartão</div>
          <div class="option-sublabel" id="fd-sublabel-sem">0 clientes</div>
        </div>
      </button>
      <button class="option-btn" data-opcao="todos" type="button">
        <div class="option-radio"></div>
        <div>
          <div class="option-label">Todos os clientes</div>
          <div class="option-sublabel" id="fd-sublabel-todos">0 clientes · substitui cartões existentes</div>
        </div>
      </button>
    </div>
    <button class="btn-primary" data-regerar type="button">Regerar</button>
    <button class="btn-cancel" data-close-sheet type="button">Cancelar</button>
  </div>
</div>
`;
