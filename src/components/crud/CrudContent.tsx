import { Spinner } from '@/components/ui'

interface Props {
  loading?: boolean
  children: React.ReactNode
}

export default function CrudContent({ loading, children }: Props) {
  return (
    <div className="bg-surface rounded-card shadow-card">
      {loading
        ? <div className="flex justify-center py-10"><Spinner size="lg" /></div>
        : children
      }
    </div>
  )
}
