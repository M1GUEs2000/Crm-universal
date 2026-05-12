import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { Badge, Button, Card, Form, FormActions, FormField, FormGrid, FormSection, PageHeader, Spinner } from '@/components/ui'
import { Checkbox, Input, NumberInput, Select } from '@/components/ui/inputs'
import {
  ambienteFacturacionOptions,
  ivaSriOptions,
  tipoComprobanteSriOptions,
} from '@/constants/facturacionSri'
import { facturacionService } from '@/services'
import type { AmbienteFacturacion, CodigoIvaSri, EmpresaFacturacion, ParametrosFacturacionSri, SecuencialSriFacturacion } from '@/types'

const rimpeOptions = [
  { value: '', label: 'No aplica' },
  { value: 'CONTRIBUYENTE REGIMEN RIMPE', label: 'Contribuyente regimen RIMPE' },
  { value: 'CONTRIBUYENTE NEGOCIO POPULAR - REGIMEN RIMPE', label: 'Negocio popular RIMPE' },
]

function normalizarCodigoNumerico(valor: string) {
  return valor.replace(/\D/g, '').slice(0, 8).padStart(8, '0')
}

function actualizarParametro(
  parametros: SecuencialSriFacturacion[],
  tipoComprobante: SecuencialSriFacturacion['tipoComprobante'],
  cambio: Partial<SecuencialSriFacturacion>,
) {
  return parametros.map(item =>
    item.tipoComprobante === tipoComprobante ? { ...item, ...cambio } : item,
  )
}

