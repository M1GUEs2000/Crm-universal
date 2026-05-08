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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true,              element: <DashboardPage /> },
      { path: 'clientes',          element: <ClientesPage /> },
      { path: 'clientes/:id',     element: <ClienteDetalle /> },
      { path: 'calendario',       element: <CalendarioPage /> },
      { path: 'citas',            element: <CitasPage /> },
      { path: 'productos',        element: <ProductosPage /> },
      { path: 'estadisticas',     element: <EstadisticasPage /> },
      { path: 'facturacion',      element: <FacturacionPage /> },
      { path: 'configuracion',    element: <ConfiguracionPage /> },
    ],
  },
])
