import { useLocation } from 'react-router-dom'
import { modules } from '@/config/modules'

export default function Navbar() {
  const { pathname } = useLocation()
  const modulo = modules.find(m => m.path === pathname) ?? modules[0]

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center px-6 shrink-0">
      <h1 className="text-text font-medium">{modulo.label}</h1>
    </header>
  )
}
