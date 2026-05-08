interface Props {
  name: string
  size?: 'sm' | 'md' | 'lg'
  src?: string
}

const sizes = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

export default function Avatar({ name, size = 'md', src }: Props) {
  if (src) {
    return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover`} />
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium shrink-0`}>
      {initials(name)}
    </div>
  )
}
