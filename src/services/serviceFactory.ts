import { MockClienteService } from './mock/MockClienteService'
import { MockCitaService } from './mock/MockCitaService'
import { MockProductoService } from './mock/MockProductoService'
import { MockTareaService } from './mock/MockTareaService'
import { MockEstadisticaService } from './mock/MockEstadisticaService'
import { FacturacionApiService } from './api/FacturacionApiService'
import { crmConfig } from '@/config/crm.config'
import type { ServiceMode } from '@/config/crm.config'
import type {
  IClienteService,
  ICitaService,
  IProductoService,
  ITareaService,
  IEstadisticaService,
  IFacturacionService,
} from './contracts'

export interface AppServices {
  clienteService: IClienteService
  citaService: ICitaService
  productoService: IProductoService
  tareaService: ITareaService
  estadisticaService: IEstadisticaService
  facturacionService: IFacturacionService
}

export type { ServiceMode }

export function createServices(mode: ServiceMode = crmConfig.serviceMode): AppServices {
  if (mode !== 'mock') {
    throw new Error(`Modo de servicios no implementado todavia: ${mode}`)
  }

  return {
    clienteService: new MockClienteService(),
    citaService: new MockCitaService(),
    productoService: new MockProductoService(),
    tareaService: new MockTareaService(),
    estadisticaService: new MockEstadisticaService(),
    facturacionService: new FacturacionApiService(),
  }
}
