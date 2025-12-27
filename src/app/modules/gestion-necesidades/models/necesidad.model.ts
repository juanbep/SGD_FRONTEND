import { BaseResponse, PaginatedResponse } from '../shared/shared.model';

// ========== ENTIDADES BASE ==========

export interface Materia {
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

// ========== NECESIDAD ==========

export interface NecesidadResponse {
  oidNecesidad: number;
  oidCalendario: number;
  anioCalendario: string;
  numeroCalendario: number;
  idMateria: number;
  oidMateria: string;
  codigoMateria: string;
  nombreMateria: string;
  semestreMateria: number;
  materia: Materia;
  grupo: string;
  cupo: number;
  estado: string;
  estadoDescripcion: string;
  correquisitoOidNecesidad: number | null;
  correquisitoNombreMateria: string | null;
  fechaCreacion: string | null;
  usuarioCreacion: string;
  fechaActualizacion: string | null;
  usuarioActualizacion: string;
}

// ========== DTOs PARA CREAR/ACTUALIZAR ==========

export interface CreateNecesidadDTO {
  oidCalendario: number;
  idMateria: number;
  grupo: string;
  cupo: number;
  correquisitoOidNecesidad?: number | null;
}

export interface UpdateNecesidadDTO extends Partial<CreateNecesidadDTO> {
  oidNecesidad: number;
}

export interface DeleteNecesidadDTO {
  oidNecesidad: number;
}

// ========== CREACIÓN EN LOTE ==========

export interface NecesidadLoteItem {
  idMateria: number;
  cantidadGrupos: number;
  cupo: number;
}

export interface CreateNecesidadLoteDTO {
  oidCalendario: number;
  necesidades: NecesidadLoteItem[];
}

export interface NecesidadLoteResultado {
  idMateria: number;
  nombreMateria: string;
  gruposCreados: string[];
  exitoso: boolean;
  mensaje?: string;
}

export interface CreateNecesidadLoteResponse {
  codigo: number;
  mensaje: string;
  data: NecesidadLoteResultado[];
}

// ========== FILTROS ==========

export interface NecesidadFilters {
  page?: number;
  size?: number;
  sort?: string;
  oidCalendario: number | string; // Obligatorio
  oidPrograma: number | string; // Obligatorio
  oidDepartamento?: number | string;
  estado?: string;
  idMateria?: number | string;
  nombreMateria?: string;
  semestreMateria?: number | string;
  codigoMateria?: string;
}

// ========== RESPONSE PARA DELETE ==========

export interface DeleteNecesidadData {
  oid: number;
  mensaje: string;
}

// ========== RESPONSE TYPES ==========

export type NecesidadesListResponse = BaseResponse<
  PaginatedResponse<NecesidadResponse>
>;
export type GetNecesidadResponse = BaseResponse<NecesidadResponse>;
export type CreateNecesidadResponse = BaseResponse<NecesidadResponse>;
export type UpdateNecesidadResponse = BaseResponse<NecesidadResponse>;
export type DeleteNecesidadResponse = BaseResponse<DeleteNecesidadData>;
