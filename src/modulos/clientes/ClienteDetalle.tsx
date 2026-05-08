import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { clienteService } from '@/services'
import type { Cliente } from '@/types'
import { Avatar, Badge, Button, Card, Modal, ConfirmDialog, Spinner, Tabs } from '@/components/ui'
import ClienteForm from './ClienteForm'

export default function ClienteDetalle() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [cliente, setCliente]       = useState<Cliente | null>(null)
  const [cargando, setCargando]     = useState(true)
  const [modalEditar, setModalEditar] = useState(false)
  const [confirmarEliminar, setConfirmarEliminar] = useState(false)
  const [procesando, setProcesando] = useState(false)

  useEffect(() => {
    if (!id) return
    clienteService.obtener(id).then(r => {
      if (r.ok) setCliente(r.datos)
      setCargando(false)
    })
  }, [id])

  async function handleActualizar(dto: Parameters<typeof clienteService.actualizar>[1]) {
    if (!cliente) return
    setProcesando(true)
    const r = await clienteService.actualizar(cliente.id, dto)
    if (r.ok) { setCliente(r.datos); setModalEditar(false) }
    setProcesando(false)
  }

  async function handleEliminar() {
    if (!cliente) return
    setProcesando(true)
    await clienteService.eliminar(cliente.id)
    navigate('/clientes')
  }

  if (cargando) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!cliente) return <p className="text-text-muted text-sm">Cliente no encontrado.</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/clientes')} className="text-sm text-text-muted hover:text-text transition-colors cursor-pointer">
          ← Clientes
        </button>
      </div>

      <Card>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Avatar name={`${cliente.nombre} ${cliente.apellido ?? ''}`} size="lg" />
            <div>
              <h1 className="text-xl font-semibold text-text">{cliente.nombre} {cliente.apellido}</h1>
              {cliente.empresa && <p className="text-sm text-text-muted">{cliente.empresa}</p>}
              <div className="mt-1">
                <Badge variant={cliente.estado === 'activo' ? 'success' : 'default'}>{cliente.estado}</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setModalEditar(true)}>Editar</Button>
            <Button variant="danger" onClick={() => setConfirmarEliminar(true)}>Eliminar</Button>
          </div>
        </div>
      </Card>

      <Tabs
        tabs={[
          {
            key: 'info',
            label: 'Información',
            content: (
              <Card>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Email',    value: cliente.email    },
                    { label: 'Teléfono', value: cliente.telefono },
                    { label: 'Empresa',  value: cliente.empresa  },
                    { label: 'Creado',   value: cliente.fechaCreacion },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <dt className="text-xs text-text-muted mb-0.5">{label}</dt>
                      <dd className="text-sm text-text">{value ?? '—'}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            ),
          },
          {
            key: 'notas',
            label: 'Notas',
            content: (
              <Card>
                <p className="text-sm text-text whitespace-pre-wrap">
                  {cliente.notas || <span className="text-text-muted">Sin notas registradas.</span>}
                </p>
              </Card>
            ),
          },
        ]}
      />

      <Modal open={modalEditar} onClose={() => setModalEditar(false)} title="Editar cliente" width="lg">
        <ClienteForm inicial={cliente} onGuardar={handleActualizar} onCancelar={() => setModalEditar(false)} />
      </Modal>

      <ConfirmDialog
        open={confirmarEliminar}
        onClose={() => setConfirmarEliminar(false)}
        onConfirm={handleEliminar}
        title="Eliminar cliente"
        message={`¿Seguro que quieres eliminar a ${cliente.nombre}? Esta acción no se puede deshacer.`}
        loading={procesando}
      />
    </div>
  )
}
