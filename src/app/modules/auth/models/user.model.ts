/**
 * Modelo de Departamento
 */
export interface Departamento {
  oidDepartamento: number;
  nombre: string;
  facultad: string;
  jefeOidUsuario: number | null;
  jefeNombre: string | null;
  fechaCreacion: string | null;
  fechaActualizacion: string | null;
  usuarioCreacion: string | null;
  usuarioActualizacion: string | null;
}

/**
 * Modelo de Rol
 */
export interface Rol {
  nombre: string;
}

/**
 * Modelo de Detalle de Usuario
 */
export interface UsuarioDetalle {
  oidUsuarioDetalle: number;
  facultad: string;
  departamento: string;
  programa: string | null;
  categoria: string;
  contratacion: string;
  dedicacion: string;
  estudios: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface ProgramaCoordinador {
  coordinadorNombre: string;
  coordinadorOidUsuario: number;
  fechaActualizacion: string | null;
  fechaCreacion: string;
  nombre: string;
  nombreCorto: string;
  oidPrograma: number;
  usuarioActualizacion: string | null;
  usuarioCreacion: string;
}

/**
 * Modelo principal de Usuario
 */
export interface UserData {
  oidUsuario: number;
  identificacion: string;
  nombres: string;
  apellidos: string;
  departamento: Departamento;
  roles: Rol[];
  usuarioDetalle: UsuarioDetalle;
  programaCoordinador: ProgramaCoordinador;
  departamentoJefatura: any;
}
