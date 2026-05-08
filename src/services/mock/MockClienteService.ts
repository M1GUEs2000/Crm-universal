import type { IClienteService } from '../interfaces/IClienteService'
import type { Cliente, CrearClienteDto, ActualizarClienteDto } from '@/types'
import { clientesMock } from './datos'

const db: Cliente[] = [...clientesMock]
let nextId = db.length + 1

const ok = <T>(datos: T) => ({ ok: true, datos })
const error = (mensaje: string) => ({ ok: false, datos: undefined as never, mensaje })

export class MockClienteService implements IClienteService {
  async listar(pagina = 1, porPagina = 20) {
    const inicio = (pagina - 1) * porPagina
    return { ok: true, datos: db.slice(inicio, inicio + porPagina), paginacion: { pagina, porPagina, total: db.length } }
  }

  async obtener(id: string) {
    const item = db.find(c => c.id === id)
    return item ? ok(item) : error('Cliente no encontrado')
  }

  async crear(dto: CrearClienteDto) {
    const nuevo: Cliente = { ...dto, id: String(nextId++), estado: 'activo', fechaCreacion: new Date().toISOString().slice(0, 10) }
    db.push(nuevo)
    return ok(nuevo)
  }

  async actualizar(id: string, dto: ActualizarClienteDto) {
    const idx = db.findIndex(c => c.id === id)
    if (idx === -1) return error('Cliente no encontrado')
    db[idx] = { ...db[idx], ...dto }
    return ok(db[idx])
  }

  async eliminar(id: string) {
    const idx = db.findIndex(c => c.id === id)
    if (idx === -1) return error('Cliente no encontrado')
    db.splice(idx, 1)
    return ok(undefined as void)
  }
}
