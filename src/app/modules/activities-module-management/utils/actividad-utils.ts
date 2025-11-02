import { AtributoPredefinido } from '../models/create-actividad-wizard.model';

/**
 * Límite máximo de estudiantes que se pueden agregar
 */
export const MAX_ESTUDIANTES = 3;

/**
 * OID del atributo que se puede repetir (NOMBREESTUDIANTE)
 */
export const OID_ATRIBUTO_REPETIBLE = 11;

/**
 * Lista predefinida de atributos disponibles para actividades
 * TODO: En el futuro, reemplazar por un endpoint del backend
 */
export const ATRIBUTOS_DISPONIBLES: AtributoPredefinido[] = [
  { oideatributo: 1, nombre: 'ACTO ADMINISTRATIVO', tipoAtributo: 'VARCHAR' },
  { oideatributo: 2, nombre: 'NOMBRE PROYECTO', tipoAtributo: 'VARCHAR' },
  { oideatributo: 3, nombre: 'ACTIVIDAD', tipoAtributo: 'VARCHAR' },
  { oideatributo: 4, nombre: 'CODIGO', tipoAtributo: 'VARCHAR' },
  { oideatributo: 5, nombre: 'GRUPO', tipoAtributo: 'VARCHAR' },
  { oideatributo: 6, nombre: 'MATERIA', tipoAtributo: 'VARCHAR' },
  { oideatributo: 7, nombre: 'VRI', tipoAtributo: 'VARCHAR' },
  { oideatributo: 8, nombre: 'PROGRAMA', tipoAtributo: 'VARCHAR' },
  { oideatributo: 9, nombre: 'SEMESTRE', tipoAtributo: 'VARCHAR' },
  { oideatributo: 10, nombre: 'SEMILLERO', tipoAtributo: 'VARCHAR' },
  { oideatributo: 11, nombre: 'NOMBRE ESTUDIANTE', tipoAtributo: 'VARCHAR' },
  { oideatributo: 12, nombre: 'FECHA INICIAL', tipoAtributo: 'DATE' },
  { oideatributo: 13, nombre: 'FECHA FINAL', tipoAtributo: 'DATE' },
  { oideatributo: 14, nombre: 'AREA', tipoAtributo: 'VARCHAR' },
  { oideatributo: 15, nombre: 'HORAS APROBADAS', tipoAtributo: 'FLOAT' },
  { oideatributo: 16, nombre: 'HORAS LABOR', tipoAtributo: 'FLOAT' },
  { oideatributo: 17, nombre: 'UNIDAD ACADEMICA', tipoAtributo: 'VARCHAR' },
];

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
