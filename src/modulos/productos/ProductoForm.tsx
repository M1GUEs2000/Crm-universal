import { useState } from 'react'
import { Form, FormActions, FormField, FormGrid, FormSection } from '@/components/ui'
import { Input, NumberInput, Select, Textarea, Toggle } from '@/components/ui/inputs'
import type { ActualizarProductoDto, CrearProductoDto, Producto } from '@/types'

interface Props {
  inicial?: Producto
  onGuardar: (dto: CrearProductoDto | ActualizarProductoDto) => Promise<void>
  onCancelar: () => void
}

const tipoOpciones = [
  { value: 'producto', label: 'Producto' },
  { value: 'servicio', label: 'Servicio' },
]

export default function ProductoForm({ inicial, onGuardar, onCancelar }: Props) {
  const [form, setForm] = useState({
    nombre: inicial?.nombre ?? '',
    descripcion: inicial?.descripcion ?? '',
    precio: inicial?.precio ?? 0,
    tipo: inicial?.tipo ?? 'servicio',
    activo: inicial?.activo ?? true,
  })
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [guardando, setGuardando] = useState(false)

  const set = (key: string) => (value: string | number | boolean | '') => setForm(actual => ({ ...actual, [key]: value }))

  async function handleSubmit() {
    const e: Record<string, string> = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido'
    if (Number(form.precio) < 0) e.precio = 'El precio debe ser mayor o igual a cero'
    if (Object.keys(e).length) { setErrores(e); return }

    setErrores({})
    setGuardando(true)
    const dto = {
      ...form,
      precio: Number(form.precio),
    }
    await onGuardar(inicial ? dto as ActualizarProductoDto : dto as CrearProductoDto)
    setGuardando(false)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormSection title="Datos principales">
        <FormGrid>
          <FormField label="Nombre *" error={errores.nombre}>
            <Input value={form.nombre} onChange={set('nombre')} placeholder="Consulta general" />
          </FormField>
          <FormField label="Tipo">
            <Select value={form.tipo} onChange={set('tipo')} options={tipoOpciones} />
          </FormField>
          <FormField label="Precio *" error={errores.precio}>
            <NumberInput value={form.precio} onChange={set('precio')} min={0} step={0.01} />
          </FormField>
          {inicial && (
            <FormField label="Estado">
              <Toggle checked={form.activo} onChange={set('activo')} label={form.activo ? 'Activo' : 'Inactivo'} />
            </FormField>
          )}
        </FormGrid>
      </FormSection>

      <FormSection title="Descripcion">
        <FormField>
          <Textarea value={form.descripcion} onChange={set('descripcion')} placeholder="Detalle del producto o servicio..." rows={3} />
        </FormField>
      </FormSection>

      <FormActions
        onCancel={onCancelar}
        submitText={inicial ? 'Guardar cambios' : 'Crear item'}
        loading={guardando}
      />
    </Form>
  )
}
