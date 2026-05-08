export interface TableColumn<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
}

interface Props<T> {
  columns: TableColumn<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  loading?: boolean
  emptyText?: string
}

export default function Table<T>({ columns, data, keyExtractor, loading, emptyText = 'No hay datos.' }: Props<T>) {
  if (loading) {
    return <div className="py-10 text-center text-sm text-text-muted">Cargando...</div>
  }

  if (data.length === 0) {
    return <div className="py-10 text-center text-sm text-text-muted">{emptyText}</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map(col => (
              <th key={col.key} className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wide">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={keyExtractor(row)} className="border-b border-border last:border-0 hover:bg-background transition-colors duration-fast">
              {columns.map(col => (
                <td key={col.key} className="py-3 px-4 text-text">
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
