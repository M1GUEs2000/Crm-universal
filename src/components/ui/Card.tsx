interface Props {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

const paddings = {
  none: '',
  sm:   'p-3',
  md:   'p-5',
  lg:   'p-7',
}

export default function Card({ children, className = '', padding = 'md' }: Props) {
  return (
    <div className={`bg-surface rounded-card shadow-card ${paddings[padding]} ${className}`}>
      {children}
    </div>
  )
}
