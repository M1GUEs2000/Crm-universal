import type { CrudEntityConfig } from './types'

export type CrudFilterValues = Record<string, string>

interface FilterCrudItemsParams<TItem> {
  items: TItem[]
  config: CrudEntityConfig<TItem>
  search: string
  filters?: CrudFilterValues
}

export function filterCrudItems<TItem>({ items, config, search, filters = {} }: FilterCrudItemsParams<TItem>) {
  const normalizedSearch = search.trim().toLowerCase()

  return items.filter(item => {
    const matchesSearch = !normalizedSearch || config.getSearchText(item).toLowerCase().includes(normalizedSearch)
    const matchesFilters = Object.entries(filters).every(([key, value]) => (
      !value || config.matchesFilter?.(item, key, value) !== false
    ))

    return matchesSearch && matchesFilters
  })
}
