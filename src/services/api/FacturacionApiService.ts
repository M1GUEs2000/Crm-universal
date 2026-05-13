import type { IFacturacionService } from '../interfaces/IFacturacionService'
import type { AmbienteFacturacion, CodigoIvaSri, DocumentoFacturacion, EmitirFacturaDto, EmitirNotaCreditoDto, EmitirRetencionDto, EstadoSriDocumento, EmpresaFacturacion, GuardarEmpresaFacturacionDto, ParametrosFacturacionModulo, ParametrosFacturacionSri, RespuestaApi, SecuencialSriFacturacion, TipoComprobanteSri } from '@/types'
import { getSelectedCompany } from '@/config/companyPreferences'
import { ambienteApiValue, tipoComprobanteSriOptions } from '@/constants/facturacionSri'
import logger from '@/lib/logger'

const apiBaseUrl = (import.meta.env.VITE_FACTURACION_API_URL ?? 'http://localhost:5170').replace(/\/$/, '')

interface CuentaResponse {
  id: string
  plan: string
  maxEmpresas: number
  maxUsuarios: number
  fechaExpira: string | null
}

interface EmpresaResponse {
  ruc: string
  nombre: string
  dirMatriz: string
  nombreComercial?: string | null
  tieneLogo: boolean
  logoContentType?: string | null
  cuenta?: CuentaResponse | null
  createdAt: string
  updatedAt: string
}

interface SecuencialSriResponse {
  id: string
  empresaRuc: string
  tipoComprobante: TipoComprobanteSri
  secuencial: number
  codigoNumerico: string
  fechaActualizacion: string
}

interface ParametrosFacturacionResponse {
  empresaRuc: string
  ambiente: 1 | 2 | 'Pruebas' | 'Produccion'
  tipoEmision: '1'
  agenteRetencion: boolean
  contribuyenteRimpe?: string | null
  estab: string
  puntoEmision: string
  contribuyenteEspecial?: string | null
  obligadoContabilidad: boolean
  moneda: 'USD'
  codigoImpuesto: '2'
  codigoPorcentaje: CodigoIvaSri
  fechaActualizacion: string
}

class ApiError extends Error {
  public readonly status: number

  constructor(
    message: string,
    status: number,
  ) {
    super(message)
    this.status = status
  }
}

function ok<T>(datos: T): RespuestaApi<T> {
  return { ok: true, datos }
}

function error<T>(mensaje: string, datos: T): RespuestaApi<T> {
  return { ok: false, datos, mensaje }
}

function empresaFallback(): EmpresaFacturacion {
  const company = getSelectedCompany()

  return {
    ruc: company.ruc,
    nombre: company.nombre,
    nombreComercial: '',
    dirMatriz: '',
    cuenta: null,
    certificadoConfigurado: false,
  }
}

function mapEmpresa(response: EmpresaResponse): EmpresaFacturacion {
  return {
    ruc: response.ruc,
    nombre: response.nombre,
    nombreComercial: response.nombreComercial ?? '',
    dirMatriz: response.dirMatriz,
    cuenta: response.cuenta
      ? { id: response.cuenta.id, plan: response.cuenta.plan, maxEmpresas: response.cuenta.maxEmpresas, maxUsuarios: response.cuenta.maxUsuarios, fechaExpira: response.cuenta.fechaExpira }
      : null,
    logo: response.tieneLogo
      ? {
        nombre: 'Logo guardado',
        tipo: response.logoContentType ?? 'image/*',
        tamano: 0,
        actualizadoEn: response.updatedAt ?? response.createdAt,
      }
      : undefined,
    certificadoConfigurado: true,
    actualizadoEn: response.updatedAt ?? response.createdAt,
  }
}

async function leerError(response: Response) {
  try {
    const body = await response.json()
    return body.detail ?? body.error ?? body.title ?? `Error HTTP ${response.status}`
  } catch {
    return `Error HTTP ${response.status}`
  }
}


function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const value = String(reader.result)
      resolve(value.includes(',') ? value.split(',')[1] : value)
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

async function requestEmpresa(path: string, init?: RequestInit) {
  return requestApi<EmpresaResponse>(path, init)
}

