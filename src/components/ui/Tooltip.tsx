import { cloneElement, isValidElement, useId } from 'react'
import type { ReactElement } from 'react'

interface Props {
  text: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const positions = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  right:  'left-full top-1/2 -translate-y-1/2 ml-2',
}

export default function Tooltip({ text, children, position = 'top' }: Props) {
  const tooltipId = useId()
  const child = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
      'aria-describedby': tooltipId,
    })
    : children

  return (
    <div className="relative inline-flex group">
      {child}
      <span
        id={tooltipId}
        role="tooltip"
        className={`absolute z-50 ${positions[position]} whitespace-nowrap rounded px-2 py-1 text-xs text-white bg-gray-800 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-fast pointer-events-none`}
      >
        {text}
      </span>
    </div>
  )
}
