import { cloneElement, isValidElement, useId } from 'react'
import type { ReactElement } from 'react'

interface Props {
  label?: string
  error?: string
  children: React.ReactNode
}

export default function FormField({ label, error, children }: Props) {
  const generatedId = useId()
  const fieldId = `field-${generatedId}`
  const errorId = `${fieldId}-error`
  let child = children

  if (isValidElement(children)) {
    const element = children as ReactElement<Record<string, unknown>>
    child = cloneElement(element, {
      id: element.props.id ?? fieldId,
      'aria-describedby': error ? errorId : element.props['aria-describedby'],
      'aria-invalid': error ? true : element.props['aria-invalid'],
    })
  }

  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={fieldId} className="text-sm text-text-muted">{label}</label>}
      {child}
      {error && <span id={errorId} className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
