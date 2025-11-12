import { BaseResponse } from '../shared/shared.model';
import { UsuarioDepartamento } from './usuario-departamento.model';

// Reutilizamos la interfaz UsuarioDepartamento ya creada

// Filtros para búsqueda (sin paginación)
export interface UsuariosConActividadesFilters {
  // Búsqueda general
  searchTerm?: string;

  // Filtros por usuario
  identificacion?: string;
  nombres?: string;
  apellidos?: string;

  // Filtros por departamento
  oidDepartamento?: number;
  nombreDepartamento?: string;

  // Filtros por detalles de usuario
  facultad?: string;
  categoria?: string;
  contratacion?: string;
  dedicacion?: string;
  estudios?: string;

  // Filtros por rol
  rolNombre?: string;

  // Filtros por horas
  minHorasActividades?: number;
  maxHorasActividades?: number;

  // Ordenamiento
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Tipo de respuesta API (sin paginación)
export type UsuariosConActividadesResponse = BaseResponse<UsuarioDepartamento[]>;
