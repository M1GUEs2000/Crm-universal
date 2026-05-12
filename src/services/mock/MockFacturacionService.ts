import type { IFacturacionService } from '../interfaces/IFacturacionService'
import type { DocumentoFacturacion, EmitirFacturaDto, EmitirNotaCreditoDto, EmitirRetencionDto, EmpresaFacturacion, GuardarEmpresaFacturacionDto, ParametrosFacturacionModulo, ParametrosFacturacionSri, SecuencialSriFacturacion, TipoDocumentoFacturacion } from '@/types'
import { getSelectedCompany } from '@/config/companyPreferences'

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
const empresaStorageKey = 'crm-universal:facturacion:empresa'
const parametrosStorageKey = 'crm-universal:facturacion:parametros'

const ok = <T>(datos: T) => ({ ok: true, datos })

function empresaInicial(): EmpresaFacturacion {
  const company = getSelectedCompany()

  return {
    ruc: company.ruc,
    nombre: company.nombre,
    nombreComercial: '',
    dirMatriz: '',
    cuenta: { id: 'mock-cuenta', plan: 'starter', maxEmpresas: 2, maxUsuarios: 5, fechaExpira: null },
    certificadoConfigurado: false,
  }
}

function puedeUsarStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function leerEmpresa(): EmpresaFacturacion {
  if (!puedeUsarStorage()) return empresaInicial()

  const guardada = window.localStorage.getItem(empresaStorageKey)
  if (!guardada) return empresaInicial()

  return JSON.parse(guardada) as EmpresaFacturacion
}

function guardarEmpresaStorage(empresa: EmpresaFacturacion) {
  if (!puedeUsarStorage()) return

  window.localStorage.setItem(empresaStorageKey, JSON.stringify(empresa))
}

function parametrosIniciales(empresa: EmpresaFacturacion): ParametrosFacturacionModulo {
  const company = getSelectedCompany()

  return {
    sri: [
      { empresaRuc: empresa.ruc, tipoComprobante: '01', secuencial: 1, codigoNumerico: '00000000' },
      { empresaRuc: empresa.ruc, tipoComprobante: '04', secuencial: 1, codigoNumerico: '00000000' },
      { empresaRuc: empresa.ruc, tipoComprobante: '07', secuencial: 1, codigoNumerico: '00000000' },
    ],
    facturacion: {
      empresaRuc: empresa.ruc,
      ambiente: 'pruebas',
      tipoEmision: '1',
      agenteRetencion: false,
      contribuyenteRimpe: '',
      estab: company.estab,
      puntoEmision: company.ptoEmi,
      contribuyenteEspecial: '',
      obligadoContabilidad: false,
      moneda: 'USD',
      codigoImpuesto: '2',
      codigoPorcentaje: 4,
    },
  }
}

function leerParametros(): ParametrosFacturacionModulo {
  const empresa = leerEmpresa()
  if (!puedeUsarStorage()) return parametrosIniciales(empresa)

  const guardados = window.localStorage.getItem(parametrosStorageKey)
  if (!guardados) return parametrosIniciales(empresa)

  return JSON.parse(guardados) as ParametrosFacturacionModulo
}

function guardarParametrosStorage(parametros: ParametrosFacturacionModulo) {
  if (!puedeUsarStorage()) return
  window.localStorage.setItem(parametrosStorageKey, JSON.stringify(parametros))
}

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

  async listarEmpresas() {
    return ok([leerEmpresa()])
  }

  async obtenerEmpresa() {
    return ok(leerEmpresa())
  }

  async guardarEmpresa(dto: GuardarEmpresaFacturacionDto) {
    const actual = leerEmpresa()
    const empresa: EmpresaFacturacion = {
      ...actual,
      ...dto,
      logo: dto.logo ?? actual.logo,
      certificadoP12: dto.certificadoP12 ?? actual.certificadoP12,
      certificadoConfigurado: Boolean(dto.certificadoP12 ?? actual.certificadoP12),
      actualizadoEn: new Date().toISOString(),
    }

    guardarEmpresaStorage(empresa)
    return ok(empresa)
  }

  async obtenerParametros() {
    return ok(leerParametros())
  }

  async obtenerParametrosPorRuc(_ruc: string) {
    return this.obtenerParametros()
  }

  async guardarSecuencialSri(dto: SecuencialSriFacturacion) {
    const parametros = leerParametros()
    parametros.sri = parametros.sri.map(item =>
      item.tipoComprobante === dto.tipoComprobante
        ? { ...dto, fechaActualizacion: new Date().toISOString() }
        : item,
    )
    guardarParametrosStorage(parametros)
    return ok(dto)
  }

  async guardarParametrosFacturacion(dto: ParametrosFacturacionSri) {
    const parametros = leerParametros()
    parametros.facturacion = {
      ...dto,
      fechaActualizacion: new Date().toISOString(),
    }
    guardarParametrosStorage(parametros)
    return ok(parametros.facturacion)
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
