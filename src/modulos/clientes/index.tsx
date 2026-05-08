import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clienteService } from '@/services'
import type { Cliente } from '@/types'
import { CrudPage, CrudContent, SearchBar, filterCrudItems } from '@/components/crud'
import { Table, Modal, ConfirmDialog, Pagination } from '@/components/ui'
import ClienteForm from './ClienteForm'
import { clientesCrudConfig, createClienteColumns } from './config'

export default function ClientesPage() {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [total, setTotal] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [modalCrear, setModalCrear] = useState(false)
  const [eliminando, setEliminando] = useState<Cliente | null>(null)
  const [procesando, setProcesando] = useState(false)

  const cargar = useCallback(async (p = pagina) => {
    setCargando(true)
    const r = await clienteService.listar(p, clientesCrudConfig.pageSize)
    if (r.ok) {
      setClientes(r.datos)
      setTotal(r.paginacion.total)
    }
    setCargando(false)
  }, [pagina])

  useEffect(() => { cargar() }, [cargar])

  const visibles = filterCrudItems({
    items: clientes,
    config: clientesCrudConfig,
    search: busqueda,
    filters: { estado: filtroEstado },
  })

  async function handleCrear(dto: Parameters<typeof clienteService.crear>[0]) {
    setProcesando(true)
    const r = await clienteService.crear(dto)
    if (r.ok) {
      setModalCrear(false)
      cargar(1)
      setPagina(1)
    }
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

  const columns = createClienteColumns({
    verDetalle: cliente => navigate(`/clientes/${cliente.id}`),
    eliminar: setEliminando,
  })

  return (
    <CrudPage
      title={clientesCrudConfig.title}
      onNuevo={() => setModalCrear(true)}
      textoNuevo={clientesCrudConfig.newLabel}
    >
      <SearchBar
        value={busqueda}
        onChange={setBusqueda}
        placeholder={clientesCrudConfig.searchPlaceholder}
        filters={(clientesCrudConfig.filters ?? []).map(filter => ({
          value: filtroEstado,
          onChange: setFiltroEstado,
          placeholder: filter.placeholder,
          options: filter.options,
        }))}
      />

      <CrudContent loading={cargando}>
        <Table
          columns={columns}
          data={visibles}
          keyExtractor={cliente => cliente.id}
          emptyText={clientesCrudConfig.emptyText}
        />
        <div className="px-4">
          <Pagination
            page={pagina}
            totalPages={Math.ceil(total / clientesCrudConfig.pageSize)}
            onChange={p => { setPagina(p); cargar(p) }}
          />
        </div>
      </CrudContent>

      <Modal
        open={modalCrear}
        onClose={() => setModalCrear(false)}
        title={clientesCrudConfig.modalCreateTitle}
        width="lg"
      >
        <ClienteForm
          onGuardar={dto => handleCrear(dto as Parameters<typeof clienteService.crear>[0])}
          onCancelar={() => setModalCrear(false)}
        />
      </Modal>

      <ConfirmDialog
        open={!!eliminando}
        onClose={() => setEliminando(null)}
        onConfirm={handleEliminar}
        title={eliminando ? clientesCrudConfig.getDeleteTitle(eliminando) : ''}
        message={eliminando ? clientesCrudConfig.getDeleteMessage(eliminando) : ''}
        loading={procesando}
      />
    </CrudPage>
  )
}
