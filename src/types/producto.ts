import type { ID } from './comun'

export type TipoProducto = 'producto' | 'servicio'

export interface Producto {
  id: ID
  nombre: string
  descripcion?: string
  precio: number
  tipo: TipoProducto
  activo: boolean
}

export interface CrearProductoDto {
  nombre: string
  descripcion?: string
  precio: number
  tipo: TipoProducto
}

export type ActualizarProductoDto = Partial<CrearProductoDto> & { activo?: boolean }
