import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/layout/Layout'
import { getEnabledModules } from '@/config/moduleRegistry'

const moduleRoutes = getEnabledModules()
  .flatMap(mod => {
    const mainRoute = (
    mod.path === '/'
      ? { index: true as const, element: mod.element }
      : { path: mod.path.slice(1), element: mod.element }
    )

    return [mainRoute, ...(mod.routes ?? [])]
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
