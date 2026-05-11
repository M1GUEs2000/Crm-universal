import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-end gap-2 pt-4" aria-label="Paginacion">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Pagina anterior"
        className="p-1.5 rounded-button text-text-muted hover:text-text hover:bg-background disabled:opacity-30 transition-colors cursor-pointer"
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </button>

      <span className="text-sm text-text-muted" aria-live="polite">
        {page} / {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Pagina siguiente"
        className="p-1.5 rounded-button text-text-muted hover:text-text hover:bg-background disabled:opacity-30 transition-colors cursor-pointer"
      >
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  )
}
