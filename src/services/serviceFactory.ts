import { MockClienteService } from './mock/MockClienteService'
import { MockCitaService } from './mock/MockCitaService'
import { MockProductoService } from './mock/MockProductoService'
import { MockTareaService } from './mock/MockTareaService'
import { MockEstadisticaService } from './mock/MockEstadisticaService'
import type {
  IClienteService,
  ICitaService,
  IProductoService,
  ITareaService,
  IEstadisticaService,
} from './contracts'

export interface AppServices {
  clienteService: IClienteService
  citaService: ICitaService
  productoService: IProductoService
  tareaService: ITareaService
  estadisticaService: IEstadisticaService
}

export type ServiceMode = 'mock'

export function createServices(mode: ServiceMode = 'mock'): AppServices {
  if (mode !== 'mock') {
    throw new Error(`Modo de servicios no soportado: ${mode}`)
  }

  return {
    clienteService: new MockClienteService(),
    citaService: new MockCitaService(),
    productoService: new MockProductoService(),
    tareaService: new MockTareaService(),
    estadisticaService: new MockEstadisticaService(),
  }
}
