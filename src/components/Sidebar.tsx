import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Calendar, Clock, Package, BarChart2, Receipt, Settings, Lock } from 'lucide-react'
import { modules } from '@/config/modules'

const iconos: Record<string, React.ReactNode> = {
  dashboard:    <LayoutDashboard size={18} />,
  clientes:     <Users size={18} />,
  calendario:   <Calendar size={18} />,
  citas:        <Clock size={18} />,
  productos:    <Package size={18} />,
  estadisticas: <BarChart2 size={18} />,
  facturacion:  <Receipt size={18} />,
  configuracion:<Settings size={18} />,
}

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-gray-300 flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-700">
        <span className="text-white font-semibold text-lg">CRM</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {modules.map(mod => {
          if (mod.locked) {
            return (
              <div
                key={mod.id}
                className="flex items-center gap-3 px-6 py-2.5 text-gray-600 cursor-not-allowed select-none"
              >
                {iconos[mod.id]}
                <span className="text-sm">{mod.label}</span>
                <Lock size={12} className="ml-auto" />
              </div>
            )
          }

          if (!mod.enabled) return null

          return (
            <NavLink
              key={mod.id}
              to={mod.path}
              end={mod.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-gray-700 text-white'
                    : 'hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {iconos[mod.id]}
              {mod.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