async function requestApi<T>(path: string, init?: RequestInit) {
  const method = init?.method ?? 'GET'
  logger.debug(`[facturacion] ${method} ${path}`)

  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  })

  if (!response.ok) {
    const mensaje = await leerError(response)
    logger.error(`[facturacion] ${method} ${path} → ${response.status}`, mensaje)
    throw new ApiError(mensaje, response.status)
  }

  logger.debug(`[facturacion] ${method} ${path} → ${response.status}`)
  return response.json() as Promise<T>
}

async function requestBlob(path: string, init?: RequestInit) {
  const method = init?.method ?? 'POST'
  logger.debug(`[facturacion] ${method} ${path}`)

  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  })

  if (!response.ok) {
    const mensaje = await leerError(response)
    logger.error(`[facturacion] ${method} ${path} → ${response.status}`, mensaje)
    throw new ApiError(mensaje, response.status)
  }

  logger.debug(`[facturacion] ${method} ${path} → ${response.status}`)
  return response.blob()
}

async function obtenerEmpresaPorRuc(ruc: string) {
  try {
    return await requestEmpresa(`/empresas/${ruc}`)
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null
    throw err
  }
}

function mapAmbienteApi(ambiente: ParametrosFacturacionResponse['ambiente']): AmbienteFacturacion {
  return ambiente === 2 || ambiente === 'Produccion' ? 'produccion' : 'pruebas'
}

function secuencialesSriFallback(empresa: EmpresaFacturacion): SecuencialSriFacturacion[] {
  return tipoComprobanteSriOptions.map(option => ({
    empresaRuc: empresa.ruc,
    tipoComprobante: option.value,
    secuencial: 1,
    codigoNumerico: '00000000',
  }))
}

function parametrosFacturacionFallback(empresa: EmpresaFacturacion): ParametrosFacturacionSri {
  return {
    empresaRuc: empresa.ruc,
    ambiente: 'pruebas',
    tipoEmision: '1',
    agenteRetencion: false,
    contribuyenteRimpe: '',
    estab: getSelectedCompany().estab,
    puntoEmision: getSelectedCompany().ptoEmi,
    contribuyenteEspecial: '',
    obligadoContabilidad: false,
    moneda: 'USD',
    codigoImpuesto: '2',
    codigoPorcentaje: 4,
  }
}

function mapSecuencialSri(response: SecuencialSriResponse): SecuencialSriFacturacion {
  return {
    id: response.id,
    empresaRuc: response.empresaRuc,
    tipoComprobante: response.tipoComprobante,
    secuencial: response.secuencial,
    codigoNumerico: response.codigoNumerico,
    fechaActualizacion: response.fechaActualizacion,
  }
}

interface FacturaApiResponse {
  id: string
  claveAcceso: string
  estadoSri: string
  numeroAutorizacion?: string | null
  fechaAutorizacion?: string | null
  xmlAutorizadoPath?: string | null
  pdfPath?: string | null
}

function mapFacturaResponse(response: FacturaApiResponse, dto: EmitirFacturaDto): DocumentoFacturacion {
  return {
    id: response.id,
    tipo: 'factura',
    numero: `${dto.estab}-${dto.ptoEmi}-${dto.secuencial}`,
    fechaEmision: dto.fechaEmision,
    razonSocial: dto.razonSocialComprador,
    identificacion: dto.identificacionComprador,
    total: dto.importeTotal,
    estadoSri: response.estadoSri.toLowerCase() as EstadoSriDocumento,
    claveAcceso: response.claveAcceso,
    numeroAutorizacion: response.numeroAutorizacion ?? undefined,
  }
}

function mapParametrosFacturacion(response: ParametrosFacturacionResponse): ParametrosFacturacionSri {
  return {
    empresaRuc: response.empresaRuc,
    ambiente: mapAmbienteApi(response.ambiente),
    tipoEmision: '1',
    agenteRetencion: response.agenteRetencion,
    contribuyenteRimpe: response.contribuyenteRimpe ?? '',
    estab: response.estab,
    puntoEmision: response.puntoEmision,
    contribuyenteEspecial: response.contribuyenteEspecial ?? '',
    obligadoContabilidad: response.obligadoContabilidad,
    moneda: 'USD',
    codigoImpuesto: '2',
    codigoPorcentaje: response.codigoPorcentaje,
    fechaActualizacion: response.fechaActualizacion,
  }
}

