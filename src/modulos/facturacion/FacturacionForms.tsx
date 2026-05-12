import { useState } from 'react'
import { Form, FormActions, FormField, FormGrid, FormSection } from '@/components/ui'
import { Input, NumberInput, Select, Textarea } from '@/components/ui/inputs'
import {
  ambienteFacturacionOptions,
  ivaSriOptions,
  retencionesSriOptions,
  tarifaIvaDesdeCodigo,
  tipoIdentificacionOptions,
  tipoIdentificacionRetencionOptions,
  tipoImpuestoRetencionOptions,
} from '@/constants/facturacionSri'
import type { AmbienteFacturacion, CodigoImpuestoRetencionSri, CodigoIvaSri, EmitirNotaCreditoDto, EmitirRetencionDto } from '@/types'

export { FacturaForm } from './facturas/FacturaForm'

function crearBaseDocumento() {
  return {
    empresaRuc: '',
    ambiente: 'pruebas' as AmbienteFacturacion,
    estab: '',
    ptoEmi: '',
    secuencial: '',
    fechaEmision: new Date().toISOString().slice(0, 10),
  }
}

function totalDetalle(cantidad: number, precioUnitario: number, descuento: number, ivaTarifa: number) {
  const subtotal = Math.max(cantidad * precioUnitario - descuento, 0)
  const iva = subtotal * (ivaTarifa / 100)
  return { subtotal, iva, total: subtotal + iva }
}

interface Props<T> {
  onEmitir: (dto: T) => Promise<void>
}

type RetencionFormState = ReturnType<typeof crearBaseDocumento> & {
  tipoIdentificacionSujeto: '04' | '05' | '06'
  identificacionSujeto: string
  razonSocialSujeto: string
  direccionSujeto: string
  periodoFiscal: string
  codigoImpuesto: CodigoImpuestoRetencionSri
  codigoRetencion: string
  codDocSustento: string
  numDocSustento: string
  fechaEmisionDocSustento: string
  totalBaseImponible: number
  totalRetencionRenta: number
  totalRetencionIva: number
}

export function NotaCreditoForm({ onEmitir }: Props<EmitirNotaCreditoDto>) {
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState({
    ...crearBaseDocumento(),
    secuencial: '000000003',
    tipoIdentificacionComprador: '05',
    identificacionComprador: '9999999999',
    razonSocialComprador: 'Cliente Demo',
    direccionComprador: '',
    docModificadoTipo: '01',
    docModificadoNumero: '001-001-000000001',
    docModificadoFecha: new Date().toISOString().slice(0, 10),
    docModificadoClaveAcceso: '0805202601179999999900110010010000000011234567811',
    motivo: 'Devolucion parcial',
    codigoPrincipal: 'SERV-001',
    descripcion: 'Devolucion de servicio',
    cantidad: 1,
    precioUnitario: 50,
    descuento: 0,
    ivaCodigo: 2 as CodigoIvaSri,
  })

  const set = (key: string) => (value: string | number | '') => setForm(actual => ({ ...actual, [key]: value }))
  const ivaTarifa = tarifaIvaDesdeCodigo(Number(form.ivaCodigo) as CodigoIvaSri)
  const totales = totalDetalle(Number(form.cantidad), Number(form.precioUnitario), Number(form.descuento), ivaTarifa)

  async function handleSubmit() {
    setGuardando(true)
    await onEmitir({
      ...form,
      cantidad: undefined,
      precioUnitario: undefined,
      descuento: undefined,
      ivaCodigo: undefined,
      totalSinImpuestos: totales.subtotal,
      totalDescuento: Number(form.descuento),
      valorIva: totales.iva,
      valorModificacion: totales.total,
      detalle: {
        codigoPrincipal: form.codigoPrincipal,
        descripcion: form.descripcion,
        cantidad: Number(form.cantidad),
        precioUnitario: Number(form.precioUnitario),
        descuento: Number(form.descuento),
        ivaCodigo: Number(form.ivaCodigo) as CodigoIvaSri,
        ivaTarifa,
      },
    } as EmitirNotaCreditoDto)
    setGuardando(false)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <DocumentoBaseFields form={form} set={set} sujeto="Comprador" />
      <FormSection title="Documento modificado">
        <FormGrid>
          <FormField label="Tipo documento">
            <Input value={form.docModificadoTipo} onChange={set('docModificadoTipo')} />
          </FormField>
          <FormField label="Numero">
            <Input value={form.docModificadoNumero} onChange={set('docModificadoNumero')} />
          </FormField>
          <FormField label="Fecha">
            <Input type="date" value={form.docModificadoFecha} onChange={set('docModificadoFecha')} />
          </FormField>
          <FormField label="Clave de acceso">
            <Input value={form.docModificadoClaveAcceso} onChange={set('docModificadoClaveAcceso')} />
          </FormField>
        </FormGrid>
        <FormField label="Motivo">
          <Textarea value={form.motivo} onChange={set('motivo')} rows={2} />
        </FormField>
      </FormSection>
      <DetalleVentaFields form={form} set={set} />
      <ResumenTotal subtotal={totales.subtotal} iva={totales.iva} total={totales.total} />
      <FormActions submitText="Emitir nota de credito" loading={guardando} />
    </Form>
  )
}

