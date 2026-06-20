import type { ItemCatalogoUiHandlers } from '../ItemCatalogoViewTypes';
import { parseNumeroOperacional } from '../../shared/ui/NumberParser';

function formString(data: FormData, key: string): string {
  return String(data.get(key) || '');
}

function payloadBase(data: FormData) {
  return {
    itemId: formString(data, 'itemId'),
    variacaoId: formString(data, 'variacaoId'),
    loteId: formString(data, 'loteId'),
    fracionamentoId: formString(data, 'fracionamentoId')
  };
}

export class LotePesagemRapidaBinder {
  bind(root: HTMLElement, handlers: ItemCatalogoUiHandlers): void {
    root.querySelectorAll<HTMLFormElement>('[data-testid="pesagem-iniciar-form"]').forEach(form => {
      form.addEventListener('submit', async event => {
        event.preventDefault();
        const data = new FormData(form);
        const payload = {
          acao: 'iniciar' as const,
          ...payloadBase(data),
          balancaId: formString(data, 'balancaId'),
          alvoMg: parseNumeroOperacional(data.get('alvoMg') || 0),
          usarEtiquetas: data.get('usarEtiquetas') === 'on'
        } as { acao: 'iniciar'; itemId: string; variacaoId: string; loteId: string; fracionamentoId: string; balancaId: string; alvoMg: number; usarEtiquetas: boolean; etiquetaInicial?: number };
        if (data.get('etiquetaInicial')) payload.etiquetaInicial = Math.floor(parseNumeroOperacional(data.get('etiquetaInicial')));
        await handlers.onPesagemRapida(payload);
      });
    });

    root.querySelectorAll<HTMLFormElement>('[data-testid="pesagem-manual-form"]').forEach(form => {
      form.addEventListener('submit', async event => {
        event.preventDefault();
        const data = new FormData(form);
        await handlers.onPesagemRapida({
          acao: 'registrar_peso',
          ...payloadBase(data),
          sessaoId: formString(data, 'sessaoId'),
          pesoMg: parseNumeroOperacional(data.get('pesoMg') || 0)
        });
      });
    });


    root.querySelectorAll<HTMLFormElement>('[data-testid="pesagem-correcao-form"]').forEach(form => {
      form.addEventListener('submit', async event => {
        event.preventDefault();
        const data = new FormData(form);
        await handlers.onPesagemRapida({
          acao: 'corrigir_peso',
          ...payloadBase(data),
          sessaoId: formString(data, 'sessaoId'),
          registroId: formString(data, 'registroId'),
          pesoMg: parseNumeroOperacional(data.get('pesoMg') || 0)
        });
      });
    });

    root.querySelectorAll<HTMLButtonElement>('[data-pesagem-acao]').forEach(button => {
      button.addEventListener('click', async () => {
        const acao = button.dataset.pesagemAcao as 'registrar_peso' | 'pausar' | 'retomar' | 'finalizar';
        const payload = {
          acao,
          itemId: button.dataset.itemId || '',
          variacaoId: button.dataset.variacaoId || '',
          loteId: button.dataset.loteId || '',
          fracionamentoId: button.dataset.fracionamentoId || '',
          sessaoId: button.dataset.sessaoId || ''
        } as { acao: 'registrar_peso' | 'pausar' | 'retomar' | 'finalizar'; itemId: string; variacaoId: string; loteId: string; fracionamentoId: string; sessaoId: string; pesoMg?: number };
        if (button.dataset.pesoMg) payload.pesoMg = parseNumeroOperacional(button.dataset.pesoMg);
        await handlers.onPesagemRapida(payload);
      });
    });
  }
}
