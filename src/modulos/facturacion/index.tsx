import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Badge, Card, PageHeader, Spinner, Table, Tabs } from '@/components/ui'
import type { TableColumn } from '@/components/ui'
import { facturacionService } from '@/services'
import type { DocumentoFacturacion, EmitirFacturaDto, EmitirNotaCreditoDto, EmitirRetencionDto, TipoDocumentoFacturacion } from '@/types'
import { estadoSriVariant, facturacionTabs, filtrarDocumentos, formatoMoneda, tipoDocumentoLabel } from './config'
import { FacturaForm, NotaCreditoForm, RetencionForm } from './FacturacionForms'

function numeroConFallback(documento: DocumentoFacturacion) {
  return documento.numero || '-'
}

const columns: TableColumn<DocumentoFacturacion>[] = [
  {
    key: 'tipo',
    header: 'Tipo',
    render: documento => tipoDocumentoLabel[documento.tipo],
  },
  {
    key: 'numero',
    header: 'Numero',
    render: numeroConFallback,
  },
  {
    key: 'fechaEmision',
    header: 'Fecha',
    render: documento => documento.fechaEmision,
  },
  {
    key: 'razonSocial',
    header: 'Razon social',
    render: documento => (
      <div>
        <p className="font-medium text-text">{documento.razonSocial}</p>
        <p className="text-xs text-text-muted">{documento.identificacion}</p>
      </div>
    ),
  },
  {
    key: 'total',
    header: 'Total',
    render: documento => formatoMoneda(documento.total),
  },
  {
    key: 'estadoSri',
    header: 'Estado SRI',
    render: documento => <Badge variant={estadoSriVariant[documento.estadoSri]}>{documento.estadoSri}</Badge>,
  },
]

function DocumentosTable({ documentos, tipo }: { documentos: DocumentoFacturacion[]; tipo: TipoDocumentoFacturacion }) {
  const filtrados = filtrarDocumentos(documentos, tipo)

  return (
    <Table
      columns={columns}
      data={filtrados}
      keyExtractor={documento => documento.id}
      emptyText={`No hay ${tipoDocumentoLabel[tipo].toLowerCase()}s emitidas.`}
    />
  )
}

export default function FacturacionPage() {
  const [documentos, setDocumentos] = useState<DocumentoFacturacion[]>([])
  const [cargando, setCargando] = useState(true)

  async function cargar() {
    setCargando(true)
    const r = await facturacionService.listar()
    if (r.ok) setDocumentos(r.datos)
    setCargando(false)
  }

  useEffect(() => { cargar() }, [])

  async function emitirFactura(dto: EmitirFacturaDto) {
    await toast.promise(
      facturacionService.emitirFactura(dto).then(r => {
        if (!r.ok) throw new Error(r.mensaje ?? 'No se pudo emitir la factura.')
        return r.datos
      }),
      {
        loading: 'Enviando factura al SRI...',
        success: datos => `Factura ${datos.numero} emitida — ${datos.estadoSri}`,
        error: err => err.message,
      },
    )
    await cargar()
  }

  async function emitirNotaCredito(dto: EmitirNotaCreditoDto) {
    await toast.promise(
      facturacionService.emitirNotaCredito(dto).then(r => {
        if (!r.ok) throw new Error(r.mensaje ?? 'No se pudo emitir la nota de credito.')
        return r.datos
      }),
      {
        loading: 'Enviando nota de credito al SRI...',
        success: datos => `Nota de credito ${datos.numero} emitida — ${datos.estadoSri}`,
        error: err => err.message,
      },
    )
    await cargar()
  }

  async function emitirRetencion(dto: EmitirRetencionDto) {
    await toast.promise(
      facturacionService.emitirRetencion(dto).then(r => {
        if (!r.ok) throw new Error(r.mensaje ?? 'No se pudo emitir la retencion.')
        return r.datos
      }),
      {
        loading: 'Enviando retencion al SRI...',
        success: datos => `Retencion ${datos.numero} emitida — ${datos.estadoSri}`,
        error: err => err.message,
      },
    )
    await cargar()
  }

  if (cargando) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Documentos electronicos" />

      <Tabs
        tabs={facturacionTabs.map(tab => {
          if (tab.key === 'facturas') {
            return {
              key: tab.key,
              label: tab.label,
              content: (
                <DocumentoPanel
                  form={<FacturaForm onEmitir={emitirFactura} />}
                  table={<DocumentosTable documentos={documentos} tipo="factura" />}
                />
              ),
            }
          }

          if (tab.key === 'notas-credito') {
            return {
              key: tab.key,
              label: tab.label,
              content: (
                <DocumentoPanel
                  form={<NotaCreditoForm onEmitir={emitirNotaCredito} />}
                  table={<DocumentosTable documentos={documentos} tipo="nota_credito" />}
                />
              ),
            }
          }

          return {
            key: tab.key,
            label: tab.label,
            content: (
              <DocumentoPanel
                form={<RetencionForm onEmitir={emitirRetencion} />}
                table={<DocumentosTable documentos={documentos} tipo="retencion" />}
              />
            ),
          }
        })}
      />
    </div>
  )
}

function DocumentoPanel({ form, table }: { form: React.ReactNode; table: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(360px,480px)_1fr] gap-6">
      <Card>
        {form}
      </Card>
      <Card padding="none">
        {table}
      </Card>
    </div>
  )
}
