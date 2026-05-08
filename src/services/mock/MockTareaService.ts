import type { ITareaService } from '../interfaces/ITareaService'
import type { Tarea, CrearTareaDto, ActualizarTareaDto } from '@/types'
import { tareasMock } from './datos'

const db: Tarea[] = [...tareasMock]
let nextId = db.length + 1

const ok = <T>(datos: T) => ({ ok: true, datos })
const error = (mensaje: string) => ({ ok: false, datos: undefined as never, mensaje })

export class MockTareaService implements ITareaService {
  async listar(pagina = 1, porPagina = 20) {
    const inicio = (pagina - 1) * porPagina
    return { ok: true, datos: db.slice(inicio, inicio + porPagina), paginacion: { pagina, porPagina, total: db.length } }
  }

  async listarPorCliente(clienteId: string) {
    return ok(db.filter(t => t.clienteId === clienteId))
  }

  async obtener(id: string) {
    const item = db.find(t => t.id === id)
    return item ? ok(item) : error('Tarea no encontrada')
  }

  async crear(dto: CrearTareaDto) {
    const nueva: Tarea = { ...dto, id: String(nextId++), estado: 'pendiente' }
    db.push(nueva)
    return ok(nueva)
  }

  async actualizar(id: string, dto: ActualizarTareaDto) {
    const idx = db.findIndex(t => t.id === id)
    if (idx === -1) return error('Tarea no encontrada')
    db[idx] = { ...db[idx], ...dto }
    return ok(db[idx])
  }

  async eliminar(id: string) {
    const idx = db.findIndex(t => t.id === id)
    if (idx === -1) return error('Tarea no encontrada')
    db.splice(idx, 1)
    return ok(undefined as void)
  }
}
