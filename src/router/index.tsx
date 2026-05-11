import type { ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/layout/Layout'
import { getEnabledModules } from '@/config/moduleRegistry'
import ModuleGate from './ModuleGate'

function withModuleGate(moduleId: string, element: ReactNode) {
  return <ModuleGate moduleId={moduleId}>{element}</ModuleGate>
}

const moduleRoutes = getEnabledModules()
  .flatMap(mod => {
    const mainRoute = (
    mod.path === '/'
      ? { index: true as const, element: withModuleGate(mod.id, mod.element) }
      : { path: mod.path.slice(1), element: withModuleGate(mod.id, mod.element) }
    )

    const childRoutes = mod.routes?.map(route => ({
      ...route,
      element: withModuleGate(mod.id, route.element),
    })) ?? []

    return [mainRoute, ...childRoutes]
  })

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      ...moduleRoutes,
    ],
  },
])
