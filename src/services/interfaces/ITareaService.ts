import type { Tarea, CrearTareaDto, ActualizarTareaDto } from '@/types'
import type { RespuestaApi, RespuestaPaginada } from '@/types'

export interface ITareaService {
  listar(pagina?: number, porPagina?: number): Promise<RespuestaPaginada<Tarea>>
  listarPorCliente(clienteId: string): Promise<RespuestaApi<Tarea[]>>
  obtener(id: string): Promise<RespuestaApi<Tarea>>
  crear(dto: CrearTareaDto): Promise<RespuestaApi<Tarea>>
  actualizar(id: string, dto: ActualizarTareaDto): Promise<RespuestaApi<Tarea>>
  eliminar(id: string): Promise<RespuestaApi<void>>
}
