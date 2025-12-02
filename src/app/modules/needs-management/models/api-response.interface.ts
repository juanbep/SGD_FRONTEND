/**
 * Respuesta estándar de la API
 */
export interface ApiResponse<T> {
  codigo: number;
  mensaje: string;
  data: T;
}
