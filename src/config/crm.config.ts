export type ModuleVisibility = 'enabled' | 'disabled' | 'locked'
export type ServiceMode = 'mock' | 'api'

export interface CrmModuleOverride {
  label?: string
  visibility?: ModuleVisibility
}

export interface CrmCompany {
  id: string
  nombre: string
  ruc: string
  estab: string
  ptoEmi: string
}

export interface CrmConfig {
  appName: string
  shortName: string
  description: string
  serviceMode: ServiceMode
  defaultCompanyId: string
  companies: CrmCompany[]
  modules: Record<string, CrmModuleOverride>
}

export const crmConfig: CrmConfig = {
  appName: 'CRM Universal',
  shortName: 'CRM',
  description: 'Plantilla base para construir CRMs modulares.',
  serviceMode: 'mock',
  defaultCompanyId: 'matriz',
  companies: [
    { id: 'matriz', nombre: 'Empresa Matriz', ruc: '1799999999001', estab: '001', ptoEmi: '001' },
    { id: 'sucursal-norte', nombre: 'Sucursal Norte', ruc: '1799999999002', estab: '002', ptoEmi: '001' },
    { id: 'sucursal-sur', nombre: 'Sucursal Sur', ruc: '1799999999003', estab: '003', ptoEmi: '001' },
  ],
  modules: {
    dashboard: { visibility: 'enabled' },
    clientes: { visibility: 'enabled' },
    calendario: { visibility: 'enabled' },
    citas: { visibility: 'enabled' },
    productos: { visibility: 'enabled' },
    estadisticas: { visibility: 'enabled' },
    facturacion: { visibility: 'enabled' },
    configuracion: { visibility: 'enabled' },
    administrador: { visibility: 'enabled' },
  },
}
