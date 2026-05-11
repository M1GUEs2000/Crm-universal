import { useEffect, useRef, useState } from 'react'
import { Temporal } from 'temporal-polyfill'
import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createViewMonthGrid, createViewWeek, createViewDay } from '@schedule-x/calendar'
import type { CalendarEventExternal } from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/calendar.css'
import { citaService } from '@/services'
import type { Cita } from '@/types'
import { PageHeader, Modal, ConfirmDialog } from '@/components/ui'
import CitaForm from '@/modulos/citas/CitaForm'

// "2026-05-08T09:00:00" → "2026-05-08 09:00"
function toZonedDateTime(iso: string) {
  return Temporal.ZonedDateTime.from(`${iso}[America/Bogota]`)
}

function mapToSxEvent(c: Cita): CalendarEventExternal {
  return {
    id:         c.id,
    title:      c.titulo,
    start:      toZonedDateTime(c.fechaInicio),
    end:        toZonedDateTime(c.fechaFin),
    calendarId: c.estado,
  }
}

export default function CalendarioPage() {
  const [citas, setCitas]           = useState<Cita[]>([])
  const [editando, setEditando]     = useState<Cita | null>(null)
  const [eliminando, setEliminando] = useState<Cita | null>(null)
  const [modalCrear, setModalCrear] = useState(false)
  const [fechaInicio, setFechaInicio] = useState('')
  const [procesando, setProcesando] = useState(false)

  // refs para evitar closures obsoletos en los callbacks del calendario
  const citasRef    = useRef<Cita[]>([])
  const setEditRef  = useRef(setEditando)
  const setCrearRef = useRef((fecha: string) => { setFechaInicio(fecha); setModalCrear(true) })

  useEffect(() => {
    citasRef.current = citas
  }, [citas])

  const hoy    = new Date().toISOString().slice(0, 10)
  const hoyTemporal = Temporal.PlainDate.from(hoy)

  const calendar = useNextCalendarApp({
    views:        [createViewMonthGrid(), createViewWeek(), createViewDay()],
    events:       [],
    selectedDate: hoyTemporal,
    locale:       'es-ES',
    firstDayOfWeek: 1,
    calendars: {
      pendiente:  { colorName: 'pendiente',  lightColors: { main: '#f59e0b', container: '#fef3c7', onContainer: '#78350f' } },
      confirmada: { colorName: 'confirmada', lightColors: { main: '#10b981', container: '#d1fae5', onContainer: '#065f46' } },
      cancelada:  { colorName: 'cancelada',  lightColors: { main: '#ef4444', container: '#fee2e2', onContainer: '#7f1d1d' } },
      completada: { colorName: 'completada', lightColors: { main: '#3b82f6', container: '#dbeafe', onContainer: '#1e3a5f' } },
    },
    callbacks: {
      onEventClick: (event) => {
        const cita = citasRef.current.find(c => c.id === String(event.id))
        if (cita) setEditRef.current(cita)
      },
      onClickDate: (date) => {
        setCrearRef.current(`${date.toString()}T09:00`)
      },
    },
  })

  async function cargar() {
    const r = await citaService.listar(1, 500)
    if (r.ok) setCitas(r.datos)
  }

  useEffect(() => { cargar() }, [])

  useEffect(() => {
    if (!calendar) return
    calendar.events.set(citas.map(mapToSxEvent))
  }, [citas, calendar])

  async function handleCrear(dto: Parameters<typeof citaService.crear>[0]) {
    setProcesando(true)
    const r = await citaService.crear(dto)
    if (r.ok) { setModalCrear(false); await cargar() }
    setProcesando(false)
  }

  async function handleEditar(dto: Parameters<typeof citaService.actualizar>[1]) {
    if (!editando) return
    setProcesando(true)
    const r = await citaService.actualizar(editando.id, dto)
    if (r.ok) { setEditando(null); await cargar() }
    setProcesando(false)
  }

  async function handleEliminar() {
    if (!eliminando) return
    setProcesando(true)
    await citaService.eliminar(eliminando.id)
    setEliminando(null)
    await cargar()
    setProcesando(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Calendario"
        action={
          <button
            type="button"
            onClick={() => { setFechaInicio(`${hoy}T09:00`); setModalCrear(true) }}
            className="bg-primary text-primary-foreground rounded-button px-4 py-2 text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          >
            + Nueva cita
          </button>
        }
      />

      <div className="bg-surface rounded-card shadow-card overflow-hidden min-h-[720px] [&_.sx-react-calendar-wrapper]:h-[720px]">
        <ScheduleXCalendar calendarApp={calendar} />
      </div>

      <Modal open={modalCrear} onClose={() => setModalCrear(false)} title="Nueva cita" width="lg">
        <CitaForm
          fechaDefecto={fechaInicio}
          onGuardar={dto => handleCrear(dto as Parameters<typeof citaService.crear>[0])}
          onCancelar={() => setModalCrear(false)}
        />
      </Modal>

      <Modal open={!!editando} onClose={() => setEditando(null)} title="Editar cita" width="lg">
        {editando && (
          <CitaForm
            inicial={editando}
            onGuardar={handleEditar}
            onCancelar={() => setEditando(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!eliminando}
        onClose={() => setEliminando(null)}
        onConfirm={handleEliminar}
        title="Eliminar cita"
        message={`¿Seguro que quieres eliminar "${eliminando?.titulo}"?`}
        loading={procesando}
      />
    </div>
  )
}
