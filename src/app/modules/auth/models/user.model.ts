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

/**
 * Modelo de Programa Coordinador
 */
export interface ProgramaCoordinador {
  oidPrograma: number;
  nombre: string;
  nombreCorto: string;
  coordinadorOidUsuario: number;
  coordinadorNombre: string;
  fechaCreacion: string;
  fechaActualizacion: string | null;
  usuarioCreacion: string;
  usuarioActualizacion: string | null;
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
  programaCoordinador: ProgramaCoordinador | null;
  departamentoJefatura: Departamento | null;
  horasLaborDocente: number | null;
}
