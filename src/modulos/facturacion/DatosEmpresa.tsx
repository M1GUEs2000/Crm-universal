import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { FileSignature, Image, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Badge, Card, Form, FormActions, FormField, FormGrid, FormSection, PageHeader, Spinner } from '@/components/ui'
import { Input } from '@/components/ui/inputs'
import { facturacionService } from '@/services'
import type { ArchivoEmpresaFacturacion, EmpresaFacturacion, GuardarEmpresaFacturacionDto } from '@/types'

const logoMaxBytes = 2 * 1024 * 1024
const logoContentTypes = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])

const formVacio: GuardarEmpresaFacturacionDto = {
  ruc: '',
  nombre: '',
  nombreComercial: '',
  dirMatriz: '',
  certPassword: '',
}

function archivoToMeta(file: File): ArchivoEmpresaFacturacion {
  return {
    nombre: file.name,
    tipo: file.type || 'application/octet-stream',
    tamano: file.size,
    actualizadoEn: new Date().toISOString(),
  }
}

function formatoTamano(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function formDesdeEmpresa(empresa: EmpresaFacturacion): GuardarEmpresaFacturacionDto {
  return {
    ruc: empresa.ruc,
    nombre: empresa.nombre,
    nombreComercial: empresa.nombreComercial ?? '',
    dirMatriz: empresa.dirMatriz,
    logo: empresa.logo,
    certificadoP12: empresa.certificadoP12,
    certPassword: '',
  }
}

export default function DatosEmpresaPage({ ocultarEncabezado = false }: { ocultarEncabezado?: boolean }) {
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [empresas, setEmpresas] = useState<EmpresaFacturacion[]>([])
  const [seleccionada, setSeleccionada] = useState<EmpresaFacturacion | null>(null)
  const [form, setForm] = useState<GuardarEmpresaFacturacionDto>(formVacio)
  const [errores, setErrores] = useState<Record<string, string>>({})

  const maxEmpresas = empresas[0]?.cuenta?.maxEmpresas ?? 1
  const puedeAgregar = empresas.length < maxEmpresas

  useEffect(() => {
    async function cargar() {
      const r = await facturacionService.listarEmpresas()
      if (r.ok) {
        setEmpresas(r.datos)
        if (r.datos.length > 0) {
          setSeleccionada(r.datos[0])
          setForm(formDesdeEmpresa(r.datos[0]))
        }
      }
      setCargando(false)
    }
    cargar()
  }, [])

  function seleccionarEmpresa(empresa: EmpresaFacturacion) {
    setSeleccionada(empresa)
    setForm(formDesdeEmpresa(empresa))
    setErrores({})
  }

  function iniciarNueva() {
    setSeleccionada(null)
    setForm(formVacio)
    setErrores({})
  }

  const set = (key: keyof GuardarEmpresaFacturacionDto) => (value: string | boolean) => {
    setForm(actual => ({ ...actual, [key]: value }))
    setErrores(actual => ({ ...actual, [key]: '' }))
  }

  function setArchivo(key: 'logo' | 'certificadoP12') {
    return (file: File | null) => {
      if (!file) return

      if (key === 'logo') {
        if (!logoContentTypes.has(file.type)) {
          setErrores(actual => ({ ...actual, logo: 'Usa PNG, JPG, WEBP o SVG.' }))
          return
        }
        if (file.size > logoMaxBytes) {
          setErrores(actual => ({ ...actual, logo: 'El logo no puede superar 2 MB.' }))
          return
        }
      }

      const archivoKey = key === 'logo' ? 'logoArchivo' : 'certificadoP12Archivo'
      setForm(actual => ({ ...actual, [key]: archivoToMeta(file), [archivoKey]: file }))
      setErrores(actual => ({ ...actual, [key]: '' }))
    }
  }

  function validar() {
    const nuevos: Record<string, string> = {}
    if (!/^\d{13}$/.test(form.ruc)) nuevos.ruc = 'El RUC debe tener 13 digitos.'
    if (!form.nombre.trim()) nuevos.nombre = 'Ingresa la razon social.'
    if (!form.dirMatriz.trim()) nuevos.dirMatriz = 'Ingresa la direccion matriz.'
    if (form.logoArchivo && form.logoArchivo.size > logoMaxBytes) nuevos.logo = 'El logo no puede superar 2 MB.'
    if (!form.certificadoP12Archivo && !seleccionada?.certificadoConfigurado) nuevos.certificadoP12 = 'Sube la firma .p12.'
    if (form.certificadoP12Archivo && !form.certPassword?.trim()) nuevos.certPassword = 'Ingresa la clave de la firma.'
    setErrores(nuevos)
    return Object.keys(nuevos).length === 0
  }

  async function guardar() {
    if (!validar()) return

    setGuardando(true)
    const r = await facturacionService.guardarEmpresa(form)
    if (r.ok) {
      const existe = empresas.find(e => e.ruc === r.datos.ruc)
      const nuevaLista = existe
        ? empresas.map(e => e.ruc === r.datos.ruc ? r.datos : e)
        : [...empresas, r.datos]
      setEmpresas(nuevaLista)
      setSeleccionada(r.datos)
      setForm(actual => ({ ...actual, certPassword: '' }))
      toast.success('Datos de la empresa guardados.')
    } else {
      toast.error(r.mensaje ?? 'No se pudo guardar la empresa.')
    }
    setGuardando(false)
  }

  if (cargando) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  const tituloForm = seleccionada ? `Editar — ${seleccionada.ruc}` : 'Nueva empresa'

  return (
    <div className="flex flex-col gap-6">
      {!ocultarEncabezado && <PageHeader title="Datos de la Empresa" />}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-6">
        <Card>
          <p className="mb-4 text-xs font-medium text-text-muted uppercase tracking-wide">{tituloForm}</p>
          <Form onSubmit={guardar}>
            <FormSection title="Datos fiscales">
              <FormGrid>
                <FormField label="RUC" error={errores.ruc}>
                  <Input
                    value={form.ruc}
                    onChange={set('ruc')}
                    placeholder="1799999999001"
                    disabled={!!seleccionada}
                  />
                </FormField>
                <FormField label="Razon social" error={errores.nombre}>
                  <Input value={form.nombre} onChange={set('nombre')} />
                </FormField>
                <FormField label="Nombre comercial">
                  <Input value={form.nombreComercial ?? ''} onChange={set('nombreComercial')} />
                </FormField>
              </FormGrid>
              <FormField label="Direccion matriz" error={errores.dirMatriz}>
                <Input value={form.dirMatriz} onChange={set('dirMatriz')} />
              </FormField>
            </FormSection>

            <FormSection title="Archivos">
              <FormGrid>
                <FileField
                  label="Imagen / logo"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  icon={<Image size={18} />}
                  archivo={form.logo}
                  error={errores.logo}
                  onChange={setArchivo('logo')}
                />
                <FileField
                  label="Firma electronica .p12"
                  accept=".p12,application/x-pkcs12"
                  icon={<FileSignature size={18} />}
                  archivo={form.certificadoP12}
                  error={errores.certificadoP12}
                  onChange={setArchivo('certificadoP12')}
                />
              </FormGrid>
              <FormField label="Clave de firma .p12" error={errores.certPassword}>
                <Input
                  type="password"
                  value={form.certPassword ?? ''}
                  onChange={set('certPassword')}
                  placeholder={seleccionada?.certificadoConfigurado ? 'Firma ya configurada' : ''}
                />
              </FormField>
            </FormSection>

            <FormActions submitText="Guardar datos" loading={guardando} />
          </Form>
        </Card>

        <aside className="flex flex-col gap-3">
          {empresas.map(empresa => (
            <button
              key={empresa.ruc}
              type="button"
              onClick={() => seleccionarEmpresa(empresa)}
              className={`w-full rounded-card border p-4 text-left transition-colors ${
                seleccionada?.ruc === empresa.ruc
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-surface hover:bg-background'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-xs font-medium text-text-muted">Estado</p>
                <Badge variant={empresa.certificadoConfigurado ? 'success' : 'warning'}>
                  {empresa.certificadoConfigurado ? 'Lista' : 'Pendiente'}
                </Badge>
              </div>
              <InfoLine label="RUC" value={empresa.ruc} />
              <InfoLine label="Nombre" value={empresa.nombre} />
              <InfoLine label="Logo" value={empresa.logo?.nombre ?? 'Sin archivo'} />
              <InfoLine label="Firma" value={empresa.certificadoP12?.nombre ?? 'Sin archivo'} />
            </button>
          ))}

          {puedeAgregar && (
            <button
              type="button"
              onClick={iniciarNueva}
              className={`w-full rounded-card border border-dashed p-4 text-left transition-colors ${
                seleccionada === null && empresas.length > 0
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-surface hover:bg-background'
              }`}
            >
              <div className="flex items-center gap-2">
                <Plus size={16} className="text-text-muted" />
                <p className="text-sm font-medium text-text">Agregar datos</p>
              </div>
              <p className="mt-1 text-xs text-text-muted">
                {empresas.length} de {maxEmpresas} cuentas usadas
              </p>
            </button>
          )}
        </aside>
      </div>
    </div>
  )
}

function FileField({ label, accept, icon, archivo, error, onChange }: {
  label: string
  accept: string
  icon: ReactNode
  archivo?: ArchivoEmpresaFacturacion
  error?: string
  onChange: (file: File | null) => void
}) {
  return (
    <FormField label={label} error={error}>
      <label className="flex min-h-24 cursor-pointer flex-col justify-center gap-2 rounded-input border border-dashed border-border bg-surface px-4 py-3 text-sm text-text transition-colors hover:bg-background">
        <span className="flex items-center gap-2 font-medium">
          {icon}
          Seleccionar archivo
        </span>
        <span className="text-xs text-text-muted">
          {archivo ? `${archivo.nombre} · ${formatoTamano(archivo.tamano)}` : 'Ningun archivo seleccionado'}
        </span>
        <input
          type="file"
          accept={accept}
          className="sr-only"
          onChange={event => onChange(event.target.files?.[0] ?? null)}
        />
      </label>
    </FormField>
  )
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-border pt-2 mt-2 first:border-t-0 first:pt-0 first:mt-0">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="break-words text-sm font-medium text-text">{value}</p>
    </div>
  )
}
