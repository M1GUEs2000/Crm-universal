import { Badge, Card, PageHeader } from '@/components/ui'
import { crmConfig } from '@/config/crm.config'
import { appModules } from '@/config/moduleRegistry'

function estadoModulo(module: { enabled: boolean; locked?: boolean }) {
  if (module.locked) return { label: 'Bloqueado', variant: 'warning' as const }
  if (module.enabled) return { label: 'Activo', variant: 'success' as const }
  return { label: 'Inactivo', variant: 'default' as const }
}

export default function ConfiguracionPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Configuracion" />

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-xs text-text-muted mb-1">Nombre</dt>
            <dd className="text-sm font-medium text-text">{crmConfig.appName}</dd>
          </div>
          <div>
            <dt className="text-xs text-text-muted mb-1">Nombre corto</dt>
            <dd className="text-sm font-medium text-text">{crmConfig.shortName}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-text-muted mb-1">Descripcion</dt>
            <dd className="text-sm text-text">{crmConfig.description}</dd>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-text">Modulos</h2>
          <div className="divide-y divide-border">
            {appModules.map(module => {
              const estado = estadoModulo(module)
              return (
                <div key={module.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-text">{module.label}</p>
                    <p className="text-xs text-text-muted">{module.path}</p>
                  </div>
                  <Badge variant={estado.variant}>{estado.label}</Badge>
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}
