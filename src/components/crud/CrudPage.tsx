import { Button, PageHeader } from '@/components/ui'

interface Props {
  title: string
  onNuevo?: () => void
  textoNuevo?: string
  children: React.ReactNode
}

export default function CrudPage({ title, onNuevo, textoNuevo = '+ Nuevo', children }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={title}
        action={onNuevo && <Button onClick={onNuevo}>{textoNuevo}</Button>}
      />
      {children}
    </div>
  )
}
