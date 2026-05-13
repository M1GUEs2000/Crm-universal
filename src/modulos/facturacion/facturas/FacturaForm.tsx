import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Form, FormActions, FormField, FormGrid, FormSection } from '@/components/ui'
import { Input, NumberInput, Select } from '@/components/ui/inputs'
import { ivaSriOptions, tarifaIvaDesdeCodigo, tipoIdentificacionOptions, ambienteFacturacionOptions } from '@/constants/facturacionSri'
import { facturacionService } from '@/services'
import type { CodigoIvaSri, EmitirFacturaDto, EmpresaFacturacion } from '@/types'
import { defaultFormState, formaPagoOptions, tipoComprobante } from './config'

function calcularTotales(cantidad: number, precioUnitario: number, descuento: number, ivaTarifa: number) {
  const subtotal = Math.max(cantidad * precioUnitario - descuento, 0)
  const iva = subtotal * (ivaTarifa / 100)
  return { subtotal, iva, total: subtotal + iva }
}

interface Props {
  onEmitir: (dto: EmitirFacturaDto) => Promise<void>
}

export function FacturaForm({ onEmitir }: Props) {
  const [guardando, setGuardando] = useState(false)
  const [cargandoParams, setCargandoParams] = useState(false)
  const [empresas, setEmpresas] = useState<EmpresaFacturacion[]>([])
  const [form, setForm] = useState(defaultFormState)

  useEffect(() => {
    facturacionService.listarEmpresas().then(r => {
      if (r.ok) setEmpresas(r.datos)
    })
  }, [])

  const set = (key: string) => (value: string | number | '') => setForm(actual => ({ ...actual, [key]: value }))
  const ivaTarifa = tarifaIvaDesdeCodigo(Number(form.ivaCodigo) as CodigoIvaSri)
  const { subtotal, iva, total } = calcularTotales(Number(form.cantidad), Number(form.precioUnitario), Number(form.descuento), ivaTarifa)

  async function cargarParametros(ruc: string) {
    if (!ruc) return

    setCargandoParams(true)
    const r = await facturacionService.obtenerParametrosPorRuc(ruc)
    setCargandoParams(false)

    if (!r.ok) {
      toast.info(r.mensaje ?? 'No hay parametros configurados para ese RUC — ingresalos manualmente.')
      return
    }

    const { facturacion, sri } = r.datos
    const secuencial = sri.find(s => s.tipoComprobante === tipoComprobante)

    setForm(actual => ({
      ...actual,
      ambiente: facturacion.ambiente,
      estab: facturacion.estab,
      ptoEmi: facturacion.puntoEmision,
      secuencial: secuencial ? String(secuencial.secuencial).padStart(9, '0') : actual.secuencial,
    }))
  }

  function onRucChange(ruc: string) {
    set('empresaRuc')(ruc)
    cargarParametros(ruc)
  }

  async function handleSubmit() {
    setGuardando(true)
    await onEmitir({
      empresaRuc: form.empresaRuc,
      ambiente: form.ambiente,
      estab: form.estab,
      ptoEmi: form.ptoEmi,
      secuencial: form.secuencial,
      fechaEmision: form.fechaEmision,
      tipoIdentificacionComprador: form.tipoIdentificacionComprador as EmitirFacturaDto['tipoIdentificacionComprador'],
      identificacionComprador: form.identificacionComprador,
      razonSocialComprador: form.razonSocialComprador,
      direccionComprador: form.direccionComprador || undefined,
      formaPago: form.formaPago,
      totalSinImpuestos: subtotal,
      totalDescuento: Number(form.descuento),
      valorIva: iva,
      importeTotal: total,
      detalle: {
        codigoPrincipal: form.codigoPrincipal,
        descripcion: form.descripcion,
        cantidad: Number(form.cantidad),
        precioUnitario: Number(form.precioUnitario),
        descuento: Number(form.descuento),
        ivaCodigo: Number(form.ivaCodigo) as CodigoIvaSri,
        ivaTarifa,
      },
    })
    setGuardando(false)
    cargarParametros(form.empresaRuc)
  }

  const empresaOptions = empresas.map(e => ({
    value: e.ruc,
    label: `${e.ruc} — ${e.nombre}`,
  }))

  return (
    <Form onSubmit={handleSubmit}>
      <FormSection title="Documento">
        <FormGrid cols={3}>
          <FormField label="Empresa">
            {empresaOptions.length > 0
              ? (
                <Select
                  value={form.empresaRuc}
                  onChange={onRucChange}
                  options={[{ value: '', label: 'Selecciona una empresa' }, ...empresaOptions]}
                />
              )
              : (
                <Input
                  value={form.empresaRuc}
                  onChange={ruc => { set('empresaRuc')(ruc); cargarParametros(ruc) }}
                  placeholder="RUC de la empresa"
                />
              )
            }
          </FormField>
          <FormField label="Ambiente">
            <Select value={form.ambiente} onChange={set('ambiente')} options={ambienteFacturacionOptions} disabled={cargandoParams} />
          </FormField>
          <FormField label="Fecha emision">
            <Input type="date" value={form.fechaEmision} onChange={set('fechaEmision')} />
          </FormField>
          <FormField label="Estab.">
            <Input value={form.estab} onChange={set('estab')} placeholder={cargandoParams ? 'Cargando...' : ''} />
          </FormField>
          <FormField label="Pto. Emi.">
            <Input value={form.ptoEmi} onChange={set('ptoEmi')} placeholder={cargandoParams ? 'Cargando...' : ''} />
          </FormField>
          <FormField label="Secuencial">
            <Input value={form.secuencial} onChange={set('secuencial')} placeholder={cargandoParams ? 'Cargando...' : 'Sin configurar'} disabled />
          </FormField>
        </FormGrid>
      </FormSection>

      <FormSection title="Comprador">
        <FormGrid>
          <FormField label="Tipo identificacion">
            <Select value={form.tipoIdentificacionComprador} onChange={set('tipoIdentificacionComprador')} options={tipoIdentificacionOptions} />
          </FormField>
          <FormField label="Identificacion">
            <Input value={form.identificacionComprador} onChange={set('identificacionComprador')} />
          </FormField>
          <FormField label="Razon social">
            <Input value={form.razonSocialComprador} onChange={set('razonSocialComprador')} />
          </FormField>
          <FormField label="Direccion">
            <Input value={form.direccionComprador} onChange={set('direccionComprador')} />
          </FormField>
        </FormGrid>
      </FormSection>

      <FormSection title="Detalle">
        <FormGrid>
          <FormField label="Codigo principal">
            <Input value={form.codigoPrincipal} onChange={set('codigoPrincipal')} />
          </FormField>
          <FormField label="Descripcion">
            <Input value={form.descripcion} onChange={set('descripcion')} />
          </FormField>
          <FormField label="Cantidad">
            <NumberInput value={form.cantidad} onChange={set('cantidad')} min={0} step={0.01} />
          </FormField>
          <FormField label="Precio unitario">
            <NumberInput value={form.precioUnitario} onChange={set('precioUnitario')} min={0} step={0.01} />
          </FormField>
          <FormField label="Descuento">
            <NumberInput value={form.descuento} onChange={set('descuento')} min={0} step={0.01} />
          </FormField>
          <FormField label="IVA">
            <Select
              value={String(form.ivaCodigo)}
              onChange={value => set('ivaCodigo')(Number(value) as CodigoIvaSri)}
              options={ivaSriOptions.map(opt => ({ value: String(opt.value), label: opt.label }))}
            />
          </FormField>
        </FormGrid>
      </FormSection>

      <FormSection title="Pago">
        <FormGrid cols={1}>
          <FormField label="Forma de pago">
            <Select value={form.formaPago} onChange={set('formaPago')} options={formaPagoOptions} />
          </FormField>
        </FormGrid>
      </FormSection>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-card bg-background p-4">
        <div>
          <p className="text-xs text-text-muted">Subtotal</p>
          <p className="text-sm font-medium text-text">{subtotal.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">IVA</p>
          <p className="text-sm font-medium text-text">{iva.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Importe total</p>
          <p className="text-sm font-semibold text-text">{total.toFixed(2)}</p>
        </div>
      </div>

      <FormActions submitText="Emitir factura" loading={guardando} />
    </Form>
  )
}
