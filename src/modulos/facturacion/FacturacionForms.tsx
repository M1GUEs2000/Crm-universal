import { useState } from 'react'
import { Form, FormActions, FormField, FormGrid, FormSection } from '@/components/ui'
import { Input, NumberInput, Select, Textarea } from '@/components/ui/inputs'
import { getSelectedCompany } from '@/config/companyPreferences'
import type { AmbienteFacturacion, EmitirFacturaDto, EmitirNotaCreditoDto, EmitirRetencionDto } from '@/types'

const ambienteOptions = [
  { value: 'pruebas', label: 'Pruebas' },
  { value: 'produccion', label: 'Produccion' },
]

const identificacionOptions = [
  { value: '04', label: 'RUC' },
  { value: '05', label: 'Cedula' },
  { value: '06', label: 'Pasaporte' },
  { value: '07', label: 'Consumidor final' },
]

const ivaOptions = [
  { value: '0', label: '0%' },
  { value: '12', label: '12%' },
  { value: '15', label: '15%' },
]

function crearBaseDocumento() {
  const company = getSelectedCompany()

  return {
    empresaRuc: company.ruc,
    ambiente: 'pruebas' as AmbienteFacturacion,
    estab: company.estab,
    ptoEmi: company.ptoEmi,
    secuencial: '000000002',
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

export function FacturaForm({ onEmitir }: Props<EmitirFacturaDto>) {
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState({
    ...crearBaseDocumento(),
    tipoIdentificacionComprador: '05',
    identificacionComprador: '9999999999',
    razonSocialComprador: 'Cliente Demo',
    direccionComprador: '',
    formaPago: '01',
    codigoPrincipal: 'SERV-001',
    descripcion: 'Servicio profesional',
    cantidad: 1,
    precioUnitario: 100,
    descuento: 0,
    ivaTarifa: 12,
  })

  const set = (key: string) => (value: string | number | '') => setForm(actual => ({ ...actual, [key]: value }))
  const totales = totalDetalle(Number(form.cantidad), Number(form.precioUnitario), Number(form.descuento), Number(form.ivaTarifa))

  async function handleSubmit() {
    setGuardando(true)
    await onEmitir({
      ...form,
      cantidad: undefined,
      precioUnitario: undefined,
      descuento: undefined,
      ivaTarifa: undefined,
      totalSinImpuestos: totales.subtotal,
      totalDescuento: Number(form.descuento),
      valorIva: totales.iva,
      importeTotal: totales.total,
      detalle: {
        codigoPrincipal: form.codigoPrincipal,
        descripcion: form.descripcion,
        cantidad: Number(form.cantidad),
        precioUnitario: Number(form.precioUnitario),
        descuento: Number(form.descuento),
        ivaTarifa: Number(form.ivaTarifa),
      },
    } as EmitirFacturaDto)
    setGuardando(false)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <DocumentoBaseFields form={form} set={set} sujeto="Comprador" />
      <DetalleVentaFields form={form} set={set} />
      <ResumenTotal subtotal={totales.subtotal} iva={totales.iva} total={totales.total} />
      <FormActions submitText="Emitir factura" loading={guardando} />
    </Form>
  )
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
    ivaTarifa: 12,
  })

  const set = (key: string) => (value: string | number | '') => setForm(actual => ({ ...actual, [key]: value }))
  const totales = totalDetalle(Number(form.cantidad), Number(form.precioUnitario), Number(form.descuento), Number(form.ivaTarifa))

  async function handleSubmit() {
    setGuardando(true)
    await onEmitir({
      ...form,
      cantidad: undefined,
      precioUnitario: undefined,
      descuento: undefined,
      ivaTarifa: undefined,
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
        ivaTarifa: Number(form.ivaTarifa),
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
  const [form, setForm] = useState({
    ...crearBaseDocumento(),
    secuencial: '000000002',
    tipoIdentificacionSujeto: '04',
    identificacionSujeto: '0999999999001',
    razonSocialSujeto: 'Proveedor Demo',
    direccionSujeto: '',
    periodoFiscal: '05/2026',
    codigoImpuesto: '1',
    codigoRetencion: '332',
    codDocSustento: '01',
    numDocSustento: '001-001-000000001',
    fechaEmisionDocSustento: new Date().toISOString().slice(0, 10),
    totalBaseImponible: 100,
    totalRetencionRenta: 10,
    totalRetencionIva: 0,
  })

  const set = (key: string) => (value: string | number | '') => setForm(actual => ({ ...actual, [key]: value }))
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
            <Input value={form.codigoImpuesto} onChange={set('codigoImpuesto')} />
          </FormField>
          <FormField label="Codigo retencion">
            <Input value={form.codigoRetencion} onChange={set('codigoRetencion')} />
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
            <Select value={String(form.ambiente)} onChange={set('ambiente')} options={ambienteOptions} />
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
            <Select value={String(form[tipoKey])} onChange={set(tipoKey)} options={identificacionOptions} />
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
          <Select value={String(form.ivaTarifa)} onChange={set('ivaTarifa')} options={ivaOptions} />
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
