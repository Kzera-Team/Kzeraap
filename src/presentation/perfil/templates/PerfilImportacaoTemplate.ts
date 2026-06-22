// v0.19.27
// PerfilImportacaoTemplate.ts — estrutura estática HTML da tela de importação de perfis
// Não contém lógica — apenas o esqueleto da tela.
// O renderImportacaoTabs() é injetado em runtime pois depende da aba ativa.

import { renderImportacaoTabs } from '../../importacao/components/ImportacaoTabs';

export function buildPerfilImportacaoTemplate(): string {
  return `<section class="kzera-screen import-only-screen perfil-import-screen import-page import-page-background" data-testid="perfil-importacao">
  <section class="kzera-card import-screen perfil-import-panel importPanel import-panel" data-testid="perfil-importacao-panel">
    ${renderImportacaoTabs('perfis')}

    <strong class="perfil-toast-loading" data-testid="perfil-loading" hidden>Carregando...</strong>
    <strong class="perfil-toast-success" data-testid="perfil-mensagem" hidden></strong>
    <strong class="perfil-toast-error" data-testid="perfil-erro" hidden></strong>

    <label class="perfil-import-file-card fileCard file-card" for="perfil-import-file">
      <span class="perfil-import-file-icon fileIconBox file-icon-box" aria-hidden="true">⇧</span>
      <small class="fileLabel file-label" data-file-status>Arquivo</small>
      <strong class="fileName file-name" data-file-name>Escolher arquivo</strong>
      <small class="fileMeta file-meta" data-file-meta>CSV de perfis</small>
      <span class="perfil-import-file-action changeButton change-button">Trocar</span>
    </label>
    <input id="perfil-import-file" class="perfil-import-file-input" type="file" accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain" />

    <div class="perfil-import-preview-head previewHeader" data-testid="perfil-import-preview-head" hidden>
      <strong class="previewTitle">Pré-visualização</strong>
      <small class="previewCount" data-preview-count></small>
    </div>

    <div class="perfil-import-status-filter" aria-label="Filtrar por status" hidden>
      <button type="button" aria-pressed="true" data-filter-status="todos">Todos</button>
      <button type="button" aria-pressed="false" data-filter-status="ok">Válidos</button>
      <button type="button" aria-pressed="false" data-filter-status="warning">Atenção</button>
      <button type="button" aria-pressed="false" data-filter-status="error">Erros</button>
    </div>

    <div class="preview-list compact-preview-list perfil-import-preview-line" data-testid="perfil-import-preview"></div>

    <p class="perfil-import-note" data-testid="perfil-import-note" hidden><span aria-hidden="true">i</span> Corrija os inválidos antes de importar.</p>

    <button class="perfil-import-primary-button" type="button" data-action="confirmar-importacao" disabled aria-label="Importar perfis" title="Importar perfis">Importe um arquivo primeiro</button>
  </section>
</section>`;
}
