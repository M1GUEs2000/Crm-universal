export type ID = string

export interface Paginacion {
  pagina: number
  porPagina: number
  total: number
}

export interface RespuestaApi<T> {
  datos: T
  ok: boolean
  mensaje?: string
}

export interface RespuestaPaginada<T> extends RespuestaApi<T[]> {
  paginacion: Paginacion
}
