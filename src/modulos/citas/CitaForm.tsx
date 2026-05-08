import { useEffect, useState } from 'react'
import { clienteService } from '@/services'
import { Input, Textarea, Select } from '@/components/ui/inputs'
import { Form, FormField, FormGrid, FormSection, FormActions } from '@/components/ui'
import type { Cita, CrearCitaDto, ActualizarCitaDto } from '@/types'

interface Props {
  inicial?: Cita
  fechaDefecto?: string
  onGuardar: (dto: CrearCitaDto | ActualizarCitaDto) => Promise<void>
  onCancelar: () => void
}

const estadoOpciones = [
  { value: 'pendiente',  label: 'Pendiente'  },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'cancelada',  label: 'Cancelada'  },
  { value: 'completada', label: 'Completada' },
]

export default function CitaForm({ inicial, fechaDefecto, onGuardar, onCancelar }: Props) {
  const [form, setForm] = useState({
    titulo:      inicial?.titulo      ?? '',
    clienteId:   inicial?.clienteId   ?? '',
    fechaInicio: inicial?.fechaInicio?.slice(0, 16) ?? fechaDefecto ?? '',
    fechaFin:    inicial?.fechaFin?.slice(0, 16)    ?? '',
    descripcion: inicial?.descripcion ?? '',
    notas:       inicial?.notas       ?? '',
    estado:      inicial?.estado      ?? 'pendiente',
  })
  const [errores, setErrores]   = useState<Record<string, string>>({})
  const [guardando, setGuardando] = useState(false)
  const [clienteOpciones, setClienteOpciones] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    clienteService.listar(1, 100).then(r => {
      if (r.ok) setClienteOpciones(r.datos.map(c => ({ value: c.id, label: `${c.nombre} ${c.apellido ?? ''}`.trim() })))
    })
  }, [])

  const set = (key: string) => (value: string) => setForm(f => ({ ...f, [key]: value }))

  async function handleSubmit() {
    const e: Record<string, string> = {}
    if (!form.titulo.trim())    e.titulo    = 'El título es requerido'
    if (!form.clienteId)        e.clienteId = 'Selecciona un cliente'
    if (!form.fechaInicio)      e.fechaInicio = 'La fecha de inicio es requerida'
    if (!form.fechaFin)         e.fechaFin  = 'La fecha de fin es requerida'
    if (Object.keys(e).length) { setErrores(e); return }
    setErrores({})
    setGuardando(true)
    await onGuardar(inicial ? form as ActualizarCitaDto : form as CrearCitaDto)
    setGuardando(false)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormSection title="Datos de la cita">
        <FormGrid>
          <FormField label="Título *" error={errores.titulo}>
            <Input value={form.titulo} onChange={set('titulo')} placeholder="Consulta inicial" />
          </FormField>
          <FormField label="Cliente *" error={errores.clienteId}>
            <Select value={form.clienteId} onChange={set('clienteId')} options={clienteOpciones} placeholder="Seleccionar cliente" />
          </FormField>
          <FormField label="Inicio *" error={errores.fechaInicio}>
            <Input value={form.fechaInicio} onChange={set('fechaInicio')} type="datetime-local" />
          </FormField>
          <FormField label="Fin *" error={errores.fechaFin}>
            <Input value={form.fechaFin} onChange={set('fechaFin')} type="datetime-local" />
          </FormField>
          {inicial && (
            <FormField label="Estado">
              <Select value={form.estado} onChange={set('estado')} options={estadoOpciones} />
            </FormField>
          )}
        </FormGrid>
      </FormSection>

      <FormSection title="Detalles">
        <FormField label="Descripción">
          <Textarea value={form.descripcion} onChange={set('descripcion')} placeholder="Motivo de la cita..." rows={2} />
        </FormField>
        <FormField label="Notas internas">
          <Textarea value={form.notas} onChange={set('notas')} placeholder="Notas del profesional..." rows={2} />
        </FormField>
      </FormSection>

      <FormActions onCancel={onCancelar} submitText={inicial ? 'Guardar cambios' : 'Crear cita'} loading={guardando} />
    </Form>
  )
}
