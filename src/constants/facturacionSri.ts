import type {
  AmbienteFacturacion,
  CodigoImpuestoRetencionSri,
  CodigoIvaSri,
  CodigoRetencionSri,
  TipoComprobanteSri,
  TipoIdentificacionSri,
} from '@/types'

export const ambienteFacturacionOptions: Array<{ value: AmbienteFacturacion; label: string; apiValue: 1 | 2 }> = [
  { value: 'pruebas', label: 'Pruebas', apiValue: 1 },
  { value: 'produccion', label: 'Produccion', apiValue: 2 },
]

export const tipoComprobanteSriOptions: Array<{ value: TipoComprobanteSri; label: string }> = [
  { value: '01', label: 'Factura' },
  { value: '04', label: 'Nota credito' },
  { value: '07', label: 'Retencion' },
]

export const tipoIdentificacionOptions: Array<{ value: TipoIdentificacionSri; label: string }> = [
  { value: '04', label: 'RUC' },
  { value: '05', label: 'Cedula' },
  { value: '06', label: 'Pasaporte' },
  { value: '07', label: 'Consumidor final' },
  { value: '08', label: 'Identificacion exterior' },
  { value: '09', label: 'Placa' },
]

export const tipoIdentificacionRetencionOptions = tipoIdentificacionOptions.filter(option =>
  ['04', '05', '06'].includes(option.value),
)

export const ivaSriOptions: Array<{ value: CodigoIvaSri; label: string; tarifa: number }> = [
  { value: 0, label: 'IVA 0%', tarifa: 0 },
  { value: 2, label: 'IVA 12%', tarifa: 12 },
  { value: 3, label: 'IVA 14%', tarifa: 14 },
  { value: 4, label: 'IVA 15%', tarifa: 15 },
  { value: 5, label: 'IVA 5%', tarifa: 5 },
  { value: 6, label: 'No objeto', tarifa: 0 },
  { value: 7, label: 'Exento', tarifa: 0 },
  { value: 8, label: 'IVA diferenciado 8%', tarifa: 8 },
  { value: 10, label: 'IVA 13%', tarifa: 13 },
]

export const tipoImpuestoRetencionOptions: Array<{ value: CodigoImpuestoRetencionSri; label: string }> = [
  { value: '1', label: 'Renta' },
  { value: '2', label: 'IVA' },
]

