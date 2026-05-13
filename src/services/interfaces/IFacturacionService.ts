import type { DocumentoFacturacion, EmitirFacturaDto, EmitirNotaCreditoDto, EmitirRetencionDto, EmpresaFacturacion, GuardarEmpresaFacturacionDto, ParametrosFacturacionModulo, ParametrosFacturacionSri, RespuestaApi, SecuencialSriFacturacion } from '@/types'

export interface IFacturacionService {
  listar(): Promise<RespuestaApi<DocumentoFacturacion[]>>
  listarEmpresas(): Promise<RespuestaApi<EmpresaFacturacion[]>>
  obtenerEmpresa(): Promise<RespuestaApi<EmpresaFacturacion>>
  guardarEmpresa(dto: GuardarEmpresaFacturacionDto): Promise<RespuestaApi<EmpresaFacturacion>>
  obtenerParametros(): Promise<RespuestaApi<ParametrosFacturacionModulo>>
  obtenerParametrosPorRuc(ruc: string): Promise<RespuestaApi<ParametrosFacturacionModulo>>
  guardarSecuencialSri(dto: SecuencialSriFacturacion): Promise<RespuestaApi<SecuencialSriFacturacion>>
  guardarParametrosFacturacion(dto: ParametrosFacturacionSri): Promise<RespuestaApi<ParametrosFacturacionSri>>
  previewFactura(dto: EmitirFacturaDto): Promise<RespuestaApi<Blob>>
  emitirFactura(dto: EmitirFacturaDto): Promise<RespuestaApi<DocumentoFacturacion>>
  emitirNotaCredito(dto: EmitirNotaCreditoDto): Promise<RespuestaApi<DocumentoFacturacion>>
  emitirRetencion(dto: EmitirRetencionDto): Promise<RespuestaApi<DocumentoFacturacion>>
}
