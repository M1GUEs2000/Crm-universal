import type { IEstadisticaService } from '../interfaces/IEstadisticaService'
import { clientesMock, citasMock, productosMock, tareasMock } from './datos'

const ok = <T>(datos: T) => ({ ok: true, datos })

export class MockEstadisticaService implements IEstadisticaService {
  async resumenDashboard() {
    return ok({
      clientesNuevos:    { label: 'Clientes nuevos',    valor: clientesMock.filter(c => c.estado === 'activo').length, variacion: 2 },
      citasHoy:          { label: 'Citas hoy',          valor: citasMock.filter(c => c.estado !== 'cancelada').length },
      productosActivos:  { label: 'Productos activos',  valor: productosMock.filter(p => p.activo).length },
      tareasPendientes:  { label: 'Tareas pendientes',  valor: tareasMock.filter(t => t.estado === 'pendiente').length },
    })
  }

  async clientesPorMes() {
    return ok([
      { etiqueta: 'Ene', valor: 3 },
      { etiqueta: 'Feb', valor: 5 },
      { etiqueta: 'Mar', valor: 4 },
      { etiqueta: 'Abr', valor: 7 },
      { etiqueta: 'May', valor: 5 },
    ])
  }

  async citasPorEstado() {
    const estados = ['pendiente', 'confirmada', 'cancelada', 'completada'] as const
    return ok(estados.map(e => ({
      etiqueta: e,
      valor: citasMock.filter(c => c.estado === e).length,
    })))
  }

  async productosMasVendidos() {
    return ok(productosMock.map(p => ({ etiqueta: p.nombre, valor: Math.floor(Math.random() * 20) + 1 })))
  }
}
