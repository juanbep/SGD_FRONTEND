import { EstadoCalendario } from '../../gestion-calendarios/models';
import { ActividadResponse, PaginationConfig } from '../models';

/**
 * Estados de actividades académicas
 */
export interface EstadoActividad {
  oid: number;
  nombre: string;
  class: string;
}

/**
 * Opción para dropdowns de ng-select
 */
export interface EstadoActividadDropdown {
  value: number | string;
  label: string;
}

/**
 * Estados de actividad con información completa
 */
export const ESTADOS_ACTIVIDAD: readonly EstadoActividad[] = [
  { oid: 1, nombre: 'ACTIVA', class: 'bg-success' },
  { oid: 2, nombre: 'INACTIVA', class: 'bg-danger' },
  { oid: 3, nombre: 'INCOMPLETA', class: 'bg-warning' },
] as const;

/**
 * Estados para filtros (incluye opción "TODOS")
 */
export const ESTADOS_ACTIVIDAD_FILTRO: readonly EstadoActividadDropdown[] = [
  { value: '', label: 'TODOS' },
  { value: 1, label: 'ACTIVA' },
  { value: 2, label: 'INACTIVA' },
  { value: 3, label: 'INCOMPLETA' },
] as const;

/**
 * Estados para edición/creación (sin opción "TODOS")
 */
export const ESTADOS_ACTIVIDAD_DROPDOWN: readonly EstadoActividadDropdown[] = [
  { value: 1, label: 'ACTIVA' },
  { value: 2, label: 'INACTIVA' },
  { value: 3, label: 'INCOMPLETA' },
] as const;

// /**
//  * obtiene el nombre del estado por oid
//  */
// export function getestadonombre(oidestado: number): string {
//   const estado = ESTADOS_ACTIVIDAD.find((e) => e.oid === oidestado);
//   return estado ? estado.nombre : 'desconocido';
// }

// /**
//  * obtiene la clase css del estado por oid
//  */
// export function getestadobadgeclass(oidestado: number): string {
//   const estado = ESTADOS_ACTIVIDAD.find((e) => e.oid === oidestado);
//   return estado ? estado.class : 'bg-secondary';
// }

/**
 * Ordena calendarios por año de mayor a menor
 * @param calendarios - Array de calendarios a ordenar
 * @returns Array ordenado por año descendente
 */
export function ordenarCalendariosPorAnio(
  calendarios: { value: number; label: string; estado: EstadoCalendario }[]
): { value: number; label: string; estado: EstadoCalendario }[] {
  return calendarios.sort((a, b) => {
    const anioA = extraerAnioDeLabel(a.label);
    const anioB = extraerAnioDeLabel(b.label);
    return anioB - anioA;
  });
}

/**
 * Extrae el año de un string (busca el primer número de 4 dígitos)
 * @param label - String del que extraer el año
 * @returns Año encontrado o 0 si no se encuentra
 */
export function extraerAnioDeLabel(label: string): number {
  const match = label.match(/\b(20\d{2}|19\d{2})\b/);
  return match ? parseInt(match[0], 10) : 0;
}

/**
 * Selecciona automáticamente el calendario ACTIVO más reciente
 * Prioridad: 1) ACTIVO del año más reciente, 2) Cualquiera del año más reciente
 * @param calendarios - Array de calendarios disponibles
 * @returns oidCalendario seleccionado o cadena vacía si no hay calendarios
 */
export function seleccionarCalendarioAutomatico(
  calendarios: { value: number; label: string; estado: EstadoCalendario }[]
): number | string {
  if (calendarios.length === 0) {
    console.warn('No hay calendarios disponibles para seleccionar');
    return '';
  }

  const calendarioActivo = calendarios.find(
    (calendario) => calendario.estado === 'ACTIVO'
  );

  if (calendarioActivo) {
    return calendarioActivo.value;
  }

  return calendarios[0].value;
}

// ========== FUNCIONES DE PAGINACIÓN ==========

/**
 * Actualiza la configuración de paginación con los datos de respuesta del servidor
 * @param paginationActual - Configuración actual de paginación
 * @param data - Datos de respuesta del servidor con información de paginación
 * @returns Nueva configuración de paginación actualizada
 */
export function actualizarPaginacion(
  paginationActual: PaginationConfig,
  data: any
): PaginationConfig {
  return {
    ...paginationActual,
    currentPage: data.number,
    totalElements: data.totalElements,
    totalPages: data.totalPages,
    pageSize: data.size,
  };
}

/**
 * Calcula las páginas visibles para el paginador (rango de 5 páginas)
 * @param currentPage - Página actual (0-indexed)
 * @param totalPages - Total de páginas disponibles
 * @returns Array con los números de página a mostrar
 */
export function getPaginasVisibles(
  currentPage: number,
  totalPages: number
): number[] {
  const visiblePages: number[] = [];

  let startPage = Math.max(0, currentPage - 2);
  let endPage = Math.min(totalPages - 1, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  return visiblePages;
}

/**
 * Genera el texto informativo de paginación
 * @param pagination - Configuración de paginación
 * @returns String con formato "Mostrando X - Y de Z registros"
 */
export function getInfoPaginacion(pagination: PaginationConfig): string {
  const start = pagination.currentPage * pagination.pageSize + 1;
  const end = Math.min(
    (pagination.currentPage + 1) * pagination.pageSize,
    pagination.totalElements
  );
  return `Mostrando ${start} - ${end} de ${pagination.totalElements} registros`;
}

// ========== FUNCIONES DE TRACKING Y OPTIMIZACIÓN ==========

/**
 * Función trackBy para optimizar ngFor de actividades
 * @param index - Índice del elemento
 * @param item - Actividad a trackear
 * @returns oidActividad único
 */
export function trackByOidActividad(
  index: number,
  item: ActividadResponse
): number {
  return item.actividad.oidActividad;
}

// ========== FUNCIONES DE ESTADOS ==========

/**
 * Obtiene el nombre del estado de una actividad
 * @param oidEstado - OID del estado
 * @param estados - Array de estados disponibles
 * @returns Nombre del estado o 'DESCONOCIDO'
 */
export function getEstadoNombre(oidEstado: number): string {
  const estado = ESTADOS_ACTIVIDAD.find((e) => e.oid === oidEstado);
  return estado ? estado.nombre : 'DESCONOCIDO';
}

/**
 * Obtiene la clase CSS del badge según el estado de la actividad
 * @param oidEstado - OID del estado
 * @param estados - Array de estados disponibles
 * @returns Clase CSS del badge
 */
export function getEstadoBadgeClass(oidEstado: number): string {
  const estado = ESTADOS_ACTIVIDAD.find((e) => e.oid === oidEstado);
  return estado ? estado.class : 'bg-secondary';
}
