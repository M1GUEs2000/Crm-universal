interface Props {
  label?: string
  error?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  type?: string
  disabled?: boolean
  name?: string
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

export default function Input({ label, error, placeholder, value, onChange, type = 'text', disabled, name, id, 'aria-describedby': ariaDescribedBy, 'aria-invalid': ariaInvalid }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={id} className="text-sm text-text-muted">{label}</label>}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        className="rounded-input border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
