import type { ID } from './comun'

export type TipoDocumentoFacturacion = 'factura' | 'nota_credito' | 'retencion'
export type AmbienteFacturacion = 'pruebas' | 'produccion'
export type EstadoSriDocumento = 'pendiente' | 'recibida' | 'autorizada' | 'rechazada'
export type TipoIdentificacionSri = '04' | '05' | '06' | '07' | '08' | '09'
export type TipoIdentificacionRetencionSri = Extract<TipoIdentificacionSri, '04' | '05' | '06'>
export type CodigoIvaSri = 0 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10
export type CodigoImpuestoRetencionSri = '1' | '2'
export type TipoComprobanteSri = '01' | '04' | '07'

export interface CodigoRetencionSri {
  tipoImpuesto: CodigoImpuestoRetencionSri
  codigo: string
  descripcion: string
  porcentaje: number
}

export interface ArchivoEmpresaFacturacion {
  nombre: string
  tipo: string
  tamano: number
  actualizadoEn: string
}

export interface CuentaFacturacion {
  id: string
  plan: string
  maxEmpresas: number
  maxUsuarios: number
  fechaExpira: string | null
}

export interface EmpresaFacturacion {
  ruc: string
  nombre: string
  nombreComercial?: string
  dirMatriz: string
  cuenta: CuentaFacturacion | null
  logo?: ArchivoEmpresaFacturacion
  certificadoP12?: ArchivoEmpresaFacturacion
  certificadoConfigurado: boolean
  actualizadoEn?: string
}

export interface GuardarEmpresaFacturacionDto extends Omit<EmpresaFacturacion, 'cuenta' | 'logo' | 'certificadoP12' | 'certificadoConfigurado' | 'actualizadoEn'> {
  logo?: ArchivoEmpresaFacturacion
  logoArchivo?: File
  certificadoP12?: ArchivoEmpresaFacturacion
  certificadoP12Archivo?: File
  certPassword?: string
}

export interface SecuencialSriFacturacion {
  id?: string
  empresaRuc: string
  tipoComprobante: TipoComprobanteSri
  secuencial: number
  codigoNumerico: string
  fechaActualizacion?: string
}

export interface ParametrosFacturacionSri {
  empresaRuc: string
  ambiente: AmbienteFacturacion
  tipoEmision: '1'
  agenteRetencion: boolean
  contribuyenteRimpe?: string
  estab: string
  puntoEmision: string
  contribuyenteEspecial?: string
  obligadoContabilidad: boolean
  moneda: 'USD'
  codigoImpuesto: '2'
  codigoPorcentaje: CodigoIvaSri
  fechaActualizacion?: string
}

export interface ParametrosFacturacionModulo {
  sri: SecuencialSriFacturacion[]
  facturacion: ParametrosFacturacionSri
}

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
  ivaCodigo: CodigoIvaSri
  ivaTarifa: number
}

export interface EmitirFacturaDto {
  empresaRuc: string
  ambiente: AmbienteFacturacion
  estab: string
  ptoEmi: string
  secuencial: string
  fechaEmision: string
  tipoIdentificacionComprador: TipoIdentificacionSri
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
  tipoIdentificacionSujeto: TipoIdentificacionRetencionSri
  identificacionSujeto: string
  razonSocialSujeto: string
  direccionSujeto?: string
  periodoFiscal: string
  codigoImpuesto: CodigoImpuestoRetencionSri
  codigoRetencion: string
  codDocSustento: string
  numDocSustento: string
  fechaEmisionDocSustento: string
  totalBaseImponible: number
  totalRetencionRenta: number
  totalRetencionIva: number
  totalRetenido: number
}
