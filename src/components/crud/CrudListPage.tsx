import { useCallback, useEffect, useState } from 'react'
import { ConfirmDialog, Modal, Pagination, Table } from '@/components/ui'
import { CrudContent, CrudPage, SearchBar, filterCrudItems } from '@/components/crud'
import type { CrudEntityConfig, CrudFilterValues, CrudService, CrudTableActions } from '@/components/crud'
import type { ID } from '@/types'
import type { TableColumn } from '@/components/ui'

interface Props<TItem extends { id: ID }, TCreate, TUpdate> {
  config: CrudEntityConfig<TItem>
  service: CrudService<TItem, TCreate, TUpdate>
  columns: (actions: CrudTableActions<TItem>) => TableColumn<TItem>[]
  renderForm: (props: {
    inicial?: TItem
    onGuardar: (dto: TCreate | TUpdate) => Promise<void>
    onCancelar: () => void
  }) => React.ReactNode
  onVerDetalle?: (item: TItem) => void
}

export default function CrudListPage<TItem extends { id: ID }, TCreate, TUpdate>({
  config,
  service,
  columns,
  renderForm,
  onVerDetalle,
}: Props<TItem, TCreate, TUpdate>) {
  const [items, setItems] = useState<TItem[]>([])
  const [total, setTotal] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtros, setFiltros] = useState<CrudFilterValues>({})
  const [modalCrear, setModalCrear] = useState(false)
  const [editando, setEditando] = useState<TItem | null>(null)
  const [eliminando, setEliminando] = useState<TItem | null>(null)
  const [procesando, setProcesando] = useState(false)

  const cargar = useCallback(async (p = pagina) => {
    setCargando(true)
    const r = await service.listar(p, config.pageSize)
    if (r.ok) {
      setItems(r.datos)
      setTotal(r.paginacion.total)
    }
    setCargando(false)
  }, [config.pageSize, pagina, service])

  useEffect(() => { cargar() }, [cargar])

  const visibles = filterCrudItems({
    items,
    config,
    search: busqueda,
    filters: filtros,
  })

  async function handleCrear(dto: TCreate | TUpdate) {
    setProcesando(true)
    const r = await service.crear(dto as TCreate)
    if (r.ok) {
      setModalCrear(false)
      cargar(1)
      setPagina(1)
    }
    setProcesando(false)
  }

  async function handleEditar(dto: TCreate | TUpdate) {
    if (!editando) return
    setProcesando(true)
    const r = await service.actualizar(editando.id, dto as TUpdate)
    if (r.ok) {
      setEditando(null)
      cargar()
    }
    setProcesando(false)
  }

  async function handleEliminar() {
    if (!eliminando) return
    setProcesando(true)
    await service.eliminar(eliminando.id)
    setEliminando(null)
    cargar()
    setProcesando(false)
  }

  return (
    <CrudPage title={config.title} onNuevo={() => setModalCrear(true)} textoNuevo={config.newLabel}>
      <SearchBar
        value={busqueda}
        onChange={setBusqueda}
        placeholder={config.searchPlaceholder}
        filters={(config.filters ?? []).map(filter => ({
          value: filtros[filter.key] ?? '',
          onChange: value => setFiltros(actual => ({ ...actual, [filter.key]: value })),
          placeholder: filter.placeholder,
          options: filter.options,
        }))}
      />

      <CrudContent loading={cargando}>
        <Table
          columns={columns({ editar: setEditando, eliminar: setEliminando, verDetalle: onVerDetalle })}
          data={visibles}
          keyExtractor={item => item.id}
          emptyText={config.emptyText}
        />
        <div className="px-4">
          <Pagination
            page={pagina}
            totalPages={Math.ceil(total / config.pageSize)}
            onChange={p => { setPagina(p); cargar(p) }}
          />
        </div>
      </CrudContent>

      <Modal open={modalCrear} onClose={() => setModalCrear(false)} title={config.modalCreateTitle} width="lg">
        {renderForm({
          onGuardar: handleCrear,
          onCancelar: () => setModalCrear(false),
        })}
      </Modal>

      <Modal open={!!editando} onClose={() => setEditando(null)} title={`Editar ${config.title.toLowerCase()}`} width="lg">
        {editando && renderForm({
          inicial: editando,
          onGuardar: handleEditar,
          onCancelar: () => setEditando(null),
        })}
      </Modal>

      <ConfirmDialog
        open={!!eliminando}
        onClose={() => setEliminando(null)}
        onConfirm={handleEliminar}
        title={eliminando ? config.getDeleteTitle(eliminando) : ''}
        message={eliminando ? config.getDeleteMessage(eliminando) : ''}
        loading={procesando}
      />
    </CrudPage>
  )
}
