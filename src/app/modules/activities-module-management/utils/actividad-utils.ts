
/**
 * Límite máximo de estudiantes que se pueden agregar
 */
export const MAX_ESTUDIANTES = 3;

/**
 * OID del atributo que se puede repetir (NOMBREESTUDIANTE)
 */
export const OID_ATRIBUTO_REPETIBLE = 11;

/**
 * Obtiene el tipo de input HTML según el tipo de atributo
 */
export function obtenerTipoInput(tipo: string): string {
  switch (tipo) {
    case 'DATE':
      return 'date';
    case 'FLOAT':
    case 'INTEGER':
      return 'number';
    default:
      return 'text';
  }
}

/**
 * Obtiene el placeholder según el tipo y nombre del atributo
 */
export function obtenerPlaceholder(tipo: string, nombre: string): string {
  switch (tipo) {
    case 'DATE':
      return 'Seleccione fecha';
    case 'FLOAT':
      return 'Ej: 12.5';
    case 'INTEGER':
      return 'Ej: 100';
    default:
      return `Ingrese ${nombre.toLowerCase().replace(/_/g, ' ')}`;
  }
}

/**
 * Obtiene el ícono FontAwesome según el tipo de atributo
 */
export function obtenerIconoAtributo(tipo: string): string {
  switch (tipo) {
    case 'DATE':
      return 'fa-calendar';
    case 'FLOAT':
    case 'INTEGER':
      return 'fa-calculator';
    default:
      return 'fa-font';
  }
}

/**
 * Formatea el nombre del atributo para mostrarlo de forma legible
 */
export function formatearNombreAtributo(nombre: string): string {
  return nombre
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

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

// ========== CONSTANTES ==========

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

// ========== FUNCIONES HELPER ==========

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
