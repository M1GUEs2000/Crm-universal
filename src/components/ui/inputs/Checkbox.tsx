interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  id?: string
}

export default function Checkbox({ checked, onChange, label, disabled, id }: Props) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
        className="w-4 h-4 rounded accent-primary disabled:opacity-50 cursor-pointer"
      />
      {label && <span className="text-sm text-text">{label}</span>}
    </label>
  )
}
