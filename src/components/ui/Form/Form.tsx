interface Props {
  onSubmit: () => void
  children: React.ReactNode
}

export default function Form({ onSubmit, children }: Props) {
  return (
    <form
      onSubmit={e => { e.preventDefault(); onSubmit() }}
      className="flex flex-col gap-5"
    >
      {children}
    </form>
  )
}
