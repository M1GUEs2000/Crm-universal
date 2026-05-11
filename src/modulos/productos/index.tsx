import { CrudListPage } from '@/components/crud'
import { productoService } from '@/services'
import type { ActualizarProductoDto, CrearProductoDto, Producto } from '@/types'
import ProductoForm from './ProductoForm'
import { createProductoColumns, productosCrudConfig } from './config'

export default function ProductosPage() {
  return (
    <CrudListPage<Producto, CrearProductoDto, ActualizarProductoDto>
      config={productosCrudConfig}
      service={productoService}
      columns={createProductoColumns}
      renderForm={({ inicial, onGuardar, onCancelar }) => (
        <ProductoForm inicial={inicial} onGuardar={onGuardar} onCancelar={onCancelar} />
      )}
    />
  )
}
