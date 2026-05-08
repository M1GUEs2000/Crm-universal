import { useEffect, useState } from 'react'
import { Users, Calendar, Package, CheckSquare } from 'lucide-react'
import KpiCard from '@/components/KpiCard'
import { estadisticaService } from '@/services'
import type { ResumenDashboard } from '@/types'

export default function DashboardPage() {
  const [resumen, setResumen] = useState<ResumenDashboard | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    estadisticaService.resumenDashboard().then(r => {
      if (r.ok) setResumen(r.datos)
      setCargando(false)
    })
  }, [])

  if (cargando) {
    return <div className="text-text-muted text-sm">Cargando...</div>
  }

  if (!resumen) {
    return <div className="text-text-muted text-sm">No se pudieron cargar los datos.</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard {...resumen.clientesNuevos}  icon={<Users size={18} />} />
        <KpiCard {...resumen.citasHoy}         icon={<Calendar size={18} />} />
        <KpiCard {...resumen.productosActivos} icon={<Package size={18} />} />
        <KpiCard {...resumen.tareasPendientes} icon={<CheckSquare size={18} />} />
      </div>
    </div>
  )
}