export function RetencionForm({ onEmitir }: Props<EmitirRetencionDto>) {
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState<RetencionFormState>({
    ...crearBaseDocumento(),
    secuencial: '000000002',
    tipoIdentificacionSujeto: '04' as const,
    identificacionSujeto: '0999999999001',
    razonSocialSujeto: 'Proveedor Demo',
    direccionSujeto: '',
    periodoFiscal: '05/2026',
    codigoImpuesto: '1' as const,
    codigoRetencion: '332',
    codDocSustento: '01',
    numDocSustento: '001-001-000000001',
    fechaEmisionDocSustento: new Date().toISOString().slice(0, 10),
    totalBaseImponible: 100,
    totalRetencionRenta: 10,
    totalRetencionIva: 0,
  })

  const set = (key: string) => (value: string | number | '') => setForm(actual => ({ ...actual, [key]: value }))
  const retencionOptions = retencionesSriOptions
    .filter(option => option.tipoImpuesto === form.codigoImpuesto)
    .map(option => ({
      value: option.codigo,
      label: `${option.codigo} - ${option.descripcion} (${option.porcentaje}%)`,
    }))
  const totalRetenido = Number(form.totalRetencionRenta) + Number(form.totalRetencionIva)

  async function handleSubmit() {
    setGuardando(true)
    await onEmitir({ ...form, totalRetenido })
    setGuardando(false)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <DocumentoBaseFields form={form} set={set} sujeto="Sujeto retenido" />
      <FormSection title="Sustento y retencion">
        <FormGrid>
          <FormField label="Periodo fiscal">
            <Input value={form.periodoFiscal} onChange={set('periodoFiscal')} placeholder="MM/YYYY" />
          </FormField>
          <FormField label="Codigo impuesto">
            <Select value={form.codigoImpuesto} onChange={value => {
              const next = value as CodigoImpuestoRetencionSri
              const first = retencionesSriOptions.find(option => option.tipoImpuesto === next)
              setForm(actual => ({ ...actual, codigoImpuesto: next, codigoRetencion: first?.codigo ?? '' }))
            }} options={tipoImpuestoRetencionOptions} />
          </FormField>
          <FormField label="Codigo retencion">
            <Select value={form.codigoRetencion} onChange={set('codigoRetencion')} options={retencionOptions} />
          </FormField>
          <FormField label="Doc. sustento">
            <Input value={form.numDocSustento} onChange={set('numDocSustento')} />
          </FormField>
          <FormField label="Fecha sustento">
            <Input type="date" value={form.fechaEmisionDocSustento} onChange={set('fechaEmisionDocSustento')} />
          </FormField>
          <FormField label="Base imponible">
            <NumberInput value={form.totalBaseImponible} onChange={set('totalBaseImponible')} min={0} step={0.01} />
          </FormField>
          <FormField label="Retencion renta">
            <NumberInput value={form.totalRetencionRenta} onChange={set('totalRetencionRenta')} min={0} step={0.01} />
          </FormField>
          <FormField label="Retencion IVA">
            <NumberInput value={form.totalRetencionIva} onChange={set('totalRetencionIva')} min={0} step={0.01} />
          </FormField>
        </FormGrid>
      </FormSection>
      <ResumenTotal subtotal={Number(form.totalBaseImponible)} iva={0} total={totalRetenido} labelTotal="Total retenido" />
      <FormActions submitText="Emitir retencion" loading={guardando} />
    </Form>
  )
}

