interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  ariaLabel?: string
}

export default function Toggle({ checked, onChange, label, disabled, ariaLabel }: Props) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label ? undefined : ariaLabel}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 ${checked ? 'bg-primary' : 'bg-border'}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-fast ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
      {label && <span className="text-sm text-text">{label}</span>}
    </label>
  )
}
