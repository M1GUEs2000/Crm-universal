import { createServices } from './serviceFactory'

export type { AppServices, ServiceMode } from './serviceFactory'
export type {
  IClienteService,
  ICitaService,
  IProductoService,
  ITareaService,
  IEstadisticaService,
  IFacturacionService,
} from './contracts'

const services = createServices()

export const {
  clienteService,
  citaService,
  productoService,
  tareaService,
  estadisticaService,
  facturacionService,
} = services
