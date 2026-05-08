import { useCallback, useEffect, useState } from 'react'
import { citaService } from '@/services'
import type { Cita, EstadoCita } from '@/types'
import { CrudPage, CrudContent, SearchBar } from '@/components/crud'
import { Table, Badge, Button, Modal, ConfirmDialog, Pagination } from '@/components/ui'
import type { TableColumn } from '@/components/ui'
import CitaForm from './CitaForm'

const POR_PAGINA = 10

const estadoVariant: Record<EstadoCita, 'warning' | 'success' | 'danger' | 'info'> = {
  pendiente:  'warning',
  confirmada: 'success',
  cancelada:  'danger',
  completada: 'info',
}

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })
}

export default function CitasPage() {
  const [citas, setCitas]           = useState<Cita[]>([])
  const [total, setTotal]           = useState(0)
  const [pagina, setPagina]         = useState(1)
  const [cargando, setCargando]     = useState(true)
  const [busqueda, setBusqueda]     = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [modalCrear, setModalCrear] = useState(false)
  const [editando, setEditando]     = useState<Cita | null>(null)
  const [eliminando, setEliminando] = useState<Cita | null>(null)
  const [procesando, setProcesando] = useState(false)

  const cargar = useCallback(async (p = pagina) => {
    setCargando(true)
    const r = await citaService.listar(p, POR_PAGINA)
    if (r.ok) { setCitas(r.datos); setTotal(r.paginacion.total) }
    setCargando(false)
  }, [pagina])

  useEffect(() => { cargar() }, [cargar])

  const visibles = citas.filter(c => {
    const coincideBusqueda = c.titulo.toLowerCase().includes(busqueda.toLowerCase())
    const coincideEstado   = !filtroEstado || c.estado === filtroEstado
    return coincideBusqueda && coincideEstado
  })

  async function handleCrear(dto: Parameters<typeof citaService.crear>[0]) {
    setProcesando(true)
    const r = await citaService.crear(dto)
    if (r.ok) { setModalCrear(false); cargar(1); setPagina(1) }
    setProcesando(false)
  }

  async function handleEditar(dto: Parameters<typeof citaService.actualizar>[1]) {
    if (!editando) return
    setProcesando(true)
    const r = await citaService.actualizar(editando.id, dto)
    if (r.ok) { setEditando(null); cargar() }
    setProcesando(false)
  }

  async function handleEliminar() {
    if (!eliminando) return
    setProcesando(true)
    await citaService.eliminar(eliminando.id)
    setEliminando(null)
    cargar()
    setProcesando(false)
  }

  const columns: TableColumn<Cita>[] = [
    { key: 'titulo',      header: 'Título',   render: c => <span className="font-medium text-text">{c.titulo}</span> },
    { key: 'fechaInicio', header: 'Inicio',   render: c => formatFecha(c.fechaInicio) },
    { key: 'fechaFin',    header: 'Fin',      render: c => formatFecha(c.fechaFin) },
    {
      key: 'estado', header: 'Estado',
      render: c => <Badge variant={estadoVariant[c.estado]}>{c.estado}</Badge>,
    },
    {
      key: 'acciones', header: '',
      render: c => (
        <div className="flex items-center gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={() => setEditando(c)}>Editar</Button>
          <Button variant="danger" size="sm" onClick={() => setEliminando(c)}>Eliminar</Button>
        </div>
      ),
    },
  ]

  return (
    <CrudPage title="Citas" onNuevo={() => setModalCrear(true)} textoNuevo="+ Nueva cita">
      <SearchBar
        value={busqueda}
        onChange={setBusqueda}
        placeholder="Buscar por título..."
        filters={[{
          value: filtroEstado,
          onChange: setFiltroEstado,
          placeholder: 'Todos los estados',
          options: [
            { value: 'pendiente',  label: 'Pendiente'  },
            { value: 'confirmada', label: 'Confirmada' },
            { value: 'cancelada',  label: 'Cancelada'  },
            { value: 'completada', label: 'Completada' },
          ],
        }]}
      />
      <CrudContent loading={cargando}>
        <Table columns={columns} data={visibles} keyExtractor={c => c.id} emptyText="No hay citas registradas." />
        <div className="px-4">
          <Pagination page={pagina} totalPages={Math.ceil(total / POR_PAGINA)} onChange={p => { setPagina(p); cargar(p) }} />
        </div>
      </CrudContent>

      <Modal open={modalCrear} onClose={() => setModalCrear(false)} title="Nueva cita" width="lg">
        <CitaForm onGuardar={dto => handleCrear(dto as Parameters<typeof citaService.crear>[0])} onCancelar={() => setModalCrear(false)} />
      </Modal>

      <Modal open={!!editando} onClose={() => setEditando(null)} title="Editar cita" width="lg">
        {editando && <CitaForm inicial={editando} onGuardar={handleEditar} onCancelar={() => setEditando(null)} />}
      </Modal>

      <ConfirmDialog
        open={!!eliminando}
        onClose={() => setEliminando(null)}
        onConfirm={handleEliminar}
        title="Eliminar cita"
        message={`¿Seguro que quieres eliminar "${eliminando?.titulo}"?`}
        loading={procesando}
      />
    </CrudPage>
  )
}
