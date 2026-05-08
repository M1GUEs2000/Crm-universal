interface Props {
  label?: string
  error?: string
  placeholder?: string
  value: number | ''
  onChange: (value: number | '') => void
  disabled?: boolean
  name?: string
  min?: number
  max?: number
  step?: number
}

export default function NumberInput({ label, error, placeholder, value, onChange, disabled, name, min, max, step }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-text-muted">{label}</label>}
      <input
        name={name}
        type="number"
        value={value}
        onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className="rounded-input border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
