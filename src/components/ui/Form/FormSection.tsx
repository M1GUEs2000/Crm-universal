interface Props {
  title?: string
  children: React.ReactNode
}

export default function FormSection({ title, children }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {title && (
        <div className="border-b border-border pb-2">
          <h3 className="text-sm font-medium text-text">{title}</h3>
        </div>
      )}
      {children}
    </div>
  )
}
