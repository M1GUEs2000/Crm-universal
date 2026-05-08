import { useNavigate } from 'react-router-dom'
import { CrudListPage } from '@/components/crud'
import { clienteService } from '@/services'
import type { ActualizarClienteDto, Cliente, CrearClienteDto } from '@/types'
import ClienteForm from './ClienteForm'
import { clientesCrudConfig, createClienteColumns } from './config'

export default function ClientesPage() {
  const navigate = useNavigate()

  return (
    <CrudListPage<Cliente, CrearClienteDto, ActualizarClienteDto>
      config={clientesCrudConfig}
      service={clienteService}
      columns={createClienteColumns}
      onVerDetalle={cliente => navigate(`/clientes/${cliente.id}`)}
      renderForm={({ inicial, onGuardar, onCancelar }) => (
        <ClienteForm inicial={inicial} onGuardar={onGuardar} onCancelar={onCancelar} />
      )}
    />
  )
}
