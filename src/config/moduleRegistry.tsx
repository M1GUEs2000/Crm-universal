import { createElement, lazy } from 'react'
import type { ComponentType, ReactNode } from 'react'
import { BarChart2, Calendar, Clock, LayoutDashboard, Package, Receipt, Settings, Users } from 'lucide-react'
import { crmConfig } from './crm.config'
import type { ModuleVisibility } from './crm.config'

function lazyElement(importer: () => Promise<{ default: ComponentType }>) {
  return createElement(lazy(importer))
}

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
    element: lazyElement(() => import('@/modulos/dashboard')),
  },
  {
    id: 'clientes',
    label: 'Clientes',
    defaultLabel: 'Clientes',
    path: '/clientes',
    defaultVisibility: 'enabled',
    icon: Users,
    element: lazyElement(() => import('@/modulos/clientes')),
    routes: [{ path: 'clientes/:id', element: lazyElement(() => import('@/modulos/clientes/ClienteDetalle')) }],
  },
  {
    id: 'calendario',
    label: 'Calendario',
    defaultLabel: 'Calendario',
    path: '/calendario',
    defaultVisibility: 'enabled',
    icon: Calendar,
    element: lazyElement(() => import('@/modulos/calendario')),
  },
  {
    id: 'citas',
    label: 'Citas',
    defaultLabel: 'Citas',
    path: '/citas',
    defaultVisibility: 'enabled',
    icon: Clock,
    element: lazyElement(() => import('@/modulos/citas')),
  },
  {
    id: 'productos',
    label: 'Productos',
    defaultLabel: 'Productos',
    path: '/productos',
    defaultVisibility: 'enabled',
    icon: Package,
    element: lazyElement(() => import('@/modulos/productos')),
  },
  {
    id: 'estadisticas',
    label: 'Estadisticas',
    defaultLabel: 'Estadisticas',
    path: '/estadisticas',
    defaultVisibility: 'enabled',
    icon: BarChart2,
    element: lazyElement(() => import('@/modulos/estadisticas')),
  },
  {
    id: 'facturacion',
    label: 'Facturacion',
    defaultLabel: 'Facturacion',
    path: '/facturacion',
    defaultVisibility: 'locked',
    icon: Receipt,
    element: lazyElement(() => import('@/modulos/facturacion')),
  },
  {
    id: 'configuracion',
    label: 'Configuracion',
    defaultLabel: 'Configuracion',
    path: '/configuracion',
    defaultVisibility: 'enabled',
    icon: Settings,
    element: lazyElement(() => import('@/modulos/configuracion')),
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
