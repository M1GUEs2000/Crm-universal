import type { ID } from './comun'

export type TipoDocumentoFacturacion = 'factura' | 'nota_credito' | 'retencion'
export type AmbienteFacturacion = 'pruebas' | 'produccion'
export type EstadoSriDocumento = 'pendiente' | 'recibida' | 'autorizada' | 'rechazada'

export interface DocumentoFacturacion {
  id: ID
  tipo: TipoDocumentoFacturacion
  numero: string
  fechaEmision: string
  razonSocial: string
  identificacion: string
  total: number
  estadoSri: EstadoSriDocumento
  claveAcceso?: string
  numeroAutorizacion?: string
}

export interface DetalleDocumentoRequest {
  codigoPrincipal: string
  descripcion: string
  cantidad: number
  precioUnitario: number
  descuento: number
  ivaTarifa: number
}

export interface EmitirFacturaDto {
  empresaRuc: string
  ambiente: AmbienteFacturacion
  estab: string
  ptoEmi: string
  secuencial: string
  fechaEmision: string
  tipoIdentificacionComprador: string
  identificacionComprador: string
  razonSocialComprador: string
  direccionComprador?: string
  formaPago: string
  totalSinImpuestos: number
  totalDescuento: number
  valorIva: number
  importeTotal: number
  detalle: DetalleDocumentoRequest
}

export interface EmitirNotaCreditoDto extends Omit<EmitirFacturaDto, 'formaPago' | 'importeTotal'> {
  docModificadoTipo: string
  docModificadoNumero: string
  docModificadoFecha: string
  docModificadoClaveAcceso: string
  motivo: string
  valorModificacion: number
}

export interface EmitirRetencionDto {
  empresaRuc: string
  ambiente: AmbienteFacturacion
  estab: string
  ptoEmi: string
  secuencial: string
  fechaEmision: string
  tipoIdentificacionSujeto: string
  identificacionSujeto: string
  razonSocialSujeto: string
  direccionSujeto?: string
  periodoFiscal: string
  codigoImpuesto: string
  codigoRetencion: string
  codDocSustento: string
  numDocSustento: string
  fechaEmisionDocSustento: string
  totalBaseImponible: number
  totalRetencionRenta: number
  totalRetencionIva: number
  totalRetenido: number
}
