import type { ReactNode } from 'react'
import type { TableColumn } from '@/components/ui'
import type { SelectOption } from '@/components/ui/inputs'

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
