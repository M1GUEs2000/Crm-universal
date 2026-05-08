import { MockClienteService } from './mock/MockClienteService'
import { MockCitaService } from './mock/MockCitaService'
import { MockProductoService } from './mock/MockProductoService'
import { MockTareaService } from './mock/MockTareaService'
import { MockEstadisticaService } from './mock/MockEstadisticaService'

// Para conectar a una API real: reemplazar cada Mock por la implementación HTTP correspondiente.
export const clienteService = new MockClienteService()
export const citaService = new MockCitaService()
export const productoService = new MockProductoService()
export const tareaService = new MockTareaService()
export const estadisticaService = new MockEstadisticaService()
