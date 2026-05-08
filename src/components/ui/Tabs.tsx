import { useId, useState } from 'react'

export interface Tab {
  key: string
  label: string
  content: React.ReactNode
}

interface Props {
  tabs: Tab[]
  defaultTab?: string
}

export default function Tabs({ tabs, defaultTab }: Props) {
  const baseId = useId()
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.key)

  const current = tabs.find(t => t.key === active)

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" className="flex border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.key}
            id={`${baseId}-${tab.key}-tab`}
            type="button"
            role="tab"
            aria-selected={active === tab.key}
            aria-controls={`${baseId}-${tab.key}-panel`}
            tabIndex={active === tab.key ? 0 : -1}
            onClick={() => setActive(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-fast cursor-pointer border-b-2 -mb-px ${
              active === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {current && (
        <div
          id={`${baseId}-${current.key}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-${current.key}-tab`}
        >
          {current.content}
        </div>
      )}
    </div>
  )
}