function DocumentoBaseFields({ form, set, sujeto }: { form: Record<string, string | number>; set: (key: string) => (value: string | number | '') => void; sujeto: string }) {
  const tipoKey = sujeto === 'Comprador' ? 'tipoIdentificacionComprador' : 'tipoIdentificacionSujeto'
  const identificacionKey = sujeto === 'Comprador' ? 'identificacionComprador' : 'identificacionSujeto'
  const razonSocialKey = sujeto === 'Comprador' ? 'razonSocialComprador' : 'razonSocialSujeto'
  const direccionKey = sujeto === 'Comprador' ? 'direccionComprador' : 'direccionSujeto'

  return (
    <>
      <FormSection title="Documento">
        <FormGrid cols={3}>
          <FormField label="Empresa RUC">
            <Input value={String(form.empresaRuc)} onChange={set('empresaRuc')} />
          </FormField>
          <FormField label="Ambiente">
            <Select value={String(form.ambiente)} onChange={set('ambiente')} options={ambienteFacturacionOptions} />
          </FormField>
          <FormField label="Fecha emision">
            <Input type="date" value={String(form.fechaEmision)} onChange={set('fechaEmision')} />
          </FormField>
          <FormField label="Estab.">
            <Input value={String(form.estab)} onChange={set('estab')} />
          </FormField>
          <FormField label="Pto. Emi.">
            <Input value={String(form.ptoEmi)} onChange={set('ptoEmi')} />
          </FormField>
          <FormField label="Secuencial">
            <Input value={String(form.secuencial)} onChange={set('secuencial')} />
          </FormField>
        </FormGrid>
      </FormSection>

      <FormSection title={sujeto}>
        <FormGrid>
          <FormField label="Tipo identificacion">
            <Select
              value={String(form[tipoKey])}
              onChange={set(tipoKey)}
              options={sujeto === 'Comprador' ? tipoIdentificacionOptions : tipoIdentificacionRetencionOptions}
            />
          </FormField>
          <FormField label="Identificacion">
            <Input value={String(form[identificacionKey])} onChange={set(identificacionKey)} />
          </FormField>
          <FormField label="Razon social">
            <Input value={String(form[razonSocialKey])} onChange={set(razonSocialKey)} />
          </FormField>
          <FormField label="Direccion">
            <Input value={String(form[direccionKey] ?? '')} onChange={set(direccionKey)} />
          </FormField>
        </FormGrid>
      </FormSection>
    </>
  )
}

function DetalleVentaFields({ form, set }: { form: Record<string, string | number>; set: (key: string) => (value: string | number | '') => void }) {
  return (
    <FormSection title="Detalle">
      <FormGrid>
        <FormField label="Codigo principal">
          <Input value={String(form.codigoPrincipal)} onChange={set('codigoPrincipal')} />
        </FormField>
        <FormField label="Descripcion">
          <Input value={String(form.descripcion)} onChange={set('descripcion')} />
        </FormField>
        <FormField label="Cantidad">
          <NumberInput value={Number(form.cantidad)} onChange={set('cantidad')} min={0} step={0.01} />
        </FormField>
        <FormField label="Precio unitario">
          <NumberInput value={Number(form.precioUnitario)} onChange={set('precioUnitario')} min={0} step={0.01} />
        </FormField>
        <FormField label="Descuento">
          <NumberInput value={Number(form.descuento)} onChange={set('descuento')} min={0} step={0.01} />
        </FormField>
        <FormField label="IVA">
          <Select
            value={String(form.ivaCodigo)}
            onChange={value => set('ivaCodigo')(Number(value) as CodigoIvaSri)}
            options={ivaSriOptions.map(option => ({ value: String(option.value), label: option.label }))}
          />
        </FormField>
      </FormGrid>
    </FormSection>
  )
}

function ResumenTotal({ subtotal, iva, total, labelTotal = 'Importe total' }: { subtotal: number; iva: number; total: number; labelTotal?: string }) {
  return (
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
        <p className="text-xs text-text-muted">{labelTotal}</p>
        <p className="text-sm font-semibold text-text">{total.toFixed(2)}</p>
      </div>
    </div>
  )
}
