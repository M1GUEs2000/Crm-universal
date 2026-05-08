import type { Cliente, Cita, Producto, Tarea } from '@/types'

export const clientesMock: Cliente[] = [
  { id: '1', nombre: 'María', apellido: 'González', email: 'maria@email.com', telefono: '0991234567', empresa: 'Empresa A', estado: 'activo', fechaCreacion: '2026-01-10' },
  { id: '2', nombre: 'Carlos', apellido: 'Pérez', email: 'carlos@email.com', telefono: '0987654321', estado: 'activo', fechaCreacion: '2026-02-15' },
  { id: '3', nombre: 'Ana', apellido: 'Rodríguez', email: 'ana@email.com', empresa: 'Empresa B', estado: 'activo', fechaCreacion: '2026-03-01' },
  { id: '4', nombre: 'Luis', apellido: 'Martínez', telefono: '0976543210', estado: 'inactivo', fechaCreacion: '2026-03-20' },
  { id: '5', nombre: 'Sofia', apellido: 'Torres', email: 'sofia@email.com', estado: 'activo', fechaCreacion: '2026-04-05' },
]

export const citasMock: Cita[] = [
  { id: '1', clienteId: '1', titulo: 'Consulta inicial', fechaInicio: '2026-05-08T09:00:00', fechaFin: '2026-05-08T09:30:00', estado: 'confirmada' },
  { id: '2', clienteId: '2', titulo: 'Seguimiento', fechaInicio: '2026-05-08T10:00:00', fechaFin: '2026-05-08T10:30:00', estado: 'pendiente' },
  { id: '3', clienteId: '3', titulo: 'Revisión', fechaInicio: '2026-05-09T11:00:00', fechaFin: '2026-05-09T11:45:00', estado: 'pendiente' },
  { id: '4', clienteId: '1', titulo: 'Control mensual', fechaInicio: '2026-05-12T14:00:00', fechaFin: '2026-05-12T14:30:00', estado: 'confirmada' },
  { id: '5', clienteId: '4', titulo: 'Primera visita', fechaInicio: '2026-05-06T09:00:00', fechaFin: '2026-05-06T09:30:00', estado: 'cancelada' },
]

export const productosMock: Producto[] = [
  { id: '1', nombre: 'Consulta general', descripcion: 'Consulta estándar de 30 minutos', precio: 50, tipo: 'servicio', activo: true },
  { id: '2', nombre: 'Consulta especializada', descripcion: 'Consulta de 1 hora con especialista', precio: 90, tipo: 'servicio', activo: true },
  { id: '3', nombre: 'Pack seguimiento x5', descripcion: '5 sesiones de seguimiento', precio: 200, tipo: 'servicio', activo: true },
  { id: '4', nombre: 'Kit básico', descripcion: 'Producto de muestra', precio: 25, tipo: 'producto', activo: true },
]

export const tareasMock: Tarea[] = [
  { id: '1', titulo: 'Llamar a María para confirmar cita', clienteId: '1', estado: 'pendiente', prioridad: 'alta', fechaVencimiento: '2026-05-08' },
  { id: '2', titulo: 'Enviar informe a Carlos', clienteId: '2', estado: 'en_progreso', prioridad: 'media', fechaVencimiento: '2026-05-10' },
  { id: '3', titulo: 'Actualizar historial de Ana', clienteId: '3', estado: 'pendiente', prioridad: 'baja' },
  { id: '4', titulo: 'Revisar pagos pendientes', estado: 'pendiente', prioridad: 'alta', fechaVencimiento: '2026-05-09' },
]
