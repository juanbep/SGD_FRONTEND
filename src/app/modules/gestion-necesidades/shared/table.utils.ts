/**
 * Utilidades para manejo de tablas (ordenamiento, paginación, tracking)
 */

// ========== TIPOS ==========

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: string;
  direction: SortDirection;
}

export interface PaginationInfo {
  page: number;
  size: number;
  totalElements: number;
}

// ========== FUNCIONES DE ORDENAMIENTO ==========

/**
 * Alterna la dirección de ordenamiento para un campo
 * Si el campo es diferente al actual, inicia en 'asc'
 * Si es el mismo campo, alterna entre 'asc' y 'desc'
 */
export function toggleSort(
  currentField: string,
  currentDirection: SortDirection,
  newField: string
): SortState {
  if (currentField === newField) {
    return {
      field: newField,
      direction: currentDirection === 'asc' ? 'desc' : 'asc',
    };
  }

  return {
    field: newField,
    direction: 'asc',
  };
}

/**
 * Obtiene el icono CSS para mostrar según el estado de ordenamiento
 */
export function getSortIcon(
  campo: string,
  sortField: string,
  sortDirection: SortDirection
): string {
  if (sortField !== campo) {
    return 'fas fa-sort text-muted';
  }

  return sortDirection === 'asc'
    ? 'fas fa-sort-up text-primary'
    : 'fas fa-sort-down text-primary';
}

/**
 * Construye el string de ordenamiento para enviar al backend
 * Formato: "campo,direccion" (ej: "oidNecesidad,desc")
 */
export function buildSortString(
  field: string,
  direction: SortDirection
): string {
  return `${field},${direction}`;
}

// ========== FUNCIONES DE PAGINACIÓN ==========

/**
 * Calcula el número total de páginas
 */
export function getTotalPages(totalElements: number, pageSize: number): number {
  if (pageSize <= 0) return 0;
  return Math.ceil(totalElements / pageSize);
}

/**
 * Obtiene el array de páginas visibles para el paginador
 * Muestra hasta 5 páginas (2 antes, página actual, 2 después)
 */
export function getVisiblePages(
  currentPage: number,
  totalElements: number,
  pageSize: number
): number[] {
  const totalPages = getTotalPages(totalElements, pageSize);

  if (totalPages <= 1) return [];

  const pages: number[] = [];
  const start = Math.max(0, currentPage - 2);
  const end = Math.min(totalPages - 1, currentPage + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}

/**
 * Genera el texto informativo de paginación
 * Ejemplo: "1 - 10 de 50 registros"
 */
export function getPaginationInfo(
  currentPage: number,
  pageSize: number,
  totalElements: number
): string {
  if (totalElements === 0) return '0 registros';

  const start = currentPage * pageSize + 1;
  const end = Math.min((currentPage + 1) * pageSize, totalElements);

  return `${start} - ${end} de ${totalElements} registros`;
}

/**
 * Valida si una página es válida
 */
export function isValidPage(
  page: number,
  totalElements: number,
  pageSize: number
): boolean {
  const totalPages = getTotalPages(totalElements, pageSize);
  return page >= 0 && page < totalPages;
}

/**
 * Ajusta el número de página si es inválido
 * Útil cuando se cambia el tamaño de página o se filtran datos
 */
export function adjustPageIfNeeded(
  currentPage: number,
  totalElements: number,
  pageSize: number
): number {
  if (totalElements === 0) return 0;

  const totalPages = getTotalPages(totalElements, pageSize);

  if (currentPage >= totalPages) {
    return Math.max(0, totalPages - 1);
  }

  return Math.max(0, currentPage);
}

// ========== FUNCIONES DE TRACKING ==========

/**
 * Función genérica de trackBy para listas con identificador único
 */
export function trackByOid<T extends { oidNecesidad?: number }>(
  index: number,
  item: T
): number {
  return item.oidNecesidad || index;
}

/**
 * Función genérica de trackBy por cualquier campo
 */
export function trackByField<T>(fieldName: keyof T) {
  return (index: number, item: T): any => {
    return item[fieldName] || index;
  };
}
