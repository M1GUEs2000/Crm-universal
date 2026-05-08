interface Props {
  label?: string
  error?: string
  children: React.ReactNode
}

export default function FormField({ label, error, children }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-text-muted">{label}</label>}
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
