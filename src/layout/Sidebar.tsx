import { NavLink } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { getNavigationModules } from '@/config/moduleRegistry'
import { crmConfig } from '@/config/crm.config'

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-sidebar text-sidebar-text flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <span className="text-white font-semibold text-lg">{crmConfig.shortName}</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {getNavigationModules().map(mod => {
          const Icon = mod.icon

          if (mod.locked) {
            return (
              <div
                key={mod.id}
                className="flex items-center gap-3 px-6 py-2.5 text-sidebar-muted cursor-not-allowed select-none"
              >
                <Icon size={18} />
                <span className="text-sm">{mod.label}</span>
                <Lock size={12} className="ml-auto" />
              </div>
            )
          }

          return (
            <NavLink
              key={mod.id}
              to={mod.path}
              end={mod.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-2.5 text-sm transition-colors animate-slide-in ${
                  isActive
                    ? 'bg-sidebar-active text-white'
                    : 'hover:bg-sidebar-hover hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {mod.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
