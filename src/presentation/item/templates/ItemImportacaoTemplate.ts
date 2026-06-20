export const ITEM_IMPORT_TEMPLATE = `<section class="kzera-screen import-only-screen" data-testid="item-importacao">
  <header class="kzera-operational-header compact-import-header"><div class="kzera-operational-title"><span class="eyebrow">Importação</span><h1>Itens</h1></div></header>
  <strong class="item-toast-loading" data-testid="item-loading" hidden>Carregando...</strong>
  <strong class="item-toast-success" data-testid="item-mensagem" hidden></strong>
  <strong class="item-toast-error" data-testid="item-erro" hidden></strong>
  <section class="kzera-card import-screen" data-item-import-panel data-testid="item-importacao-panel">
    <p class="form-hint">Use CSV, TSV ou TXT. O app mostra a prévia antes de salvar.</p>
    <input id="item-import-file" type="file" accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain" />
    <div class="import-inline-actions" data-testid="item-import-bulk-actions" hidden>
      <input id="preview-categoria-massa" placeholder="Variação em massa" />
      <button class="icon-button" type="button" data-action="aplicar-categoria" aria-label="Aplicar variação" title="Aplicar variação">Aplicar</button>
      <button class="icon-button text-icon" type="button" data-action="limpar-invalidos" aria-label="Remover inválidos" title="Remover inválidos">Remover inválidos</button>
    </div>
    <div class="preview-list compact-preview-list" data-testid="item-import-preview"></div>
    <button class="icon-button" type="button" data-action="confirmar-importacao" hidden aria-label="Importar itens" title="Importar itens">Importar itens</button>
  </section>
</section>`;
