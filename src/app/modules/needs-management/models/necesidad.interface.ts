/**
 * Entidad Necesidad del backend
 */
export interface Necesidad {
  oidNecesidad: number;
  oidCalendario: number;
  anioCalendario: string;
  numeroCalendario: number;
  idMateria: number;
  oidMateria: string;
  codigoMateria: string;
  nombreMateria: string;
  semestreMateria: number;
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
