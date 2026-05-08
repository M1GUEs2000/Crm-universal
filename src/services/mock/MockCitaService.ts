import type { ICitaService } from '../interfaces/ICitaService'
import type { Cita, CrearCitaDto, ActualizarCitaDto } from '@/types'
import { citasMock } from './datos'

const db: Cita[] = [...citasMock]
let nextId = db.length + 1

const ok = <T>(datos: T) => ({ ok: true, datos })
const error = (mensaje: string) => ({ ok: false, datos: undefined as never, mensaje })

export class MockCitaService implements ICitaService {
  async listar(pagina = 1, porPagina = 20) {
    const inicio = (pagina - 1) * porPagina
    return { ok: true, datos: db.slice(inicio, inicio + porPagina), paginacion: { pagina, porPagina, total: db.length } }
  }

  async listarPorCliente(clienteId: string) {
    return ok(db.filter(c => c.clienteId === clienteId))
  }

  async obtener(id: string) {
    const item = db.find(c => c.id === id)
    return item ? ok(item) : error('Cita no encontrada')
  }

  async crear(dto: CrearCitaDto) {
    const nueva: Cita = { ...dto, id: String(nextId++), estado: 'pendiente' }
    db.push(nueva)
    return ok(nueva)
  }

  async actualizar(id: string, dto: ActualizarCitaDto) {
    const idx = db.findIndex(c => c.id === id)
    if (idx === -1) return error('Cita no encontrada')
    db[idx] = { ...db[idx], ...dto }
    return ok(db[idx])
  }

  async eliminar(id: string) {
    const idx = db.findIndex(c => c.id === id)
    if (idx === -1) return error('Cita no encontrada')
    db.splice(idx, 1)
    return ok(undefined as void)
  }
}
