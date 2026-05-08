import { Avatar, Badge, Button } from '@/components/ui'
import type { CrudColumnFactory, CrudEntityConfig, CrudTableActions } from '@/components/crud'
import type { Cliente } from '@/types'

export const clientesCrudConfig: CrudEntityConfig<Cliente> = {
  title: 'Clientes',
  newLabel: '+ Nuevo cliente',
  modalCreateTitle: 'Nuevo cliente',
  searchPlaceholder: 'Buscar por nombre, email, empresa...',
  emptyText: 'No se encontraron clientes.',
  pageSize: 10,
  filters: [
    {
      key: 'estado',
      placeholder: 'Todos los estados',
      options: [
        { value: 'activo', label: 'Activo' },
        { value: 'inactivo', label: 'Inactivo' },
      ],
    },
  ],
  getSearchText: cliente => [
    cliente.nombre,
    cliente.apellido,
    cliente.email,
    cliente.empresa,
  ].filter(Boolean).join(' '),
  matchesFilter: (cliente, key, value) => {
    if (key === 'estado') return cliente.estado === value
    return true
  },
  getDeleteTitle: () => 'Eliminar cliente',
  getDeleteMessage: cliente => `¿Seguro que quieres eliminar a ${cliente.nombre}? Esta accion no se puede deshacer.`,
}

export const createClienteColumns: CrudColumnFactory<Cliente, CrudTableActions<Cliente>> = actions => [
  {
    key: 'nombre',
    header: 'Cliente',
    render: cliente => (
      <div className="flex items-center gap-3">
        <Avatar name={`${cliente.nombre} ${cliente.apellido ?? ''}`} size="sm" />
        <div>
          <p className="font-medium text-text">{cliente.nombre} {cliente.apellido}</p>
          {cliente.empresa && <p className="text-xs text-text-muted">{cliente.empresa}</p>}
        </div>
      </div>
    ),
  },
  { key: 'email', header: 'Email', render: cliente => cliente.email ?? '-' },
  { key: 'telefono', header: 'Telefono', render: cliente => cliente.telefono ?? '-' },
  {
    key: 'estado',
    header: 'Estado',
    render: cliente => <Badge variant={cliente.estado === 'activo' ? 'success' : 'default'}>{cliente.estado}</Badge>,
  },
  { key: 'fechaCreacion', header: 'Creado', render: cliente => cliente.fechaCreacion },
  {
    key: 'acciones',
    header: '',
    render: cliente => (
      <div className="flex items-center gap-2 justify-end">
        {actions.verDetalle && <Button variant="ghost" size="sm" onClick={() => actions.verDetalle?.(cliente)}>Ver</Button>}
        <Button variant="danger" size="sm" onClick={() => actions.eliminar(cliente)}>Eliminar</Button>
      </div>
    ),
  },
]
