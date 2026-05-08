import { SearchInput, Select } from '@/components/ui/inputs'
import type { SelectOption } from '@/components/ui/inputs'

export interface SearchBarFilter {
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: SelectOption[]
}

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  filters?: SearchBarFilter[]
}

export default function SearchBar({ value, onChange, placeholder, filters }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <SearchInput value={value} onChange={onChange} placeholder={placeholder} />
      </div>
      {filters?.map((f, i) => (
        <Select
          key={i}
          value={f.value}
          onChange={f.onChange}
          placeholder={f.placeholder}
          options={f.options}
        />
      ))}
    </div>
  )
}
