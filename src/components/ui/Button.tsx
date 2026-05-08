interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
  onClick?: () => void
  children: React.ReactNode
}

const variants = {
  primary:   'bg-primary text-primary-foreground hover:bg-primary-hover',
  secondary: 'bg-surface text-text border border-border hover:bg-background',
  danger:    'bg-red-500 text-white hover:bg-red-600',
  ghost:     'text-text-muted hover:text-text hover:bg-background',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
}

export default function Button({ variant = 'primary', size = 'md', loading, disabled, type = 'button', onClick, children }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`rounded-button font-medium transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 cursor-pointer ${variants[variant]} ${sizes[size]}`}
    >
      {loading ? 'Cargando...' : children}
    </button>
  )
}
