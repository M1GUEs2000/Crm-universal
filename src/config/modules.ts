export interface ModuleConfig {
  id: string
  label: string
  path: string
  enabled: boolean
  locked?: boolean
}

export const modules: ModuleConfig[] = [
  { id: 'dashboard',     label: 'Dashboard',      path: '/',              enabled: true  },
  { id: 'clientes',      label: 'Clientes',        path: '/clientes',      enabled: true  },
  { id: 'calendario',    label: 'Calendario',      path: '/calendario',    enabled: true  },
  { id: 'citas',         label: 'Citas',           path: '/citas',         enabled: true  },
  { id: 'productos',     label: 'Productos',       path: '/productos',     enabled: true  },
  { id: 'estadisticas',  label: 'Estadísticas',    path: '/estadisticas',  enabled: true  },
  { id: 'facturacion',   label: 'Facturación',     path: '/facturacion',   enabled: false, locked: true },
  { id: 'configuracion', label: 'Configuración',   path: '/configuracion', enabled: true  },
]

export function getActiveModules() {
  return modules.filter(m => m.enabled)
}
