export interface FeedbackState {
  mensagem?: string;
  erro?: string;
  loading?: boolean;
}

export function bindFeedback(root: HTMLElement, selectors: {
  loading: string;
  mensagem: string;
  erro: string;
}, state: FeedbackState): void {
  const loading = root.querySelector(selectors.loading) as HTMLElement | null;
  const mensagem = root.querySelector(selectors.mensagem) as HTMLElement | null;
  const erro = root.querySelector(selectors.erro) as HTMLElement | null;

  if (loading) {
    loading.hidden = !state.loading;
    loading.classList.add('loading-state');
  }

  if (mensagem) {
    mensagem.hidden = !state.mensagem;
    mensagem.textContent = state.mensagem || '';
    mensagem.classList.add('toast', 'toast-success');
  }

  if (erro) {
    erro.hidden = !state.erro;
    erro.textContent = state.erro || '';
    erro.classList.add('toast', 'toast-error');
  }
}