export default function ParametrosFacturacionPage({ ocultarEncabezado = false }: { ocultarEncabezado?: boolean }) {
  const [cargandoEmpresas, setCargandoEmpresas] = useState(true)
  const [cargandoParams, setCargandoParams] = useState(false)
  const [guardandoFacturacion, setGuardandoFacturacion] = useState(false)
  const [guardandoSri, setGuardandoSri] = useState<string | null>(null)
  const [erroresSri, setErroresSri] = useState<Record<string, string>>({})
  const [erroresFacturacion, setErroresFacturacion] = useState<Record<string, string>>({})
  const [empresas, setEmpresas] = useState<EmpresaFacturacion[]>([])
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<EmpresaFacturacion | null>(null)
  const [sri, setSri] = useState<SecuencialSriFacturacion[]>([])
  const [facturacion, setFacturacion] = useState<ParametrosFacturacionSri | null>(null)

  useEffect(() => {
    async function cargarEmpresas() {
      const r = await facturacionService.listarEmpresas()
      if (r.ok && r.datos.length > 0) {
        setEmpresas(r.datos)
        await cargarParams(r.datos[0])
      } else if (!r.ok) {
        toast.error(r.mensaje ?? 'No se pudieron cargar las empresas.')
      }
      setCargandoEmpresas(false)
    }
    cargarEmpresas()
  }, [])

  async function cargarParams(empresa: EmpresaFacturacion) {
    setEmpresaSeleccionada(empresa)
    setCargandoParams(true)
    const r = await facturacionService.obtenerParametrosPorRuc(empresa.ruc)
    if (r.ok) {
      setSri(r.datos.sri)
      setFacturacion(r.datos.facturacion)
    } else {
      toast.error(r.mensaje ?? 'No se pudieron cargar los parametros.')
    }
    setCargandoParams(false)
  }

  const setSecuencialSri = (tipoComprobante: SecuencialSriFacturacion['tipoComprobante'], key: keyof SecuencialSriFacturacion) =>
    (value: string | number) => {
      setSri(actual => actualizarParametro(actual, tipoComprobante, { [key]: value }))
      setErroresSri(actual => ({ ...actual, [tipoComprobante]: '' }))
    }

  const setParametroFacturacion = (key: keyof ParametrosFacturacionSri) =>
    (value: string | boolean | number | undefined) => {
      setFacturacion(actual => actual ? { ...actual, [key]: value } : actual)
      setErroresFacturacion(actual => ({ ...actual, [key]: '' }))
    }

  function validarSri(parametro: SecuencialSriFacturacion) {
    if (parametro.secuencial < 1) return 'El secuencial debe ser mayor a cero.'
    if (!/^\d{8}$/.test(parametro.codigoNumerico)) return 'El codigo numerico debe tener 8 digitos.'
    return ''
  }

  async function guardarSri(parametro: SecuencialSriFacturacion) {
    const err = validarSri(parametro)
    if (err) {
      setErroresSri(actual => ({ ...actual, [parametro.tipoComprobante]: err }))
      return
    }

    setGuardandoSri(parametro.tipoComprobante)
    const dto = { ...parametro, codigoNumerico: normalizarCodigoNumerico(parametro.codigoNumerico) }
    const r = await facturacionService.guardarSecuencialSri(dto)
    if (r.ok) {
      setSri(actual => actualizarParametro(actual, parametro.tipoComprobante, r.datos))
      toast.success('Secuencial SRI guardado.')
    } else {
      toast.error(r.mensaje ?? 'No se pudo guardar el secuencial.')
    }
    setGuardandoSri(null)
  }

  function validarFacturacion() {
    if (!facturacion) return false
    const nuevos: Record<string, string> = {}
    if (!/^\d{3}$/.test(facturacion.estab)) nuevos.estab = 'Usa 3 digitos.'
    if (!/^\d{3}$/.test(facturacion.puntoEmision)) nuevos.puntoEmision = 'Usa 3 digitos.'
    if (facturacion.contribuyenteEspecial && !/^\d{3,13}$/.test(facturacion.contribuyenteEspecial)) {
      nuevos.contribuyenteEspecial = 'Usa entre 3 y 13 digitos.'
    }
    setErroresFacturacion(nuevos)
    return Object.keys(nuevos).length === 0
  }

  async function guardarFacturacion() {
    if (!facturacion || !validarFacturacion()) return

    setGuardandoFacturacion(true)
    const r = await facturacionService.guardarParametrosFacturacion({
      ...facturacion,
      estab: facturacion.estab.padStart(3, '0'),
      puntoEmision: facturacion.puntoEmision.padStart(3, '0'),
    })
    if (r.ok) {
      setFacturacion(r.datos)
      toast.success('Parametros de facturacion guardados.')
    } else {
      toast.error(r.mensaje ?? 'No se pudieron guardar los parametros.')
    }
    setGuardandoFacturacion(false)
  }

  if (cargandoEmpresas) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  if (empresas.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        {!ocultarEncabezado && <PageHeader title="Parametros de Facturacion" />}
        <Card>
          <p className="text-sm text-text-muted text-center py-8">
            Primero agrega una empresa en Datos de la Empresa.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {!ocultarEncabezado && <PageHeader title="Parametros de Facturacion" />}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px] gap-6">
        <div className="flex flex-col gap-6">
          {cargandoParams || !facturacion ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : (
            <>
              <Card>
                <FormSection title="Secuenciales SRI">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {sri.map(parametro => {
                      const tipo = tipoComprobanteSriOptions.find(option => option.value === parametro.tipoComprobante)
                      return (
                        <div key={parametro.tipoComprobante} className="rounded-input border border-border bg-surface p-4">
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 className="text-sm font-medium text-text">{tipo?.label ?? parametro.tipoComprobante}</h2>
                            <span className="text-xs text-text-muted">{parametro.tipoComprobante}</span>
                          </div>
                          <div className="flex flex-col gap-3">
                            <NumberInput
                              label="Secuencial"
                              value={parametro.secuencial}
                              min={1}
                              max={999999999}
                              onChange={value => setSecuencialSri(parametro.tipoComprobante, 'secuencial')(value || 1)}
                            />
                            <Input
                              label="Codigo numerico"
                              value={parametro.codigoNumerico}
                              onChange={value => setSecuencialSri(parametro.tipoComprobante, 'codigoNumerico')(value.replace(/\D/g, '').slice(0, 8))}
                              placeholder="00000000"
                            />
                            {erroresSri[parametro.tipoComprobante] && (
                              <p className="text-xs text-red-500">{erroresSri[parametro.tipoComprobante]}</p>
                            )}
                            <Button
                              size="sm"
                              loading={guardandoSri === parametro.tipoComprobante}
                              onClick={() => guardarSri(parametro)}
                            >
                              <span className="inline-flex items-center gap-2"><Save size={14} />Guardar</span>
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </FormSection>
              </Card>

              <Card>
                <Form onSubmit={guardarFacturacion}>
                  <FormSection title="Parametros fiscales">
                    <FormGrid>
                      <FormField label="Ambiente">
                        <Select
                          value={facturacion.ambiente}
                          onChange={value => setParametroFacturacion('ambiente')(value as AmbienteFacturacion)}
                          options={ambienteFacturacionOptions.map(({ value, label }) => ({ value, label }))}
                        />
                      </FormField>
                      <FormField label="Tipo emision">
                        <Select value={facturacion.tipoEmision} onChange={() => undefined} options={[{ value: '1', label: 'Normal' }]} />
                      </FormField>
                      <FormField label="Establecimiento" error={erroresFacturacion.estab}>
                        <Input value={facturacion.estab} onChange={value => setParametroFacturacion('estab')(value.replace(/\D/g, '').slice(0, 3))} />
                      </FormField>
                      <FormField label="Punto emision" error={erroresFacturacion.puntoEmision}>
                        <Input value={facturacion.puntoEmision} onChange={value => setParametroFacturacion('puntoEmision')(value.replace(/\D/g, '').slice(0, 3))} />
                      </FormField>
                      <FormField label="IVA por defecto">
                        <Select
                          value={String(facturacion.codigoPorcentaje)}
                          onChange={value => setParametroFacturacion('codigoPorcentaje')(Number(value) as CodigoIvaSri)}
                          options={ivaSriOptions.map(option => ({ value: String(option.value), label: option.label }))}
                        />
                      </FormField>
                      <FormField label="Contribuyente RIMPE">
                        <Select value={facturacion.contribuyenteRimpe ?? ''} onChange={setParametroFacturacion('contribuyenteRimpe')} options={rimpeOptions} />
                      </FormField>
                      <FormField label="Contribuyente especial" error={erroresFacturacion.contribuyenteEspecial}>
                        <Input value={facturacion.contribuyenteEspecial ?? ''} onChange={value => setParametroFacturacion('contribuyenteEspecial')(value.replace(/\D/g, '').slice(0, 13))} />
                      </FormField>
                      <FormField label="Moneda">
                        <Input value={facturacion.moneda} onChange={() => undefined} disabled />
                      </FormField>
                      <FormField label="Codigo impuesto">
                        <Input value={facturacion.codigoImpuesto} onChange={() => undefined} disabled />
                      </FormField>
                    </FormGrid>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <Checkbox
                        checked={facturacion.agenteRetencion}
                        onChange={setParametroFacturacion('agenteRetencion')}
                        label="Agente de retencion"
                      />
                      <Checkbox
                        checked={facturacion.obligadoContabilidad}
                        onChange={setParametroFacturacion('obligadoContabilidad')}
                        label="Obligado a llevar contabilidad"
                      />
                    </div>
                  </FormSection>
                  <FormActions submitText="Guardar parametros" loading={guardandoFacturacion} />
                </Form>
              </Card>
            </>
          )}
        </div>

        <aside className="flex flex-col gap-3">
          {empresas.map(empresa => (
            <button
              key={empresa.ruc}
              type="button"
              onClick={() => cargarParams(empresa)}
              className={`w-full rounded-card border p-4 text-left transition-colors ${
                empresaSeleccionada?.ruc === empresa.ruc
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-surface hover:bg-background'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-xs font-medium text-text-muted truncate">{empresa.ruc}</p>
                <Badge variant={empresa.certificadoConfigurado ? 'success' : 'warning'}>
                  {empresa.certificadoConfigurado ? 'Lista' : 'Pendiente'}
                </Badge>
              </div>
              <p className="text-sm font-medium text-text truncate">{empresa.nombre}</p>
            </button>
          ))}
        </aside>
      </div>
    </div>
  )
}
