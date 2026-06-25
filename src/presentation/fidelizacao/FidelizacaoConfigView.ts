import './styles/fidelizacao-config.css';
import { inputValue, numberValue } from '../shared/ui/Html';
import type { ObterRegraFidelidadeUseCase } from '../../application/fidelidade/ObterRegraFidelidadeUseCase';
import type { SalvarRegraFidelidadeUseCase } from '../../application/fidelidade/SalvarRegraFidelidadeUseCase';
import type { ArquivarRegraFidelidadeUseCase } from '../../application/fidelidade/ArquivarRegraFidelidadeUseCase';
import type { PremioFidelidade, RegraFidelidade, RegraFidelidadeStatus } from '../../domain/fidelidade/RegraFidelidade';
import { renderConfigRoot, renderForm } from './templates/FidelizacaoConfigTemplate';
import type { ConfigTemplateValues, ConfigTemplateState } from './templates/FidelizacaoConfigTemplate';

export interface FidelizacaoConfigModule {
  obterRegra: ObterRegraFidelidadeUseCase;
  salvarRegra: SalvarRegraFidelidadeUseCase;
  arquivarRegra: ArquivarRegraFidelidadeUseCase;
}

interface ConfigState {
  regraId: string | null;
  status: RegraFidelidadeStatus;
  premios: PremioFidelidade[];
  sheetOpen: boolean;
  mensagem: string;
  erro: string;
}

export class FidelizacaoConfigView {
  private root: HTMLElement | null = null;
  private state: ConfigState = {
    regraId: null,
    status: 'ativa',
    premios: [],
    sheetOpen: false,
    mensagem: '',
    erro: '',
  };
  private currentValues: ConfigTemplateValues = this.emptyValues();

  constructor(private readonly module: FidelizacaoConfigModule) {}

  async mount(root: HTMLElement): Promise<void> {
    this.root = root;
    this.state = { regraId: null, status: 'ativa', premios: [], sheetOpen: false, mensagem: '', erro: '' };
    await this.load();
  }

  private emptyValues(): ConfigTemplateValues {
    return { nome: '', totalPassos: 10, periodoInicio: '', periodoFim: '', itemNome: '', qtd: 1, unidade: 'un', passosGerados: 1 };
  }

  private regraToValues(r: RegraFidelidade): ConfigTemplateValues {
    return {
      nome: r.nome,
      totalPassos: r.totalPassos,
      periodoInicio: r.periodoInicio,
      periodoFim: r.periodoFim ?? '',
      itemNome: r.regraPassoItemNome || r.regraPassoItemId,
      qtd: r.regraPassoQuantidade,
      unidade: r.regraPassoUnidade,
      passosGerados: r.regraPassoPassosGerados,
    };
  }

  private async load(): Promise<void> {
    const regra = await this.module.obterRegra.execute();
    if (regra) {
      this.state.regraId = regra.id;
      this.state.status = regra.status;
      this.state.premios = structuredClone(regra.premios);
      this.currentValues = this.regraToValues(regra);
    }
    this.render();
  }

  private render(): void {
    if (!this.root) return;
    const templateState: ConfigTemplateState = { ...this.state };
    const formHtml = renderForm(this.currentValues, templateState);
    this.root.innerHTML = renderConfigRoot(formHtml, this.state.sheetOpen, this.currentValues.totalPassos);
    this.bind();
  }

