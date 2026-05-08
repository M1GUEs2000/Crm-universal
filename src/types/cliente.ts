import type { ID } from './comun'

export type EstadoCliente = 'activo' | 'inactivo'

export interface Cliente {
  id: ID
  nombre: string
  apellido?: string
  email?: string
  telefono?: string
  empresa?: string
  notas?: string
  estado: EstadoCliente
  fechaCreacion: string
}

export interface CrearClienteDto {
  nombre: string
  apellido?: string
  email?: string
  telefono?: string
  empresa?: string
  notas?: string
}

export type ActualizarClienteDto = Partial<CrearClienteDto> & { estado?: EstadoCliente }
