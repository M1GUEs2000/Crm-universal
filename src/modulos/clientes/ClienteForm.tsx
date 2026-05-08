import { useState } from 'react'
import { Input, Textarea, Select } from '@/components/ui/inputs'
import { Form, FormField, FormGrid, FormSection, FormActions } from '@/components/ui'
import type { Cliente, CrearClienteDto, ActualizarClienteDto } from '@/types'

interface Props {
  inicial?: Cliente
  onGuardar: (dto: CrearClienteDto | ActualizarClienteDto) => Promise<void>
  onCancelar: () => void
}

export default function ClienteForm({ inicial, onGuardar, onCancelar }: Props) {
  const [form, setForm] = useState({
    nombre:   inicial?.nombre   ?? '',
    apellido: inicial?.apellido ?? '',
    email:    inicial?.email    ?? '',
    telefono: inicial?.telefono ?? '',
    empresa:  inicial?.empresa  ?? '',
    notas:    inicial?.notas    ?? '',
    estado:   inicial?.estado   ?? 'activo',
  })
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [guardando, setGuardando] = useState(false)

  const set = (key: string) => (value: string) => setForm(f => ({ ...f, [key]: value }))

  async function handleSubmit() {
    if (!form.nombre.trim()) {
      setErrores({ nombre: 'El nombre es requerido' })
      return
    }
    setErrores({})
    setGuardando(true)
    await onGuardar(inicial ? form as ActualizarClienteDto : form as CrearClienteDto)
    setGuardando(false)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormSection title="Datos personales">
        <FormGrid>
          <FormField label="Nombre *" error={errores.nombre}>
            <Input value={form.nombre} onChange={set('nombre')} placeholder="Juan" />
          </FormField>
          <FormField label="Apellido">
            <Input value={form.apellido} onChange={set('apellido')} placeholder="Pérez" />
          </FormField>
          <FormField label="Email">
            <Input value={form.email} onChange={set('email')} type="email" placeholder="juan@email.com" />
          </FormField>
          <FormField label="Teléfono">
            <Input value={form.telefono} onChange={set('telefono')} placeholder="+593 99 000 0000" />
          </FormField>
          <FormField label="Empresa">
            <Input value={form.empresa} onChange={set('empresa')} placeholder="Empresa S.A." />
          </FormField>
          {inicial && (
            <FormField label="Estado">
              <Select
                value={form.estado}
                onChange={set('estado')}
                options={[{ value: 'activo', label: 'Activo' }, { value: 'inactivo', label: 'Inactivo' }]}
              />
            </FormField>
          )}
        </FormGrid>
      </FormSection>

      <FormSection title="Notas">
        <FormField>
          <Textarea value={form.notas} onChange={set('notas')} placeholder="Observaciones del cliente..." rows={3} />
        </FormField>
      </FormSection>

      <FormActions
        onCancel={onCancelar}
        submitText={inicial ? 'Guardar cambios' : 'Crear cliente'}
        loading={guardando}
      />
    </Form>
  )
}
