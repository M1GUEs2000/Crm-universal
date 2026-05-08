interface Props {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default'
  children: React.ReactNode
}

const variants = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger:  'bg-red-100 text-red-600',
  info:    'bg-blue-100 text-blue-700',
  default: 'bg-background text-text-muted',
}

export default function Badge({ variant = 'default', children }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}