export class FacturacionApiService implements IFacturacionService {
  async listar(): Promise<RespuestaApi<DocumentoFacturacion[]>> {
    return ok([])
  }

  async listarEmpresas(): Promise<RespuestaApi<EmpresaFacturacion[]>> {
    try {
      const response = await requestApi<EmpresaResponse[]>('/empresas')
      return ok(response.map(mapEmpresa))
    } catch (err) {
      logger.error('[facturacion] listarEmpresas falló', err)
      return error(err instanceof Error ? err.message : 'No se pudieron cargar las empresas.', [])
    }
  }

  async obtenerEmpresa() {
    const fallback = empresaFallback()

    try {
      const empresa = await obtenerEmpresaPorRuc(fallback.ruc)
      if (!empresa) {
        logger.warn(`[facturacion] empresa ${fallback.ruc} no encontrada — usando fallback`)
        return ok(fallback)
      }
      return ok(mapEmpresa(empresa))
    } catch (err) {
      logger.error('[facturacion] obtenerEmpresa falló — usando fallback', err)
      return ok(fallback)
    }
  }

  async guardarEmpresa(dto: GuardarEmpresaFacturacionDto) {
    const fallback = empresaFallback()

    const certificadoP12Base64 = dto.certificadoP12Archivo
      ? await fileToBase64(dto.certificadoP12Archivo)
      : undefined
    const logoBase64 = dto.logoArchivo ? await fileToBase64(dto.logoArchivo) : undefined

    const guardarPayload = {
      ruc: dto.ruc,
      nombre: dto.nombre,
      dirMatriz: dto.dirMatriz,
      nombreComercial: dto.nombreComercial || null,
      certificadoP12Base64,
      certPassword: dto.certPassword,
      logoBase64,
      logoContentType: dto.logoArchivo?.type,
    }

    try {
      const empresa = await requestEmpresa('/empresas/guardar', {
        method: 'POST',
        body: JSON.stringify(guardarPayload),
      })

      logger.info(`[facturacion] empresa ${dto.ruc} guardada`)
      return ok({
        ...mapEmpresa(empresa),
        logo: dto.logo ?? mapEmpresa(empresa).logo,
        certificadoP12: dto.certificadoP12,
      })
    } catch (err) {
      logger.error('[facturacion] guardarEmpresa falló', err)
      return error(err instanceof Error ? err.message : 'No se pudo guardar la empresa.', fallback)
    }
  }

  async obtenerParametros(): Promise<RespuestaApi<ParametrosFacturacionModulo>> {
    const empresaResult = await this.obtenerEmpresa()
    const empresa = empresaResult.datos
    const fallback = {
      sri: secuencialesSriFallback(empresa),
      facturacion: parametrosFacturacionFallback(empresa),
    }

    try {
      const [sri, facturacion] = await Promise.all([
        requestApi<SecuencialSriResponse[]>(`/parametros/${empresa.ruc}/sri`).catch(err => {
          if (err instanceof ApiError && err.status === 404) {
            logger.warn(`[facturacion] secuenciales SRI no configurados para ${empresa.ruc}`)
            return []
          }
          throw err
        }),
        requestApi<ParametrosFacturacionResponse>(`/parametros/${empresa.ruc}/facturacion`).catch(err => {
          if (err instanceof ApiError && err.status === 404) {
            logger.warn(`[facturacion] parametros de facturacion no configurados para ${empresa.ruc}`)
            return null
          }
          throw err
        }),
      ])

      const sriMap = new Map(sri.map(item => [item.tipoComprobante, mapSecuencialSri(item)]))
      return ok({
        sri: fallback.sri.map(item => sriMap.get(item.tipoComprobante) ?? item),
        facturacion: facturacion ? mapParametrosFacturacion(facturacion) : fallback.facturacion,
      })
    } catch (err) {
      logger.error('[facturacion] obtenerParametros falló', err)
      return error(err instanceof Error ? err.message : 'No se pudieron cargar los parametros.', fallback)
    }
  }

