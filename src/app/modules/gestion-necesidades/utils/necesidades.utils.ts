// ========== CONSTANTES PARA DROPDOWNS ==========

import { EstadoCalendario } from '../../academic-calendar-management/models';

export const SEMESTRES_DISPONIBLES: {
  value: number | string;
  label: string;
}[] = [
  { value: 'TODOS', label: 'TODOS' },
  { value: 'NO_APLICA', label: 'No aplica' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' },
];

export const GRUPOS_DISPONIBLES: { value: string; label: string }[] = [
  { value: 'TODOS', label: 'TODOS' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
];

export const ESTADOS_NECESIDAD_DISPONIBLES: { value: string; label: string }[] =
  [
    { value: 'TODOS', label: 'TODOS' },
    { value: 'BORRADOR', label: 'BORRADOR' },
    { value: 'EN_REVISION_SECRETARIO', label: 'EN REVISIÓN SECRETARIO' },
    { value: 'EN_REVISION_JEFE', label: 'EN REVISIÓN JEFE' },
    { value: 'NO_ASIGNADA', label: 'NO ASIGNADA' },
    { value: 'ASIGNADA', label: 'ASIGNADA' },
  ];

// ========== FUNCIONES PARA CALENDARIOS ==========

/**
 * Ordena calendarios por año (más reciente primero)
 * @param calendarios - Array de calendarios a ordenar
 * @returns Array ordenado por año descendente
 */
export function ordenarCalendariosPorAnio(
  calendarios: {
    value: number;
    label: string;
    estado: EstadoCalendario;
  }[]
): { value: number; label: string; estado: EstadoCalendario }[] {
  return [...calendarios].sort((a, b) => {
    const anioA = parseInt(a.label.split('-')[0]);
    const anioB = parseInt(b.label.split('-')[0]);
    return anioB - anioA; // Orden descendente
  });
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

  // Buscar el primer calendario ACTIVO
  const calendarioActivo = calendarios.find(
    (calendario) => calendario.estado === 'ACTIVO'
  );

  if (calendarioActivo) {
    console.log('Calendario ACTIVO seleccionado:', calendarioActivo.label);
    return calendarioActivo.value;
  }

  // Si no hay ACTIVO, seleccionar el primero (más reciente)
  console.log('Calendario más reciente seleccionado:', calendarios[0].label);
  return calendarios[0].value;
}

/**
 * Filtra calendarios excluyendo los que están deshabilitados
 * @param calendarios - Array de calendarios completos
 * @returns Array filtrado sin calendarios DESHABILITADO
 */
export function filtrarCalendariosDeshabilitados(
  calendarios: {
    value: number;
    label: string;
    estado: EstadoCalendario;
  }[]
): { value: number; label: string; estado: EstadoCalendario }[] {
  return calendarios.filter(
    (calendario) => calendario.estado !== 'DESHABILITADO'
  );
}

// ========== FUNCIONES PARA FILTROS ==========

/**
 * Valida si un valor es considerado "vacío" para los filtros
 * @param valor - Valor a validar
 * @returns true si el valor no debe ser incluido en los filtros
 */
export function esValorVacio(valor: any): boolean {
  return (
    valor === undefined || valor === null || valor === '' || valor === 'TODOS'
  );
}

/**
 * Construye un objeto de filtros eliminando valores vacíos
 * @param filtros - Objeto con todos los posibles filtros
 * @returns Objeto solo con filtros que tienen valores válidos
 */
export function construirFiltrosLimpios<T extends Record<string, any>>(
  filtros: T
): Partial<T> {
  const filtrosLimpios: Partial<T> = {};

  for (const [key, value] of Object.entries(filtros)) {
    if (!esValorVacio(value)) {
      // Si es string, hacer trim
      if (typeof value === 'string') {
        const valorTrimmed = value.trim();
        if (valorTrimmed !== '') {
          filtrosLimpios[key as keyof T] = valorTrimmed as any;
        }
      } else {
        filtrosLimpios[key as keyof T] = value;
      }
    }
  }

  return filtrosLimpios;
}

// ========== FUNCIONES PARA BADGES DE ESTADO ==========

/**
 * Retorna la clase CSS del badge según el estado de la necesidad
 * @param estado - Estado de la necesidad
 * @returns Clase CSS de Bootstrap para el badge
 */
export function getBadgeClassEstado(estado: string): string {
  const clases: Record<string, string> = {
    BORRADOR: 'bg-secondary',
    EN_REVISION_SECRETARIO: 'bg-warning',
    EN_REVISION_JEFE: 'bg-info',
    NO_ASIGNADA: 'bg-primary',
    ASIGNADA: 'bg-success',
  };
  return clases[estado] || 'bg-secondary';
}
