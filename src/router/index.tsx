import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/components/Layout'
import DashboardPage from '@/modulos/dashboard'
import ClientesPage from '@/modulos/clientes'
import ClienteDetalle from '@/modulos/clientes/ClienteDetalle'
import CalendarioPage from '@/modulos/calendario'
import CitasPage from '@/modulos/citas'
import ProductosPage from '@/modulos/productos'
import EstadisticasPage from '@/modulos/estadisticas'
import FacturacionPage from '@/modulos/facturacion'
import ConfiguracionPage from '@/modulos/configuracion'
import { modules } from '@/config/modules'

const routeElements: Record<string, React.ReactNode> = {
  dashboard: <DashboardPage />,
  clientes: <ClientesPage />,
  calendario: <CalendarioPage />,
  citas: <CitasPage />,
  productos: <ProductosPage />,
  estadisticas: <EstadisticasPage />,
  facturacion: <FacturacionPage />,
  configuracion: <ConfiguracionPage />,
}

const moduleRoutes = modules
  .filter(mod => mod.enabled)
  .map(mod => (
    mod.path === '/'
      ? { index: true as const, element: routeElements[mod.id] }
      : { path: mod.path.slice(1), element: routeElements[mod.id] }
  ))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      ...moduleRoutes,
      { path: 'clientes/:id',     element: <ClienteDetalle /> },
    ],
  },
])
