import { listarGruposLocalidade, grupoPadraoLocalidade } from '../../../domain/localidade/LocalidadeCatalogo';

const grupos = listarGruposLocalidade();
const grupoPadrao = grupoPadraoLocalidade();
const grupoOptions = grupos.map(grupo => `<option value="${grupo.id}" ${grupo.id === grupoPadrao.id ? 'selected' : ''}>${grupo.nome}</option>`).join('');
const localidadeOptions = grupoPadrao.localidades.map(localidade => `<option value="${localidade}">${localidade}</option>`).join('');

export const PERFIL_TEMPLATE = `<section class="kzera-screen kzera-module-screen perfil-ux" data-testid="perfil-app">
  <header class="kzera-operational-header" data-testid="perfil-header">
    <div class="kzera-operational-title"><span class="eyebrow">Área de trabalho</span><h1>Perfis</h1><p class="form-hint">Sem pressa: busque ou crie um perfil.</p></div>
    <div class="kzera-operational-actions">
      <button class="icon-button" type="button" data-action="novo-perfil" aria-label="Novo perfil" title="Novo perfil">+ Perfil</button>
    </div>
    <strong class="feedback-loading" data-testid="perfil-loading" hidden>Carregando...</strong>
    <strong class="feedback-sucesso" data-testid="perfil-mensagem" hidden></strong>
    <strong class="feedback-erro" data-testid="perfil-erro" hidden></strong>
  </header>

  <div data-perfil-list-panel>
    <section class="operational-search-card" data-testid="perfil-busca-card">
      <input id="perfil-busca" placeholder="Procure primeiro. Cadastre só se não encontrar." />
      <button class="icon-button" type="button" data-action="buscar" aria-label="Buscar" title="Buscar">🔍</button>
      <button class="icon-button text-icon" type="button" data-action="limpar-busca" data-testid="perfil-limpar-busca" aria-label="Limpar filtros" title="Limpar filtros">× Limpar</button>
      <p class="filter-status" data-testid="perfil-resultados"></p>
    </section>
  </div>

  <section class="kzera-card form-screen" data-perfil-form-panel hidden>
    <button class="icon-button text-icon" type="button" data-action="voltar-perfis" aria-label="Voltar para perfis" title="Voltar para perfis">← Perfis</button>
    <form class="form-sections kzera-form-card" data-testid="perfil-form">
      <div class="kzera-section-title compact-title"><div><span class="eyebrow">Cadastro</span><h2>Novo perfil</h2></div></div>
      <fieldset class="form-section" data-testid="perfil-form-identificacao">
        <legend>Identificação</legend>
        <input id="perfil-nome" placeholder="Nome obrigatório" />
      </fieldset>
      <fieldset class="form-section" data-testid="perfil-form-contato">
        <legend>Contato</legend>
        <input id="perfil-telefone" placeholder="Telefone" />
        <input id="perfil-email" placeholder="E-mail" />
      </fieldset>
      <fieldset class="form-section" data-testid="perfil-form-localizacao">
        <legend>Localização</legend>
        <label><span>Região operacional</span><select id="perfil-municipio" data-localidade-grupo>${grupoOptions}</select></label>
        <label><span>Bairro/Localidade</span><select id="perfil-bairro" data-localidade-select>${localidadeOptions}</select></label>
      </fieldset>
      <fieldset class="form-section" data-testid="perfil-form-relacionamento">
        <legend>Relacionamento</legend>
        <label class="check-row"><input id="perfil-conhece" type="checkbox" /> Conheço pessoalmente</label>
      </fieldset>
      <button class="icon-button primary-icon text-icon" type="submit" aria-label="Criar perfil" title="Criar perfil">Criar perfil</button>
    </form>
  </section>

  <div data-perfil-list-panel-continue>
    <nav class="item-tabs module-tabs" data-testid="perfil-module-tabs" aria-label="Perfis">
      <button type="button" class="active" data-perfil-view-tab="lista">Lista</button>
      <button type="button" data-perfil-view-tab="resumo">Resumo</button>
      <button type="button" data-perfil-view-tab="historico">Histórico</button>
      <button type="button" data-perfil-view-tab="duplicidades">Duplicidades</button>
    </nav>

    <section class="kzera-card" data-testid="perfil-lista" data-perfil-view-panel="lista">
      <div class="kzera-section-title compact-title">
        <div><span class="eyebrow">Lista</span><h2>Perfis cadastrados</h2><p class="form-hint">Mostrando 80 perfis para proteger o iPhone.</p></div>
        <button class="icon-button text-icon" type="button" data-action="exportar" aria-label="Salvar lista de perfis" title="Salvar lista de perfis">⇩ Salvar lista</button>
      </div>
      <div class="perfil-card-list kzera-card-list" data-slot="perfil-list"></div>
    </section>

    <section class="kzera-card" data-testid="perfil-dashboard" data-perfil-view-panel="resumo" hidden>
      <div class="kzera-section-title compact-title"><div><span class="eyebrow">Resumo</span><h2>Resumo dos perfis</h2></div></div>
      <div class="metric-grid kzera-metric-grid" data-slot="dashboard"></div>
    </section>

    <section class="kzera-card timeline-card" data-testid="perfil-timeline" data-perfil-view-panel="historico" hidden>
      <div class="kzera-section-title compact-title"><div><span class="eyebrow">Histórico</span><h2>Movimentos do perfil</h2></div></div>
      <div data-slot="timeline"></div>
    </section>

    <section class="kzera-card" data-testid="perfil-duplicidades" data-perfil-view-panel="duplicidades" hidden>
      <div class="kzera-section-title compact-title"><div><span class="eyebrow">Duplicidades</span><h2>Possíveis duplicidades</h2></div></div>
      <div class="duplicidade-list" data-slot="duplicidades"></div>
    </section>
  </div>
</section>`;
