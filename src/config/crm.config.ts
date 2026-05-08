export type ModuleVisibility = 'enabled' | 'disabled' | 'locked'

export interface CrmModuleOverride {
  label?: string
  visibility?: ModuleVisibility
}

export interface CrmConfig {
  appName: string
  shortName: string
  description: string
  modules: Record<string, CrmModuleOverride>
}

export const crmConfig: CrmConfig = {
  appName: 'CRM Universal',
  shortName: 'CRM',
  description: 'Plantilla base para construir CRMs modulares.',
  modules: {
    dashboard: { visibility: 'enabled' },
    clientes: { visibility: 'enabled' },
    calendario: { visibility: 'enabled' },
    citas: { visibility: 'enabled' },
    productos: { visibility: 'enabled' },
    estadisticas: { visibility: 'enabled' },
    facturacion: { visibility: 'locked' },
    configuracion: { visibility: 'enabled' },
  },
}
