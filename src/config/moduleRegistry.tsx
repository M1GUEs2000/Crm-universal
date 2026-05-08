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
import { crmConfig } from './crm.config'
import type { ModuleVisibility } from './crm.config'

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

interface BaseModule extends Omit<AppModule, 'enabled' | 'locked'> {
  defaultLabel: string
  defaultVisibility: ModuleVisibility
}

const baseModules: BaseModule[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    defaultLabel: 'Dashboard',
    path: '/',
    defaultVisibility: 'enabled',
    icon: LayoutDashboard,
    element: <DashboardPage />,
  },
  {
    id: 'clientes',
    label: 'Clientes',
    defaultLabel: 'Clientes',
    path: '/clientes',
    defaultVisibility: 'enabled',
    icon: Users,
    element: <ClientesPage />,
    routes: [{ path: 'clientes/:id', element: <ClienteDetalle /> }],
  },
  {
    id: 'calendario',
    label: 'Calendario',
    defaultLabel: 'Calendario',
    path: '/calendario',
    defaultVisibility: 'enabled',
    icon: Calendar,
    element: <CalendarioPage />,
  },
  {
    id: 'citas',
    label: 'Citas',
    defaultLabel: 'Citas',
    path: '/citas',
    defaultVisibility: 'enabled',
    icon: Clock,
    element: <CitasPage />,
  },
  {
    id: 'productos',
    label: 'Productos',
    defaultLabel: 'Productos',
    path: '/productos',
    defaultVisibility: 'enabled',
    icon: Package,
    element: <ProductosPage />,
  },
  {
    id: 'estadisticas',
    label: 'Estadisticas',
    defaultLabel: 'Estadisticas',
    path: '/estadisticas',
    defaultVisibility: 'enabled',
    icon: BarChart2,
    element: <EstadisticasPage />,
  },
  {
    id: 'facturacion',
    label: 'Facturacion',
    defaultLabel: 'Facturacion',
    path: '/facturacion',
    defaultVisibility: 'locked',
    icon: Receipt,
    element: <FacturacionPage />,
  },
  {
    id: 'configuracion',
    label: 'Configuracion',
    defaultLabel: 'Configuracion',
    path: '/configuracion',
    defaultVisibility: 'enabled',
    icon: Settings,
    element: <ConfiguracionPage />,
  },
]

function resolveVisibility(id: string, fallback: ModuleVisibility) {
  return crmConfig.modules[id]?.visibility ?? fallback
}

export const appModules: AppModule[] = baseModules.map(module => {
  const visibility = resolveVisibility(module.id, module.defaultVisibility)

  return {
    id: module.id,
    label: crmConfig.modules[module.id]?.label ?? module.defaultLabel,
    path: module.path,
    enabled: visibility === 'enabled',
    locked: visibility === 'locked',
    icon: module.icon,
    element: module.element,
    routes: module.routes,
  }
})

export function getEnabledModules() {
  return appModules.filter(module => module.enabled)
}

export function getNavigationModules() {
  return appModules.filter(module => module.enabled || module.locked)
}

export function findModuleByPath(pathname: string) {
  return appModules.find(module => module.path === pathname || pathname.startsWith(`${module.path}/`))
}