  async obtenerParametrosPorRuc(ruc: string): Promise<RespuestaApi<ParametrosFacturacionModulo>> {
    const empresaFb = { ruc, nombre: ruc, nombreComercial: '', dirMatriz: '', cuenta: null, certificadoConfigurado: false }
    const fallback = {
      sri: secuencialesSriFallback(empresaFb),
      facturacion: parametrosFacturacionFallback(empresaFb),
    }

    try {
      const [sri, facturacion] = await Promise.all([
        requestApi<SecuencialSriResponse[]>(`/parametros/${ruc}/sri`).catch(err => {
          if (err instanceof ApiError && err.status === 404) return []
          throw err
        }),
        requestApi<ParametrosFacturacionResponse>(`/parametros/${ruc}/facturacion`).catch(err => {
          if (err instanceof ApiError && err.status === 404) return null
          throw err
        }),
      ])

      const sriMap = new Map(sri.map(item => [item.tipoComprobante, mapSecuencialSri(item)]))
      return ok({
        sri: fallback.sri.map(item => sriMap.get(item.tipoComprobante) ?? item),
        facturacion: facturacion ? mapParametrosFacturacion(facturacion) : fallback.facturacion,
      })
    } catch (err) {
      logger.error(`[facturacion] obtenerParametrosPorRuc(${ruc}) falló`, err)
      return error(err instanceof Error ? err.message : 'No se pudieron cargar los parametros.', fallback)
    }
  }

  async guardarSecuencialSri(dto: SecuencialSriFacturacion): Promise<RespuestaApi<SecuencialSriFacturacion>> {
    try {
      const response = await requestApi<SecuencialSriResponse>(`/parametros/${dto.empresaRuc}/sri/${dto.tipoComprobante}`, {
        method: 'PUT',
        body: JSON.stringify({
          tipoComprobante: dto.tipoComprobante,
          secuencial: dto.secuencial,
          codigoNumerico: dto.codigoNumerico,
        }),
      })

      logger.info(`[facturacion] secuencial SRI ${dto.tipoComprobante} guardado → ${dto.secuencial}`)
      return ok(mapSecuencialSri(response))
    } catch (err) {
      logger.error('[facturacion] guardarSecuencialSri falló', err)
      return error(err instanceof Error ? err.message : 'No se pudo guardar el parametro SRI.', dto)
    }
  }

  async guardarParametrosFacturacion(dto: ParametrosFacturacionSri): Promise<RespuestaApi<ParametrosFacturacionSri>> {
    try {
      const response = await requestApi<ParametrosFacturacionResponse>(`/parametros/${dto.empresaRuc}/facturacion`, {
        method: 'PUT',
        body: JSON.stringify({
          ambiente: ambienteApiValue(dto.ambiente),
          tipoEmision: dto.tipoEmision,
          agenteRetencion: dto.agenteRetencion,
          contribuyenteRimpe: dto.contribuyenteRimpe || null,
          estab: dto.estab,
          puntoEmision: dto.puntoEmision,
          contribuyenteEspecial: dto.contribuyenteEspecial || null,
          obligadoContabilidad: dto.obligadoContabilidad,
          moneda: dto.moneda,
          codigoImpuesto: dto.codigoImpuesto,
          codigoPorcentaje: dto.codigoPorcentaje,
        }),
      })

      logger.info(`[facturacion] parametros guardados — ambiente ${dto.ambiente}`)
      return ok(mapParametrosFacturacion(response))
    } catch (err) {
      logger.error('[facturacion] guardarParametrosFacturacion falló', err)
      return error(err instanceof Error ? err.message : 'No se pudieron guardar los parametros.', dto)
    }
  }

