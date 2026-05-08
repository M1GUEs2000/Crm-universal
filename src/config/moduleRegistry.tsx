import type { ComponentType, ReactNode } from 'react'
import { BarChart2, Calendar, Clock, LayoutDashboard, Package, Receipt, Settings, Users } from 'lucide-react'
import DashboardPage from '@/modulos/dashboard'
import ClientesPage from '@/modulos/clientes'
import ClienteDetalle from '@/modulos/clientes/ClienteDetalle'
import CalendarioPage from '@/modulos/calendario'
import CitasPage from '@/modulos/citas'
import ProductosPage from '@/modulos/productos'
import EstadisticasPage from '@/modulos/estadisticas'
import FacturacionPage from '@/modulos/facturacion'
import ConfiguracionPage from '@/modulos/configuracion'

export interface ModuleRoute {
  path: string
  element: ReactNode
}

export interface AppModule {
  id: string
  label: string
  path: string
  enabled: boolean
  locked?: boolean
  icon: ComponentType<{ size?: number; className?: string }>
  element: ReactNode
  routes?: ModuleRoute[]
}

export const appModules: AppModule[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    enabled: true,
    icon: LayoutDashboard,
    element: <DashboardPage />,
  },
  {
    id: 'clientes',
    label: 'Clientes',
    path: '/clientes',
    enabled: true,
    icon: Users,
    element: <ClientesPage />,
    routes: [{ path: 'clientes/:id', element: <ClienteDetalle /> }],
  },
  {
    id: 'calendario',
    label: 'Calendario',
    path: '/calendario',
    enabled: true,
    icon: Calendar,
    element: <CalendarioPage />,
  },
  {
    id: 'citas',
    label: 'Citas',
    path: '/citas',
    enabled: true,
    icon: Clock,
    element: <CitasPage />,
  },
  {
    id: 'productos',
    label: 'Productos',
    path: '/productos',
    enabled: true,
    icon: Package,
    element: <ProductosPage />,
  },
  {
    id: 'estadisticas',
    label: 'Estadisticas',
    path: '/estadisticas',
    enabled: true,
    icon: BarChart2,
    element: <EstadisticasPage />,
  },
  {
    id: 'facturacion',
    label: 'Facturacion',
    path: '/facturacion',
    enabled: false,
    locked: true,
    icon: Receipt,
    element: <FacturacionPage />,
  },
  {
    id: 'configuracion',
    label: 'Configuracion',
    path: '/configuracion',
    enabled: true,
    icon: Settings,
    element: <ConfiguracionPage />,
  },
]

export function getEnabledModules() {
  return appModules.filter(module => module.enabled)
}

export function getNavigationModules() {
  return appModules.filter(module => module.enabled || module.locked)
}

export function findModuleByPath(pathname: string) {
  return appModules.find(module => module.path === pathname || pathname.startsWith(`${module.path}/`))
}
