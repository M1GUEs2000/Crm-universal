interface Props {
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
}

export default function Spinner({ size = 'md' }: Props) {
  return (
    <div className={`${sizes[size]} rounded-full border-border border-t-primary animate-spin`} />
  )
}
