import type { ID } from './comun'

export type EstadoCita = 'pendiente' | 'confirmada' | 'cancelada' | 'completada'

export interface Cita {
  id: ID
  clienteId: ID
  titulo: string
  descripcion?: string
  fechaInicio: string
  fechaFin: string
  estado: EstadoCita
  responsableId?: ID
  notas?: string
}

export interface CrearCitaDto {
  clienteId: ID
  titulo: string
  descripcion?: string
  fechaInicio: string
  fechaFin: string
  responsableId?: ID
  notas?: string
}

export type ActualizarCitaDto = Partial<CrearCitaDto> & { estado?: EstadoCita }
