export type EntityFieldType = 'text' | 'email' | 'tel' | 'number' | 'select' | 'textarea' | 'date' | 'boolean'

export interface EntityFieldOption {
  value: string
  label: string
}

export interface EntityFieldDefinition {
  key: string
  label: string
  type: EntityFieldType
  required?: boolean
  placeholder?: string
  options?: EntityFieldOption[]
  defaultValue?: string | number | boolean
  searchable?: boolean
}

export interface EntitySchema {
  id: string
  label: string
  fields: EntityFieldDefinition[]
}

export const entitySchemas: Record<string, EntitySchema> = {
  clientes: {
    id: 'clientes',
    label: 'Clientes',
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true, searchable: true },
      { key: 'apellido', label: 'Apellido', type: 'text', searchable: true },
      { key: 'email', label: 'Email', type: 'email', searchable: true },
      { key: 'telefono', label: 'Telefono', type: 'tel' },
      { key: 'empresa', label: 'Empresa', type: 'text', searchable: true },
      {
        key: 'estado',
        label: 'Estado',
        type: 'select',
        defaultValue: 'activo',
        options: [
          { value: 'activo', label: 'Activo' },
          { value: 'inactivo', label: 'Inactivo' },
        ],
      },
    ],
  },
  productos: {
    id: 'productos',
    label: 'Productos',
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true, searchable: true },
      {
        key: 'tipo',
        label: 'Tipo',
        type: 'select',
        defaultValue: 'producto',
        options: [
          { value: 'producto', label: 'Producto' },
          { value: 'servicio', label: 'Servicio' },
        ],
      },
      { key: 'precio', label: 'Precio', type: 'number', required: true, defaultValue: 0 },
      { key: 'descripcion', label: 'Descripcion', type: 'textarea', searchable: true },
      { key: 'activo', label: 'Activo', type: 'boolean', defaultValue: true },
    ],
  },
}

export function getEntitySchema(entityId: string) {
  return entitySchemas[entityId]
}
