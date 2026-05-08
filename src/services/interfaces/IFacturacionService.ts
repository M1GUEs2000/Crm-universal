import type { DocumentoFacturacion, EmitirFacturaDto, EmitirNotaCreditoDto, EmitirRetencionDto, RespuestaApi } from '@/types'

export interface IFacturacionService {
  listar(): Promise<RespuestaApi<DocumentoFacturacion[]>>
  emitirFactura(dto: EmitirFacturaDto): Promise<RespuestaApi<DocumentoFacturacion>>
  emitirNotaCredito(dto: EmitirNotaCreditoDto): Promise<RespuestaApi<DocumentoFacturacion>>
  emitirRetencion(dto: EmitirRetencionDto): Promise<RespuestaApi<DocumentoFacturacion>>
}
