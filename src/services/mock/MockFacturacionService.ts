import type { IFacturacionService } from '../interfaces/IFacturacionService'
import type { DocumentoFacturacion, EmitirFacturaDto, EmitirNotaCreditoDto, EmitirRetencionDto, TipoDocumentoFacturacion } from '@/types'

const documentos: DocumentoFacturacion[] = [
  {
    id: 'fac-1',
    tipo: 'factura',
    numero: '001-001-000000001',
    fechaEmision: '2026-05-08',
    razonSocial: 'Cliente Demo',
    identificacion: '9999999999',
    total: 112,
    estadoSri: 'autorizada',
    claveAcceso: '0805202601179999999900110010010000000011234567811',
    numeroAutorizacion: '0805202601179999999900110010010000000011234567811',
  },
  {
    id: 'ret-1',
    tipo: 'retencion',
    numero: '001-001-000000001',
    fechaEmision: '2026-05-08',
    razonSocial: 'Proveedor Demo',
    identificacion: '0999999999001',
    total: 12.5,
    estadoSri: 'recibida',
  },
]

let nextId = 2

const ok = <T>(datos: T) => ({ ok: true, datos })

function numero(estab: string, ptoEmi: string, secuencial: string) {
  return `${estab}-${ptoEmi}-${secuencial}`
}

function claveAccesoMock(tipo: TipoDocumentoFacturacion, secuencial: string) {
  const codigo = tipo === 'factura' ? '01' : tipo === 'nota_credito' ? '04' : '07'
  return `0805202601${codigo}1799999999001${secuencial.padStart(9, '0')}1234567811`.padEnd(49, '0').slice(0, 49)
}

function crearDocumento(input: {
  tipo: TipoDocumentoFacturacion
  numero: string
  fechaEmision: string
  razonSocial: string
  identificacion: string
  total: number
  secuencial: string
}): DocumentoFacturacion {
  const doc: DocumentoFacturacion = {
    id: `${input.tipo}-${nextId++}`,
    tipo: input.tipo,
    numero: input.numero,
    fechaEmision: input.fechaEmision,
    razonSocial: input.razonSocial,
    identificacion: input.identificacion,
    total: input.total,
    estadoSri: 'autorizada',
    claveAcceso: claveAccesoMock(input.tipo, input.secuencial),
    numeroAutorizacion: claveAccesoMock(input.tipo, input.secuencial),
  }
  documentos.unshift(doc)
  return doc
}

export class MockFacturacionService implements IFacturacionService {
  async listar() {
    return ok(documentos)
  }

  async emitirFactura(dto: EmitirFacturaDto) {
    return ok(crearDocumento({
      tipo: 'factura',
      numero: numero(dto.estab, dto.ptoEmi, dto.secuencial),
      fechaEmision: dto.fechaEmision,
      razonSocial: dto.razonSocialComprador,
      identificacion: dto.identificacionComprador,
      total: dto.importeTotal,
      secuencial: dto.secuencial,
    }))
  }

  async emitirNotaCredito(dto: EmitirNotaCreditoDto) {
    return ok(crearDocumento({
      tipo: 'nota_credito',
      numero: numero(dto.estab, dto.ptoEmi, dto.secuencial),
      fechaEmision: dto.fechaEmision,
      razonSocial: dto.razonSocialComprador,
      identificacion: dto.identificacionComprador,
      total: dto.valorModificacion,
      secuencial: dto.secuencial,
    }))
  }

  async emitirRetencion(dto: EmitirRetencionDto) {
    return ok(crearDocumento({
      tipo: 'retencion',
      numero: numero(dto.estab, dto.ptoEmi, dto.secuencial),
      fechaEmision: dto.fechaEmision,
      razonSocial: dto.razonSocialSujeto,
      identificacion: dto.identificacionSujeto,
      total: dto.totalRetenido,
      secuencial: dto.secuencial,
    }))
  }
}
