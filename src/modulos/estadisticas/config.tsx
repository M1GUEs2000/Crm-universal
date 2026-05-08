import { Calendar, Package, TrendingUp, Users } from 'lucide-react'
import type { PuntoGrafico, ResumenDashboard } from '@/types'

export const estadisticasConfig = {
  title: 'Estadisticas',
  emptyText: 'No hay datos para mostrar.',
}

export const resumenKpis = [
  {
    key: 'clientesNuevos',
    icon: <Users size={18} />,
  },
  {
    key: 'citasHoy',
    icon: <Calendar size={18} />,
  },
  {
    key: 'productosActivos',
    icon: <Package size={18} />,
  },
  {
    key: 'tareasPendientes',
    icon: <TrendingUp size={18} />,
  },
] satisfies { key: keyof ResumenDashboard; icon: React.ReactNode }[]

export const estadisticaSeries = [
  {
    key: 'clientesPorMes',
    title: 'Clientes por mes',
  },
  {
    key: 'citasPorEstado',
    title: 'Citas por estado',
  },
  {
    key: 'productosMasVendidos',
    title: 'Productos mas vendidos',
  },
] satisfies { key: string; title: string }[]

export function maxPuntoValor(puntos: PuntoGrafico[]) {
  return Math.max(...puntos.map(p => p.valor), 1)
}
