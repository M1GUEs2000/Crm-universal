import type { ID } from './comun'

export type EstadoTarea = 'pendiente' | 'en_progreso' | 'completada'
export type PrioridadTarea = 'baja' | 'media' | 'alta'

export interface Tarea {
  id: ID
  titulo: string
  descripcion?: string
  clienteId?: ID
  fechaVencimiento?: string
  estado: EstadoTarea
  prioridad: PrioridadTarea
  asignadoA?: ID
}

export interface CrearTareaDto {
  titulo: string
  descripcion?: string
  clienteId?: ID
  fechaVencimiento?: string
  prioridad: PrioridadTarea
  asignadoA?: ID
}

export type ActualizarTareaDto = Partial<CrearTareaDto> & { estado?: EstadoTarea }
