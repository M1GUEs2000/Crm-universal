import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clienteService } from '@/services'
import type { Cliente } from '@/types'
import { CrudPage, CrudContent, SearchBar } from '@/components/crud'
import { Button, Table, Badge, Avatar, Modal, ConfirmDialog, Pagination } from '@/components/ui'
import type { TableColumn } from '@/components/ui'
import ClienteForm from './ClienteForm'

const POR_PAGINA = 10

export default function ClientesPage() {
  const navigate = useNavigate()
  const [clientes, setClientes]         = useState<Cliente[]>([])
  const [total, setTotal]               = useState(0)
  const [pagina, setPagina]             = useState(1)
  const [cargando, setCargando]         = useState(true)
  const [busqueda, setBusqueda]         = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [modalCrear, setModalCrear]     = useState(false)
  const [eliminando, setEliminando]     = useState<Cliente | null>(null)
  const [procesando, setProcesando]     = useState(false)

  const cargar = useCallback(async (p = pagina) => {
    setCargando(true)
    const r = await clienteService.listar(p, POR_PAGINA)
    if (r.ok) { setClientes(r.datos); setTotal(r.paginacion.total) }
    setCargando(false)
  }, [pagina])

  useEffect(() => { cargar() }, [cargar])

  const visibles = clientes.filter(c => {
    const texto = `${c.nombre} ${c.apellido ?? ''} ${c.email ?? ''} ${c.empresa ?? ''}`.toLowerCase()
    const coincideBusqueda = texto.includes(busqueda.toLowerCase())
    const coincideEstado   = !filtroEstado || c.estado === filtroEstado
    return coincideBusqueda && coincideEstado
  })

  async function handleCrear(dto: Parameters<typeof clienteService.crear>[0]) {
    setProcesando(true)
    const r = await clienteService.crear(dto)
    if (r.ok) { setModalCrear(false); cargar(1); setPagina(1) }
    setProcesando(false)
  }

  async function handleEliminar() {
    if (!eliminando) return
    setProcesando(true)
    await clienteService.eliminar(eliminando.id)
    setEliminando(null)
    cargar()
    setProcesando(false)
  }

  const columns: TableColumn<Cliente>[] = [
    {
      key: 'nombre', header: 'Cliente',
      render: c => (
        <div className="flex items-center gap-3">
          <Avatar name={`${c.nombre} ${c.apellido ?? ''}`} size="sm" />
          <div>
            <p className="font-medium text-text">{c.nombre} {c.apellido}</p>
            {c.empresa && <p className="text-xs text-text-muted">{c.empresa}</p>}
          </div>
        </div>
      ),
    },
    { key: 'email',         header: 'Email',    render: c => c.email    ?? '—' },
    { key: 'telefono',      header: 'Teléfono', render: c => c.telefono ?? '—' },
    {
      key: 'estado', header: 'Estado',
      render: c => <Badge variant={c.estado === 'activo' ? 'success' : 'default'}>{c.estado}</Badge>,
    },
    { key: 'fechaCreacion', header: 'Creado',   render: c => c.fechaCreacion },
    {
      key: 'acciones', header: '',
      render: c => (
        <div className="flex items-center gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/clientes/${c.id}`)}>Ver</Button>
          <Button variant="danger" size="sm" onClick={() => setEliminando(c)}>Eliminar</Button>
        </div>
      ),
    },
  ]

  return (
    <CrudPage title="Clientes" onNuevo={() => setModalCrear(true)} textoNuevo="+ Nuevo cliente">
      <SearchBar
        value={busqueda}
        onChange={setBusqueda}
        placeholder="Buscar por nombre, email, empresa..."
        filters={[{
          value: filtroEstado,
          onChange: setFiltroEstado,
          placeholder: 'Todos los estados',
          options: [{ value: 'activo', label: 'Activo' }, { value: 'inactivo', label: 'Inactivo' }],
        }]}
      />
      <CrudContent loading={cargando}>
        <Table columns={columns} data={visibles} keyExtractor={c => c.id} emptyText="No se encontraron clientes." />
        <div className="px-4">
          <Pagination page={pagina} totalPages={Math.ceil(total / POR_PAGINA)} onChange={p => { setPagina(p); cargar(p) }} />
        </div>
      </CrudContent>

      <Modal open={modalCrear} onClose={() => setModalCrear(false)} title="Nuevo cliente" width="lg">
        <ClienteForm onGuardar={dto => handleCrear(dto as Parameters<typeof clienteService.crear>[0])} onCancelar={() => setModalCrear(false)} />
      </Modal>

      <ConfirmDialog
        open={!!eliminando}
        onClose={() => setEliminando(null)}
        onConfirm={handleEliminar}
        title="Eliminar cliente"
        message={`¿Seguro que quieres eliminar a ${eliminando?.nombre}? Esta acción no se puede deshacer.`}
        loading={procesando}
      />
    </CrudPage>
  )
}
