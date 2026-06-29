// KZERA · Botões — ButtonText.ts
// Botão com texto (e ícone opcional à esquerda).
// Padrão do projeto: função → string HTML; sem dependências externas.

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

export interface ButtonTextProps {
  /** Texto visível do botão — obrigatório */
  label: string
  /** Variante visual. Padrão: 'primary' */
  variant?: ButtonVariant
  /** Desativa o botão — opacity 40%, pointer-events none */
  disabled?: boolean
  /** Estado de carregamento — spinner inline, pointer-events none */
  loading?: boolean
  /** Largura fit-content em vez de 100% */
  auto?: boolean
  /**
   * SVG do ícone à esquerda (string HTML).
   * Tamanho: 18×18. Sempre adicionar aria-hidden="true" no SVG.
   */
  icon?: string
  /**
   * Identificador da ação para o roteador de eventos.
   * O JS da tela ouve cliques em [data-action] e despacha para o handler correto.
   * Exemplo: action: 'confirmar-pedido' → handler confirmarPedido()
   *
   * ATENÇÃO: sem action o botão renderiza sem data-action e nunca dispara nenhum handler.
   * Omitir só em casos onde o evento é tratado por outra via (ex: attrs com onclick).
   */
  action?: string
  /** Atributos HTML extras: id, tabindex, aria-controls etc. */
  attrs?: string
}

export function buttonText({
  label,
  variant = 'primary',
  disabled = false,
  loading = false,
  auto = false,
  icon = '',
  action = '',
  attrs = '',
}: ButtonTextProps): string {
  const classes = [
    'kzera-btn',
    `kzera-btn--${variant}`,
    auto ? 'kzera-btn--auto' : '',
    loading ? 'kzera-btn--loading' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const disabledAttr = disabled ? ' disabled' : ''
  const ariaBusy     = loading  ? ' aria-busy="true"' : ''
  const actionAttr   = action   ? ` data-action="${action}"` : ''
  const extraAttrs   = attrs    ? ` ${attrs}` : ''

  return (
    `<button class="${classes}" type="button"${disabledAttr}${ariaBusy}${actionAttr}${extraAttrs}>` +
    (icon ? icon : '') +
    `<span class="kzera-btn__text">${label}</span>` +
    `</button>`
  )
}

// ─── Exemplos de uso ──────────────────────────────────────────────────────────
//
// 1. Primário — ação principal da tela
//    buttonText({ label: 'Confirmar pedido', action: 'confirmar-pedido' })
//
// 2. Primário com ícone à esquerda
//    const iconAdd = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'
//    buttonText({ label: 'Novo pedido', icon: iconAdd, action: 'novo-pedido' })
//
// 3. Secundário
//    buttonText({ variant: 'secondary', label: 'Cancelar', action: 'cancelar' })
//
// 4. Ghost — auto-width, ação terciária
//    buttonText({ variant: 'ghost', label: 'Ignorar por agora', auto: true, action: 'ignorar' })
//
// 5. Danger — ação destrutiva irreversível
//    buttonText({ variant: 'danger', label: 'Excluir pedido', action: 'excluir-pedido' })
//
// 6. Loading — bloqueia clique e exibe spinner
//    buttonText({ label: 'Salvando...', loading: true })
//
// 7. Disabled
//    buttonText({ label: 'Confirmar', disabled: true })

// ─── Como ligar eventos no runtime JS ────────────────────────────────────────
//
// No arquivo de inicialização da tela (ex: PedidosScreen.ts):
//
//   document.addEventListener('click', (e) => {
//     const btn = (e.target as Element).closest<HTMLButtonElement>('[data-action]')
//     if (!btn || btn.disabled) return
//     switch (btn.dataset.action) {
//       case 'confirmar-pedido': confirmarPedido(); break
//       case 'cancelar':         fecharModal();     break
//       case 'excluir-pedido':   excluirPedido();   break
//     }
//   })
//
// Para ativar / desativar loading programaticamente:
//
//   async function confirmarPedido() {
//     const btn = document.querySelector<HTMLButtonElement>('[data-action="confirmar-pedido"]')
//     if (!btn) return
//     btn.classList.add('kzera-btn--loading')
//     btn.setAttribute('aria-busy', 'true')
//     btn.disabled = true
//     try {
//       await api.confirmar()
//     } finally {
//       btn.classList.remove('kzera-btn--loading')
//       btn.removeAttribute('aria-busy')
//       btn.disabled = false
//     }
//   }
