import Button from '../Button'

interface Props {
  onCancel?: () => void
  cancelText?: string
  submitText?: string
  loading?: boolean
  disabled?: boolean
}

export default function FormActions({ onCancel, cancelText = 'Cancelar', submitText = 'Guardar', loading, disabled }: Props) {
  return (
    <div className="flex justify-end gap-2 pt-2 border-t border-border">
      {onCancel && (
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>
      )}
      <Button type="submit" loading={loading} disabled={disabled}>
        {submitText}
      </Button>
    </div>
  )
}
