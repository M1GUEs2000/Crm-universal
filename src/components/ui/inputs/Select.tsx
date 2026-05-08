export interface SelectOption {
  value: string
  label: string
}

interface Props {
  label?: string
  error?: string
  placeholder?: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  name?: string
}

export default function Select({ label, error, placeholder, options, value, onChange, disabled, name }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-text-muted">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="rounded-input border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
