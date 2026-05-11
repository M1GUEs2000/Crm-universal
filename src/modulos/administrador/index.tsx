import { useState } from 'react'
import { Badge, Button, Card, PageHeader } from '@/components/ui'
import { Select, Toggle } from '@/components/ui/inputs'
import { crmConfig } from '@/config/crm.config'
import { getSelectedCompany, getSelectedCompanyId, setSelectedCompanyId } from '@/config/companyPreferences'
import { resetStoredModuleVisibilities, setStoredModuleVisibility } from '@/config/modulePreferences'
import { resolveAppModules } from '@/config/moduleRegistry'
import type { AppModule } from '@/config/moduleRegistry'

const systemModules = new Set(['dashboard', 'configuracion', 'administrador'])

function estadoModulo(module: AppModule) {
  if (module.locked) return { label: 'Bloqueado', variant: 'warning' as const }
  if (module.enabled) return { label: 'Activo', variant: 'success' as const }
  return { label: 'Inactivo', variant: 'default' as const }
}

export default function AdministradorPage() {
  const [modules, setModules] = useState(() => resolveAppModules())
  const [companyId, setCompanyId] = useState(() => getSelectedCompanyId())
  const activeModules = modules.filter(module => module.enabled).length
  const selectedCompany = getSelectedCompany()

  const companyOptions = crmConfig.companies.map(company => ({
    value: company.id,
    label: company.nombre,
  }))

  function refreshModules() {
    setModules(resolveAppModules())
  }

  function toggleModule(moduleId: string, checked: boolean) {
    setStoredModuleVisibility(moduleId, checked ? 'enabled' : 'disabled')
    refreshModules()
  }

  function resetModules() {
    resetStoredModuleVisibilities()
    refreshModules()
  }

  function selectCompany(value: string) {
    setSelectedCompanyId(value)
    setCompanyId(value)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Administrador"
        action={(
          <Button variant="secondary" onClick={resetModules}>
            Restablecer
          </Button>
        )}
      />

      <Card>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <Select
            label="Empresa"
            value={companyId}
            onChange={selectCompany}
            options={companyOptions}
          />

          <div className="rounded-card bg-background px-4 py-3">
            <p className="text-xs text-text-muted">RUC</p>
            <p className="text-sm font-medium text-text">{selectedCompany.ruc}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold text-text">Modulos actuales</h2>
            <Badge variant="info">{activeModules} activos</Badge>
          </div>

          <div className="divide-y divide-border">
            {modules.map(module => {
              const Icon = module.icon
              const estado = estadoModulo(module)
              const isSystemModule = systemModules.has(module.id)

              return (
                <div key={module.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-card bg-background text-text-muted">
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-text">{module.label}</p>
                        <Badge variant={estado.variant}>{estado.label}</Badge>
                      </div>
                      <p className="truncate text-xs text-text-muted">{module.path}</p>
                    </div>
                  </div>

                  <Toggle
                    checked={module.enabled}
                    disabled={isSystemModule}
                    ariaLabel={`${module.enabled ? 'Desactivar' : 'Activar'} ${module.label}`}
                    onChange={checked => toggleModule(module.id, checked)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}
