import type { ReactNode } from 'react'
import type { TableColumn } from '@/components/ui'
import type { SelectOption } from '@/components/ui/inputs'
import type { ID, RespuestaApi, RespuestaPaginada } from '@/types'

export interface CrudFilterDefinition {
  key: string
  placeholder: string
  options: SelectOption[]
}

export interface CrudEntityConfig<TItem> {
  title: string
  newLabel: string
  modalCreateTitle: string
  searchPlaceholder: string
  emptyText: string
  pageSize: number
  filters?: CrudFilterDefinition[]
  getSearchText: (item: TItem) => string
  matchesFilter?: (item: TItem, key: string, value: string) => boolean
  getDeleteTitle: (item: TItem) => string
  getDeleteMessage: (item: TItem) => string
}

export type CrudColumnFactory<TItem, TActions = unknown> = (actions: TActions) => TableColumn<TItem>[]

export type CrudFormRenderer = ReactNode

export interface CrudService<TItem, TCreate, TUpdate> {
  listar(pagina?: number, porPagina?: number): Promise<RespuestaPaginada<TItem>>
  crear(dto: TCreate): Promise<RespuestaApi<TItem>>
  actualizar(id: ID, dto: TUpdate): Promise<RespuestaApi<TItem>>
  eliminar(id: ID): Promise<RespuestaApi<void>>
}

export interface CrudTableActions<TItem> {
  editar: (item: TItem) => void
  eliminar: (item: TItem) => void
  verDetalle?: (item: TItem) => void
}
