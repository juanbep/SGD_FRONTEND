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

/**
 * Obtiene el nombre del estado por OID
 */
export function getEstadoNombre(oidEstado: number): string {
  const estado = ESTADOS_ACTIVIDAD.find((e) => e.oid === oidEstado);
  return estado ? estado.nombre : 'DESCONOCIDO';
}

/**
 * Obtiene la clase CSS del estado por OID
 */
export function getEstadoBadgeClass(oidEstado: number): string {
  const estado = ESTADOS_ACTIVIDAD.find((e) => e.oid === oidEstado);
  return estado ? estado.class : 'bg-secondary';
}
