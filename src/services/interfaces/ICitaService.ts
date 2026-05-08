import type { Cita, CrearCitaDto, ActualizarCitaDto } from '@/types'
import type { RespuestaApi, RespuestaPaginada } from '@/types'

export interface ICitaService {
  listar(pagina?: number, porPagina?: number): Promise<RespuestaPaginada<Cita>>
  listarPorCliente(clienteId: string): Promise<RespuestaApi<Cita[]>>
  obtener(id: string): Promise<RespuestaApi<Cita>>
  crear(dto: CrearCitaDto): Promise<RespuestaApi<Cita>>
  actualizar(id: string, dto: ActualizarCitaDto): Promise<RespuestaApi<Cita>>
  eliminar(id: string): Promise<RespuestaApi<void>>
}
