import type { KpiCard as KpiCardType } from '@/types'

interface Props extends KpiCardType {
  icon?: React.ReactNode
}

export default function KpiCard({ label, valor, variacion, unidad, icon }: Props) {
  const variacionPositiva = variacion !== undefined && variacion >= 0

  return (
    <div className="bg-surface rounded-card shadow-card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-muted">{label}</span>
        {icon && <span className="text-text-muted">{icon}</span>}
      </div>

      <div className="flex items-end gap-2">
        <span className="text-3xl font-semibold text-text">{valor}</span>
        {unidad && <span className="text-sm text-text-muted mb-1">{unidad}</span>}
      </div>

      {variacion !== undefined && (
        <span className={`text-xs font-medium ${variacionPositiva ? 'text-green-600' : 'text-red-500'}`}>
          {variacionPositiva ? '+' : ''}{variacion} vs mes anterior
        </span>
      )}
    </div>
  )
}
