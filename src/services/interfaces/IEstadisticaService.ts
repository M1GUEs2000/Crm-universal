import type { ResumenDashboard, PuntoGrafico } from '@/types'
import type { RespuestaApi } from '@/types'

export interface IEstadisticaService {
  resumenDashboard(): Promise<RespuestaApi<ResumenDashboard>>
  clientesPorMes(): Promise<RespuestaApi<PuntoGrafico[]>>
  citasPorEstado(): Promise<RespuestaApi<PuntoGrafico[]>>
  productosMasVendidos(): Promise<RespuestaApi<PuntoGrafico[]>>
}
