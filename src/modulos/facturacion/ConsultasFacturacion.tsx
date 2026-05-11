import { useEffect, useMemo, useState } from 'react'
import { Badge, Card, PageHeader, Spinner, Table } from '@/components/ui'
import type { TableColumn } from '@/components/ui'
import { SearchInput, Select } from '@/components/ui/inputs'
import { facturacionService } from '@/services'
import type { DocumentoFacturacion, EstadoSriDocumento, TipoDocumentoFacturacion } from '@/types'
import { estadoSriVariant, formatoMoneda, tipoDocumentoLabel } from './config'

const tipoOptions = [
  { value: 'factura', label: 'Facturas' },
  { value: 'nota_credito', label: 'Notas de credito' },
  { value: 'retencion', label: 'Retenciones' },
]

const estadoOptions = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'recibida', label: 'Recibida' },
  { value: 'autorizada', label: 'Autorizada' },
  { value: 'rechazada', label: 'Rechazada' },
]

const columns: TableColumn<DocumentoFacturacion>[] = [
  {
    key: 'tipo',
    header: 'Tipo',
    render: documento => tipoDocumentoLabel[documento.tipo],
  },
  {
    key: 'numero',
    header: 'Numero',
  },
  {
    key: 'fechaEmision',
    header: 'Fecha',
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
  {
    key: 'claveAcceso',
    header: 'Clave acceso',
    render: documento => (
      <span className="block max-w-[220px] truncate text-xs text-text-muted">
        {documento.claveAcceso ?? '-'}
      </span>
    ),
  },
]

export default function ConsultasFacturacionPage() {
  const [documentos, setDocumentos] = useState<DocumentoFacturacion[]>([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [tipo, setTipo] = useState('')
  const [estado, setEstado] = useState('')

  useEffect(() => {
    async function cargar() {
      setCargando(true)
      const r = await facturacionService.listar()
      if (r.ok) setDocumentos(r.datos)
      setCargando(false)
    }

    cargar()
  }, [])

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    return documentos.filter(documento => {
      const coincideTexto = !texto || [
        documento.numero,
        documento.razonSocial,
        documento.identificacion,
        documento.claveAcceso,
        documento.numeroAutorizacion,
      ].filter(Boolean).join(' ').toLowerCase().includes(texto)
      const coincideTipo = !tipo || documento.tipo === tipo as TipoDocumentoFacturacion
      const coincideEstado = !estado || documento.estadoSri === estado as EstadoSriDocumento
      return coincideTexto && coincideTipo && coincideEstado
    })
  }, [busqueda, documentos, estado, tipo])

  if (cargando) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Consultas" />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchInput
            value={busqueda}
            onChange={setBusqueda}
            placeholder="Buscar por numero, razon social, identificacion o clave..."
            ariaLabel="Buscar documentos electronicos"
          />
        </div>
        <Select value={tipo} onChange={setTipo} placeholder="Todos los tipos" options={tipoOptions} />
        <Select value={estado} onChange={setEstado} placeholder="Todos los estados" options={estadoOptions} />
      </div>

      <Card padding="none">
        <Table
          columns={columns}
          data={filtrados}
          keyExtractor={documento => documento.id}
          emptyText="No se encontraron documentos."
        />
      </Card>
    </div>
  )
}
