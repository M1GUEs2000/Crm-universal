import { Tabs, PageHeader } from '@/components/ui'
import DatosEmpresaPage from './DatosEmpresa'
import ParametrosFacturacionPage from './ParametrosFacturacion'

export default function DatosFacturacionPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Datos de Facturacion" />
      <Tabs
        tabs={[
          {
            key: 'empresa',
            label: 'Datos de la empresa',
            content: <DatosEmpresaPage ocultarEncabezado />,
          },
          {
            key: 'parametros',
            label: 'Parametros de facturacion',
            content: <ParametrosFacturacionPage ocultarEncabezado />,
          },
        ]}
      />
    </div>
  )
}
