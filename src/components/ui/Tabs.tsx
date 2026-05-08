import { useState } from 'react'

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
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.key)

  const current = tabs.find(t => t.key === active)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.key}
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
      <div>{current?.content}</div>
    </div>
  )
}
