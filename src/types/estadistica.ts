export interface KpiCard {
  label: string
  valor: number
  variacion?: number
  unidad?: string
}

export interface PuntoGrafico {
  etiqueta: string
  valor: number
}

export interface ResumenDashboard {
  clientesNuevos: KpiCard
  citasHoy: KpiCard
  productosActivos: KpiCard
  tareasPendientes: KpiCard
}
