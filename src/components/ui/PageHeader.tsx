interface Props {
  title: string
  action?: React.ReactNode
}

export default function PageHeader({ title, action }: Props) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold text-text">{title}</h1>
      {action && <div>{action}</div>}
    </div>
  )
}
