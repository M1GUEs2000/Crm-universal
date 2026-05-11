import { Badge, Button } from '@/components/ui'
import type { CrudColumnFactory, CrudEntityConfig, CrudTableActions } from '@/components/crud'
import type { Producto } from '@/types'

function formatoPrecio(valor: number) {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
  }).format(valor)
}

export const productosCrudConfig: CrudEntityConfig<Producto> = {
  title: 'Productos / Servicios',
  newLabel: '+ Nuevo item',
  modalCreateTitle: 'Nuevo producto o servicio',
  searchPlaceholder: 'Buscar por nombre, descripcion o tipo...',
  emptyText: 'No se encontraron productos o servicios.',
  pageSize: 10,
  filters: [
    {
      key: 'tipo',
      placeholder: 'Todos los tipos',
      options: [
        { value: 'producto', label: 'Producto' },
        { value: 'servicio', label: 'Servicio' },
      ],
    },
    {
      key: 'activo',
      placeholder: 'Todos los estados',
      options: [
        { value: 'true', label: 'Activo' },
        { value: 'false', label: 'Inactivo' },
      ],
    },
  ],
  getSearchText: producto => [
    producto.nombre,
    producto.descripcion,
    producto.tipo,
  ].filter(Boolean).join(' '),
  matchesFilter: (producto, key, value) => {
    if (key === 'tipo') return producto.tipo === value
    if (key === 'activo') return String(producto.activo) === value
    return true
  },
  getDeleteTitle: () => 'Eliminar producto',
  getDeleteMessage: producto => `Seguro que quieres eliminar "${producto.nombre}"? Esta accion no se puede deshacer.`,
}

export const createProductoColumns: CrudColumnFactory<Producto, CrudTableActions<Producto>> = actions => [
  {
    key: 'nombre',
    header: 'Nombre',
    render: producto => (
      <div>
        <p className="font-medium text-text">{producto.nombre}</p>
        {producto.descripcion && <p className="text-xs text-text-muted">{producto.descripcion}</p>}
      </div>
    ),
  },
  {
    key: 'tipo',
    header: 'Tipo',
    render: producto => <Badge variant={producto.tipo === 'servicio' ? 'info' : 'default'}>{producto.tipo}</Badge>,
  },
  {
    key: 'precio',
    header: 'Precio',
    render: producto => formatoPrecio(producto.precio),
  },
  {
    key: 'activo',
    header: 'Estado',
    render: producto => <Badge variant={producto.activo ? 'success' : 'default'}>{producto.activo ? 'Activo' : 'Inactivo'}</Badge>,
  },
  {
    key: 'acciones',
    header: '',
    render: producto => (
      <div className="flex items-center gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={() => actions.editar(producto)}>Editar</Button>
        <Button variant="danger" size="sm" onClick={() => actions.eliminar(producto)}>Eliminar</Button>
      </div>
    ),
  },
]
