export type { ID, Paginacion, RespuestaApi, RespuestaPaginada } from './comun'
export type { Cliente, CrearClienteDto, ActualizarClienteDto, EstadoCliente } from './cliente'
export type { Cita, CrearCitaDto, ActualizarCitaDto, EstadoCita } from './cita'
export type { Producto, CrearProductoDto, ActualizarProductoDto, TipoProducto } from './producto'
export type { Tarea, CrearTareaDto, ActualizarTareaDto, EstadoTarea, PrioridadTarea } from './tarea'
export type { KpiCard, PuntoGrafico, ResumenDashboard } from './estadistica'
export type {
  AmbienteFacturacion,
  DetalleDocumentoRequest,
  DocumentoFacturacion,
  EmitirFacturaDto,
  EmitirNotaCreditoDto,
  EmitirRetencionDto,
  EstadoSriDocumento,
  TipoDocumentoFacturacion,
} from './facturacion'
