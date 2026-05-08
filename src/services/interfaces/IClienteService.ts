import type { Cliente, CrearClienteDto, ActualizarClienteDto } from '@/types'
import type { RespuestaApi, RespuestaPaginada } from '@/types'

export interface IClienteService {
  listar(pagina?: number, porPagina?: number): Promise<RespuestaPaginada<Cliente>>
  obtener(id: string): Promise<RespuestaApi<Cliente>>
  crear(dto: CrearClienteDto): Promise<RespuestaApi<Cliente>>
  actualizar(id: string, dto: ActualizarClienteDto): Promise<RespuestaApi<Cliente>>
  eliminar(id: string): Promise<RespuestaApi<void>>
}
