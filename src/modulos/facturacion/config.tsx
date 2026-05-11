import type { DocumentoFacturacion, EstadoSriDocumento, TipoDocumentoFacturacion } from '@/types'

export const facturacionTabs = [
  { key: 'facturas', label: 'Facturas' },
  { key: 'notas-credito', label: 'Notas de credito' },
  { key: 'retenciones', label: 'Retenciones' },
]

export const tipoDocumentoLabel: Record<TipoDocumentoFacturacion, string> = {
  factura: 'Factura',
  nota_credito: 'Nota de credito',
  retencion: 'Retencion',
}

export const estadoSriVariant: Record<EstadoSriDocumento, 'success' | 'warning' | 'danger' | 'info'> = {
  pendiente: 'warning',
  recibida: 'info',
  autorizada: 'success',
  rechazada: 'danger',
}

export function formatoMoneda(valor: number) {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
  }).format(valor)
}

export function filtrarDocumentos(documentos: DocumentoFacturacion[], tipo: TipoDocumentoFacturacion) {
  return documentos.filter(documento => documento.tipo === tipo)
}