  private bind(): void {
    if (!this.root) return;

    this.root.querySelectorAll('[data-status]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.status = (btn as HTMLElement).dataset.status as RegraFidelidadeStatus;
        this.state.mensagem = '';
        this.state.erro = '';
        this.currentValues = this.readFormValues();
        this.render();
      });
    });

    this.root.querySelectorAll('[data-toggle-prize]').forEach(el => {
      el.addEventListener('click', () => {
        const i = Number((el as HTMLElement).dataset.togglePrize);
        this.syncPrizesFromDom();
        const prize = this.state.premios[i];
        if (prize) prize.ativo = !prize.ativo;
        this.currentValues = this.readFormValues();
        this.render();
      });
    });

    this.root.querySelectorAll('[data-remove-prize]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = Number((btn as HTMLElement).dataset.removePrize);
        this.syncPrizesFromDom();
        this.state.premios.splice(i, 1);
        this.currentValues = this.readFormValues();
        this.render();
      });
    });

    this.root.querySelector('[data-open-sheet]')?.addEventListener('click', () => {
      this.syncPrizesFromDom();
      this.currentValues = this.readFormValues();
      this.state.sheetOpen = true;
      this.state.mensagem = '';
      this.state.erro = '';
      this.render();
    });

    this.root.querySelectorAll('[data-close-sheet]').forEach(el => {
      el.addEventListener('click', () => {
        this.state.sheetOpen = false;
        this.render();
      });
    });

    const sheetToggle = this.root.querySelector<HTMLElement>('#fc-sheet-toggle');
    sheetToggle?.addEventListener('click', () => {
      const current = sheetToggle.dataset.ativo === 'true';
      sheetToggle.dataset.ativo = String(!current);
      sheetToggle.classList.toggle('off', current);
    });

    this.root.querySelector('[data-sheet-adicionar]')?.addEventListener('click', () => {
      const r = this.root!;
      const passo = Number(inputValue(r, '#fc-sheet-passo'));
      const desc  = inputValue(r, '#fc-sheet-desc').trim();
      const item  = inputValue(r, '#fc-sheet-item').trim();
      const ativo = r.querySelector<HTMLElement>('#fc-sheet-toggle')?.dataset.ativo !== 'false';
      const totalPassos = this.currentValues.totalPassos;

      if (!passo || passo < 1 || passo > totalPassos) {
        this.state.erro = `Passo deve estar entre 1 e ${totalPassos}.`;
        this.render();
        return;
      }
      if (!desc) {
        this.state.erro = 'Descrição é obrigatória.';
        this.render();
        return;
      }

      this.state.premios.push({ passo, descricao: desc, itemId: item, itemNome: item, ativo });
      this.state.sheetOpen = false;
      this.state.erro = '';
      this.render();
    });

    this.root.querySelectorAll('[data-salvar]').forEach(btn => {
      btn.addEventListener('click', async () => {
        this.syncPrizesFromDom();
        this.currentValues = this.readFormValues();
        this.state.mensagem = '';
        this.state.erro = '';
        try {
          const saved = await this.module.salvarRegra.execute({
            ...(this.state.regraId ? { id: this.state.regraId } : {}),
            nome: this.currentValues.nome,
            status: this.state.status,
            totalPassos: this.currentValues.totalPassos,
            periodoInicio: this.currentValues.periodoInicio,
            ...(this.currentValues.periodoFim ? { periodoFim: this.currentValues.periodoFim } : {}),
            regraPassoItemId: this.currentValues.itemNome,
            regraPassoItemNome: this.currentValues.itemNome,
            regraPassoQuantidade: this.currentValues.qtd,
            regraPassoUnidade: this.currentValues.unidade,
            regraPassoPassosGerados: this.currentValues.passosGerados,
            premios: this.state.premios,
          });
          this.state.regraId = saved.id;
          this.state.mensagem = 'Regra salva.';
          this.currentValues = this.regraToValues(saved);
          this.render();
        } catch (err) {
          this.state.erro = err instanceof Error ? err.message : 'Erro ao salvar.';
          this.render();
        }
      });
    });

    this.root.querySelector('[data-arquivar]')?.addEventListener('click', async () => {
      if (!this.state.regraId) return;
      this.state.mensagem = '';
      this.state.erro = '';
      try {
        await this.module.arquivarRegra.execute(this.state.regraId);
        this.state.regraId = null;
        this.state.status = 'ativa';
        this.state.premios = [];
        this.currentValues = this.emptyValues();
        this.state.mensagem = 'Regra arquivada.';
        this.render();
      } catch (err) {
        this.state.erro = err instanceof Error ? err.message : 'Erro ao arquivar.';
        this.render();
      }
    });
  }

  private readFormValues(): ConfigTemplateValues {
    if (!this.root) return this.currentValues;
    const r = this.root;
    return {
      nome:          inputValue(r, '#fc-nome'),
      totalPassos:   numberValue(r, '#fc-passos') || this.currentValues.totalPassos,
      periodoInicio: inputValue(r, '#fc-inicio'),
      periodoFim:    inputValue(r, '#fc-fim'),
      itemNome:      inputValue(r, '#fc-item-nome'),
      qtd:           numberValue(r, '#fc-qtd') || this.currentValues.qtd,
      unidade:       inputValue(r, '#fc-unidade'),
      passosGerados: numberValue(r, '#fc-passos-gerados') || this.currentValues.passosGerados,
    };
  }

  private syncPrizesFromDom(): void {
    if (!this.root) return;
    this.root.querySelectorAll<HTMLElement>('[data-prize]').forEach(card => {
      const i = Number(card.dataset.prize);
      if (!this.state.premios[i]) return;
      const desc = (card.querySelector(`[data-prize-desc="${i}"]`) as HTMLInputElement | null)?.value ?? '';
      const item = (card.querySelector(`[data-prize-item="${i}"]`) as HTMLInputElement | null)?.value ?? '';
      this.state.premios[i].descricao = desc;
      this.state.premios[i].itemId    = item;
      this.state.premios[i].itemNome  = item;
    });
  }
}
