import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronDown, Lock } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { getNavigationModules } from '@/config/moduleRegistry'
import { crmConfig } from '@/config/crm.config'
import { MODULE_PREFERENCES_CHANGED } from '@/config/modulePreferences'

function navClass(isActive: boolean, extra = '') {
  return `flex items-center gap-3 px-6 py-2.5 text-sm transition-colors animate-slide-in ${
    isActive
      ? 'bg-sidebar-active text-white'
      : 'hover:bg-sidebar-hover hover:text-white'
  } ${extra}`
}

export default function Sidebar() {
  const { pathname } = useLocation()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [modules, setModules] = useState(() => getNavigationModules())

  useEffect(() => {
    const refreshModules = () => setModules(getNavigationModules())

    window.addEventListener(MODULE_PREFERENCES_CHANGED, refreshModules)
    return () => window.removeEventListener(MODULE_PREFERENCES_CHANGED, refreshModules)
  }, [])

  useEffect(() => {
    modules.forEach(mod => {
      if (!mod.navItems?.some(item => pathname === item.path || pathname.startsWith(`${item.path}/`))) return
      setOpenSections(actual => ({ ...actual, [mod.id]: true }))
    })
  }, [modules, pathname])

  return (
    <aside className="w-64 h-screen bg-sidebar text-sidebar-text flex flex-col shrink-0" aria-label="Barra lateral">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <span className="text-white font-semibold text-lg">{crmConfig.shortName}</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4" aria-label="Navegacion principal">
        {modules.map(mod => {
          const Icon = mod.icon

          if (mod.locked) {
            return (
              <div
                key={mod.id}
                className="flex items-center gap-3 px-6 py-2.5 text-sidebar-muted cursor-not-allowed select-none"
              >
                <Icon size={18} aria-hidden="true" />
                <span className="text-sm">{mod.label}</span>
                <Lock size={12} className="ml-auto" />
              </div>
            )
          }

          if (mod.navItems?.length) {
            const expanded = openSections[mod.id] ?? false
            const isSectionActive = mod.navItems.some(item => pathname === item.path || pathname.startsWith(`${item.path}/`))

            return (
              <div key={mod.id}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`sidebar-${mod.id}`}
                  onClick={() => setOpenSections(actual => ({ ...actual, [mod.id]: !expanded }))}
                  className={`flex w-full items-center gap-3 px-6 py-2.5 text-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${
                    isSectionActive ? 'bg-sidebar-active text-white' : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
                  }`}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{mod.label}</span>
                  <ChevronDown
                    size={14}
                    aria-hidden="true"
                    className={`ml-auto transition-transform ${expanded ? 'rotate-180' : ''}`}
                  />
                </button>
                {expanded && (
                  <div id={`sidebar-${mod.id}`} className="flex flex-col" aria-label={`Opciones de ${mod.label}`}>
                    {mod.navItems.map(item => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => navClass(isActive, 'pl-12 text-xs')}
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return (
            <NavLink
              key={mod.id}
              to={mod.path}
              end={mod.path === '/'}
              className={({ isActive }) => navClass(isActive)}
            >
              <Icon size={18} aria-hidden="true" />
              {mod.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
