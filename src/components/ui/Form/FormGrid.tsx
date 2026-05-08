interface Props {
  cols?: 1 | 2 | 3
  children: React.ReactNode
}

const colsClass = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
}

export default function FormGrid({ cols = 2, children }: Props) {
  return (
    <div className={`grid gap-4 ${colsClass[cols]}`}>
      {children}
    </div>
  )
}