  async previewFactura(dto: EmitirFacturaDto): Promise<RespuestaApi<Blob>> {
    try {
      const d = dto.detalle
      const precioTotalSinImpuesto = Math.max(d.cantidad * d.precioUnitario - d.descuento, 0)
      const ivaValor = precioTotalSinImpuesto * (d.ivaTarifa / 100)

      const blob = await requestBlob('/facturas/preview', {
        method: 'POST',
        body: JSON.stringify({
          empresaRuc: dto.empresaRuc,
          ambiente: ambienteApiValue(dto.ambiente),
          estab: dto.estab,
          ptoEmi: dto.ptoEmi,
          secuencial: dto.secuencial,
          fechaEmision: dto.fechaEmision,
          tipoIdentificacionComprador: dto.tipoIdentificacionComprador,
          identificacionComprador: dto.identificacionComprador,
          razonSocialComprador: dto.razonSocialComprador,
          direccionComprador: dto.direccionComprador ?? null,
          totalSinImpuestos: dto.totalSinImpuestos,
          totalDescuento: dto.totalDescuento,
          baseImponibleIva: dto.totalSinImpuestos,
          valorIva: dto.valorIva,
          propina: 0,
          importeTotal: dto.importeTotal,
          formasPago: [{ codigo: dto.formaPago, total: dto.importeTotal }],
          infoAdicional: [],
          detalle: [{
            orden: 1,
            codigoPrincipal: d.codigoPrincipal,
            descripcion: d.descripcion,
            cantidad: d.cantidad,
            precioUnitario: d.precioUnitario,
            descuento: d.descuento,
            precioTotalSinImpuesto,
            ivaCodigo: d.ivaCodigo,
            ivaTarifa: d.ivaTarifa,
            ivaBase: precioTotalSinImpuesto,
            ivaValor,
          }],
        }),
      })

      logger.info('[facturacion] preview generado')
      return { ok: true, datos: blob }
    } catch (err) {
      logger.error('[facturacion] previewFactura falló', err)
      return { ok: false, datos: new Blob(), mensaje: err instanceof Error ? err.message : 'No se pudo generar el preview.' }
    }
  }

  async emitirFactura(dto: EmitirFacturaDto): Promise<RespuestaApi<DocumentoFacturacion>> {
    try {
      const d = dto.detalle
      const precioTotalSinImpuesto = Math.max(d.cantidad * d.precioUnitario - d.descuento, 0)
      const ivaValor = precioTotalSinImpuesto * (d.ivaTarifa / 100)

      const response = await requestApi<FacturaApiResponse>('/facturas/', {
        method: 'POST',
        body: JSON.stringify({
          empresaRuc: dto.empresaRuc,
          ambiente: ambienteApiValue(dto.ambiente),
          estab: dto.estab,
          ptoEmi: dto.ptoEmi,
          secuencial: dto.secuencial,
          fechaEmision: dto.fechaEmision,
          tipoIdentificacionComprador: dto.tipoIdentificacionComprador,
          identificacionComprador: dto.identificacionComprador,
          razonSocialComprador: dto.razonSocialComprador,
          direccionComprador: dto.direccionComprador ?? null,
          totalSinImpuestos: dto.totalSinImpuestos,
          totalDescuento: dto.totalDescuento,
          baseImponibleIva: dto.totalSinImpuestos,
          valorIva: dto.valorIva,
          propina: 0,
          importeTotal: dto.importeTotal,
          formasPago: [{ codigo: dto.formaPago, total: dto.importeTotal }],
          infoAdicional: [],
          detalle: [{
            orden: 1,
            codigoPrincipal: d.codigoPrincipal,
            descripcion: d.descripcion,
            cantidad: d.cantidad,
            precioUnitario: d.precioUnitario,
            descuento: d.descuento,
            precioTotalSinImpuesto,
            ivaCodigo: d.ivaCodigo,
            ivaTarifa: d.ivaTarifa,
            ivaBase: precioTotalSinImpuesto,
            ivaValor,
          }],
        }),
      })

      logger.info(`[facturacion] factura emitida — ${response.estadoSri} — clave ${response.claveAcceso}`)
      return ok(mapFacturaResponse(response, dto))
    } catch (err) {
      logger.error('[facturacion] emitirFactura falló', err)
      return error(err instanceof Error ? err.message : 'No se pudo emitir la factura.', {} as DocumentoFacturacion)
    }
  }

  async emitirNotaCredito(_dto: EmitirNotaCreditoDto): Promise<RespuestaApi<DocumentoFacturacion>> {
    void _dto
    return error('Emision de notas de credito por API no implementada en el CRM todavia.', {} as DocumentoFacturacion)
  }

  async emitirRetencion(_dto: EmitirRetencionDto): Promise<RespuestaApi<DocumentoFacturacion>> {
    void _dto
    return error('Emision de retenciones por API no implementada en el CRM todavia.', {} as DocumentoFacturacion)
  }
}
