import type { AmbienteFacturacion, CodigoIvaSri } from '@/types'

export const tipoComprobante = '01' as const

export const formaPagoOptions = [
  { value: '01', label: 'Sin utilizacion del sistema financiero' },
  { value: '15', label: 'Compensacion de deudas' },
  { value: '16', label: 'Tarjeta de debito' },
  { value: '17', label: 'Dinero electronico' },
  { value: '18', label: 'Tarjeta prepago' },
  { value: '19', label: 'Tarjeta de credito' },
  { value: '20', label: 'Otros con utilizacion del sistema financiero' },
  { value: '21', label: 'Endoso de titulos' },
]

export interface FacturaFormState {
  empresaRuc: string
  ambiente: AmbienteFacturacion
  estab: string
  ptoEmi: string
  secuencial: string
  fechaEmision: string
  tipoIdentificacionComprador: string
  identificacionComprador: string
  razonSocialComprador: string
  direccionComprador: string
  formaPago: string
  codigoPrincipal: string
  descripcion: string
  cantidad: number
  precioUnitario: number
  descuento: number
  ivaCodigo: CodigoIvaSri
}

export function defaultFormState(): FacturaFormState {
  return {
    empresaRuc: '',
    ambiente: 'pruebas',
    estab: '',
    ptoEmi: '',
    secuencial: '',
    fechaEmision: new Date().toISOString().slice(0, 10),
    tipoIdentificacionComprador: '07',
    identificacionComprador: '9999999999999',
    razonSocialComprador: 'CONSUMIDOR FINAL',
    direccionComprador: '',
    formaPago: '01',
    codigoPrincipal: 'SERV-001',
    descripcion: 'Servicio de prueba',
    cantidad: 1,
    precioUnitario: 100,
    descuento: 0,
    ivaCodigo: 4,
  }
}
