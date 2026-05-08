import type { Producto, CrearProductoDto, ActualizarProductoDto } from '@/types'
import type { RespuestaApi, RespuestaPaginada } from '@/types'

export interface IProductoService {
  listar(pagina?: number, porPagina?: number): Promise<RespuestaPaginada<Producto>>
  obtener(id: string): Promise<RespuestaApi<Producto>>
  crear(dto: CrearProductoDto): Promise<RespuestaApi<Producto>>
  actualizar(id: string, dto: ActualizarProductoDto): Promise<RespuestaApi<Producto>>
  eliminar(id: string): Promise<RespuestaApi<void>>
}
