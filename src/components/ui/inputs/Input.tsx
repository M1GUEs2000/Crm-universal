interface Props {
  label?: string
  error?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  type?: string
  disabled?: boolean
  name?: string
}

export default function Input({ label, error, placeholder, value, onChange, type = 'text', disabled, name }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-text-muted">{label}</label>}
      <input
        name={name}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="rounded-input border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
