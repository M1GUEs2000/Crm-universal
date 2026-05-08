import type { IProductoService } from '../interfaces/IProductoService'
import type { Producto, CrearProductoDto, ActualizarProductoDto } from '@/types'
import { productosMock } from './datos'

const db: Producto[] = [...productosMock]
let nextId = db.length + 1

const ok = <T>(datos: T) => ({ ok: true, datos })
const error = (mensaje: string) => ({ ok: false, datos: undefined as never, mensaje })

export class MockProductoService implements IProductoService {
  async listar(pagina = 1, porPagina = 20) {
    const inicio = (pagina - 1) * porPagina
    return { ok: true, datos: db.slice(inicio, inicio + porPagina), paginacion: { pagina, porPagina, total: db.length } }
  }

  async obtener(id: string) {
    const item = db.find(p => p.id === id)
    return item ? ok(item) : error('Producto no encontrado')
  }

  async crear(dto: CrearProductoDto) {
    const nuevo: Producto = { ...dto, id: String(nextId++), activo: true }
    db.push(nuevo)
    return ok(nuevo)
  }

  async actualizar(id: string, dto: ActualizarProductoDto) {
    const idx = db.findIndex(p => p.id === id)
    if (idx === -1) return error('Producto no encontrado')
    db[idx] = { ...db[idx], ...dto }
    return ok(db[idx])
  }

  async eliminar(id: string) {
    const idx = db.findIndex(p => p.id === id)
    if (idx === -1) return error('Producto no encontrado')
    db.splice(idx, 1)
    return ok(undefined as void)
  }
}
