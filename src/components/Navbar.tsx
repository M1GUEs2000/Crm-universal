import { useLocation } from 'react-router-dom'
import { modules } from '@/config/modules'

export default function Navbar() {
  const { pathname } = useLocation()
  const modulo = modules.find(m => m.path === pathname) ?? modules[0]

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shrink-0">
      <h1 className="text-gray-800 font-medium">{modulo.label}</h1>
    </header>
  )
}
