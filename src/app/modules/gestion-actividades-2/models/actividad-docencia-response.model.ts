import {
  Actividad,
  UsuarioActividadAsignacion,
  UsuarioEnActividad,
} from './actividad.model';

export interface ActividadDocenciaResponse {
  actividad: Actividad;
  usuarios: UsuarioEnActividad[];
  usuariosActividad?: UsuarioActividadAsignacion[];
  oidCalendario: number;
  nombreCalendario: string;

  necesidad: NecesidadDocencia;
  materia: MateriaDocencia;
  asignacion: AsignacionDocencia;
  cargaHorariaDocencia: any | null;
  asignatura: any | null;
}

// ===== INTERFACES AUXILIARES =====

export interface NecesidadDocencia {
  oidNecesidad: number;
  oidCalendario: number;
  anioCalendario: string;
  numeroCalendario: number;
  idMateria: number;
  oidMateria: string;
  codigoMateria: string;
  nombreMateria: string;
  semestreMateria: number;
  materia: MateriaDocencia;
  grupo: string;
  cupo: number;
  estado: string;
  estadoDescripcion: string;
  correquisitoOidNecesidad: number | null;
  correquisitoNombreMateria: string | null;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaActualizacion: string;
  usuarioActualizacion: string;
}

export interface MateriaDocencia {
  idMateria: number;
  oidMateria: string;
  codigo: string;
  nombre: string;
  semestre: number;
  horasSemana: number;
  oidDepartamento: number;
  nombreDepartamento: string;
  oidPlan: number;
  numeroPlan: string;
  idCorrequisito: number | null;
  oidCorrequisito: string | null;
  nombreCorrequisito: string | null;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaActualizacion: string;
  usuarioActualizacion: string;
}

export interface AsignacionDocencia {
  oidAsignacion: number;
  oidNecesidad: number;
  oidSeleccionado: number;
  oidActividad: number;
  horasDocencia: number;
  semanasDocencia: number;
  horasPreparacion: number;
  semanasPreparacion: number;
  nombreActividad: string;
  nombreDocente: string;
  codigoMateria: string;
  nombreMateria: string;
  grupo: string;
  numeroCalendario: number;
  anioCalendario: string;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaActualizacion: string;
  usuarioActualizacion: string;
}
