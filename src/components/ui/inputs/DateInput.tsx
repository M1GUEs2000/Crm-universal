interface Props {
  label?: string
  error?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  name?: string
  min?: string
  max?: string
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

export default function DateInput({ label, error, value, onChange, disabled, name, min, max, id, 'aria-describedby': ariaDescribedBy, 'aria-invalid': ariaInvalid }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={id} className="text-sm text-text-muted">{label}</label>}
      <input
        id={id}
        name={name}
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        min={min}
        max={max}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        className="rounded-input border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