export const retencionesSriOptions: CodigoRetencionSri[] = [
  { tipoImpuesto: '1', codigo: '303', descripcion: 'Honorarios profesionales', porcentaje: 10 },
  { tipoImpuesto: '1', codigo: '303A', descripcion: 'Servicios profesionales sociedades', porcentaje: 3 },
  { tipoImpuesto: '1', codigo: '304', descripcion: 'Servicios intelectuales no relacionados', porcentaje: 10 },
  { tipoImpuesto: '1', codigo: '304A', descripcion: 'Comisiones servicios intelectuales', porcentaje: 10 },
  { tipoImpuesto: '1', codigo: '304B', descripcion: 'Notarios y registradores', porcentaje: 10 },
  { tipoImpuesto: '1', codigo: '304C', descripcion: 'Deportistas, arbitros, entrenadores', porcentaje: 8 },
  { tipoImpuesto: '1', codigo: '304D', descripcion: 'Artistas', porcentaje: 8 },
  { tipoImpuesto: '1', codigo: '304E', descripcion: 'Servicios de docencia', porcentaje: 10 },
  { tipoImpuesto: '1', codigo: '307', descripcion: 'Servicios mano de obra', porcentaje: 2 },
  { tipoImpuesto: '1', codigo: '308', descripcion: 'Uso de imagen o renombre', porcentaje: 10 },
  { tipoImpuesto: '1', codigo: '309', descripcion: 'Publicidad y medios', porcentaje: 2.75 },
  { tipoImpuesto: '1', codigo: '310', descripcion: 'Transporte pasajeros o carga', porcentaje: 1 },
  { tipoImpuesto: '1', codigo: '311', descripcion: 'Liquidacion de compra', porcentaje: 2 },
  { tipoImpuesto: '1', codigo: '312', descripcion: 'Transferencia bienes muebles', porcentaje: 1.75 },
  { tipoImpuesto: '1', codigo: '312A', descripcion: 'Compras productor', porcentaje: 1 },
  { tipoImpuesto: '1', codigo: '312C', descripcion: 'Compras comercializador', porcentaje: 1.75 },
  { tipoImpuesto: '1', codigo: '314A', descripcion: 'Regalias franquicias PN', porcentaje: 10 },
  { tipoImpuesto: '1', codigo: '314B', descripcion: 'Derechos autor PN', porcentaje: 10 },
  { tipoImpuesto: '1', codigo: '314C', descripcion: 'Regalias franquicias sociedades', porcentaje: 10 },
  { tipoImpuesto: '1', codigo: '314D', descripcion: 'Derechos autor sociedades', porcentaje: 10 },
  { tipoImpuesto: '1', codigo: '319', descripcion: 'Arrendamiento mercantil', porcentaje: 2 },
  { tipoImpuesto: '1', codigo: '320', descripcion: 'Arrendamiento bienes inmuebles', porcentaje: 10 },
  { tipoImpuesto: '1', codigo: '322', descripcion: 'Seguros y reaseguros', porcentaje: 1 },
  { tipoImpuesto: '1', codigo: '323', descripcion: 'Rendimientos financieros', porcentaje: 2 },
  { tipoImpuesto: '1', codigo: '323E', descripcion: 'Depositos plazo fijo gravados', porcentaje: 2 },
  { tipoImpuesto: '1', codigo: '323E2', descripcion: 'Depositos plazo fijo exentos', porcentaje: 0 },
  { tipoImpuesto: '1', codigo: '325', descripcion: 'Anticipo dividendos', porcentaje: 25 },
  { tipoImpuesto: '1', codigo: '325A', descripcion: 'Prestamos accionistas', porcentaje: 25 },
  { tipoImpuesto: '1', codigo: '332', descripcion: 'No sujeto a retencion', porcentaje: 0 },
  { tipoImpuesto: '1', codigo: '343', descripcion: 'Otras retenciones 1%', porcentaje: 1 },
  { tipoImpuesto: '1', codigo: '343A', descripcion: 'Energia electrica', porcentaje: 1 },
  { tipoImpuesto: '1', codigo: '343B', descripcion: 'Construccion', porcentaje: 1.75 },
  { tipoImpuesto: '1', codigo: '343C', descripcion: 'Botellas PET', porcentaje: 2 },
  { tipoImpuesto: '1', codigo: '3440', descripcion: 'Otras retenciones 2.75%', porcentaje: 2.75 },
  { tipoImpuesto: '1', codigo: '3480', descripcion: 'Pronosticos deportivos', porcentaje: 15 },
  { tipoImpuesto: '1', codigo: '3482', descripcion: 'Comisiones sociedades', porcentaje: 3 },
  { tipoImpuesto: '2', codigo: '9', descripcion: 'Retencion IVA 10%', porcentaje: 10 },
  { tipoImpuesto: '2', codigo: '10', descripcion: 'Retencion IVA 20%', porcentaje: 20 },
  { tipoImpuesto: '2', codigo: '1', descripcion: 'Retencion IVA 30%', porcentaje: 30 },
  { tipoImpuesto: '2', codigo: '11', descripcion: 'Retencion IVA 50%', porcentaje: 50 },
  { tipoImpuesto: '2', codigo: '2', descripcion: 'Retencion IVA 70%', porcentaje: 70 },
  { tipoImpuesto: '2', codigo: '3', descripcion: 'Retencion IVA 100%', porcentaje: 100 },
  { tipoImpuesto: '2', codigo: '7', descripcion: 'Retencion IVA 0%', porcentaje: 0 },
  { tipoImpuesto: '2', codigo: '8', descripcion: 'No procede retencion', porcentaje: 0 },
]

export function tarifaIvaDesdeCodigo(codigo: CodigoIvaSri) {
  return ivaSriOptions.find(option => option.value === codigo)?.tarifa ?? 0
}

export function ambienteApiValue(ambiente: AmbienteFacturacion) {
  return ambienteFacturacionOptions.find(option => option.value === ambiente)?.apiValue ?? 1
}
