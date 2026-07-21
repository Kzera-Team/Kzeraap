// KZERA · Botões — componente.tsx
// Requer: componente.css importado globalmente ou no módulo pai

import { ButtonHTMLAttributes, ReactNode } from 'react'

interface KzeraButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** 'sm' = 44px — usar em botões ícone dentro de sheets/headers */
  size?: 'default' | 'sm'
  loading?: boolean
  /** Largura fit-content em vez de 100% */
  auto?: boolean
  /** Texto do botão. Quando ausente, o componente assume botão ícone */
  label?: string
  /** Ícone SVG à esquerda do texto, ou único filho em botão ícone (18×18) */
  icon?: ReactNode
}

export function KzeraButton({
  variant = 'primary',
  size = 'default',
  loading = false,
  auto = false,
  label,
  icon,
  disabled,
  className,
  ...props
}: KzeraButtonProps) {
  const isIconOnly = icon && !label

  if (isIconOnly && !props['aria-label']) {
    console.warn('[KzeraButton] Botão ícone sem aria-label — inacessível para leitores de tela.')
  }

  const classes = [
    'kz-btn',
    `kz-btn--${variant}`,
    isIconOnly && 'kz-btn--icon',
    isIconOnly && size === 'sm' && 'kz-btn--sm',
    (auto || isIconOnly) && 'kz-btn--auto',
    loading && 'kz-btn--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-disabled={(disabled || loading) ? true : undefined}
      aria-busy={loading || undefined}
      {...props}
    >
      {icon}
      {label && <span className="kz-btn__text">{label}</span>}
    </button>
  )
}

// ─── Grupo de botões ─────────────────────────────────────────────────────────

interface KzeraButtonGroupProps {
  children: ReactNode
  className?: string
}

export function KzeraButtonGroup({ children, className }: KzeraButtonGroupProps) {
  return (
    <div className={['kz-btn-group', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}

// ─── Exemplos de uso ──────────────────────────────────────────────────────────
//
// Primário
// <KzeraButton label="Confirmar pedido" />
//
// Primário com ícone
// <KzeraButton label="Novo pedido" icon={<PlusIcon />} />
//
// Secundário
// <KzeraButton variant="secondary" label="Cancelar" />
//
// Ghost (auto-width)
// <KzeraButton variant="ghost" label="Ignorar por agora" />
//
// Danger
// <KzeraButton variant="danger" label="Excluir pedido" />
//
// Loading
// <KzeraButton label="Salvando..." loading />
//
// Botão ícone primário (48×48)
// <KzeraButton icon={<PlusIcon />} aria-label="Adicionar" />
//
// Botão ícone ghost pequeno (44×44) — fechar sheet
// <KzeraButton variant="ghost" size="sm" icon={<XIcon />} aria-label="Fechar" />
//
// Grupo
// <KzeraButtonGroup>
//   <KzeraButton variant="secondary" label="Cancelar" />
//   <KzeraButton label="Confirmar" />
// </KzeraButtonGroup>
