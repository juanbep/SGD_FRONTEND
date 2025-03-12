//Interface que define la estructura que tiene la respuesta del servicio para obtener los usuarios con colidado creado
export interface UsuarioConsolidadoCreadoResponse {
  oidUsuario: number;
  nombreDocente: string;
  numeroIdentificacion: string;
  facultad: string;
  departamento: string;
  categoria: string;
  tipoContratacion: string;
  dedicacion: string;
  nombreArchivo: string;
  rutaArchivo: string;
}
