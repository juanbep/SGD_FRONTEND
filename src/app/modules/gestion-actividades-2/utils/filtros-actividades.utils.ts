import {
  getUserData,
  getUserRoles,
  isUserDataAvailable,
} from '../../auth/utils/user-storage.utils';

export interface RolDocenteResult {
  esDocente: boolean;
  oidUsuarioDocente: number | null;
}

export function obtenerRolDocente(): RolDocenteResult {
  if (!isUserDataAvailable())
    return { esDocente: false, oidUsuarioDocente: null };
  const roles = getUserRoles();
  const esDocente = roles.some((rol) => rol.toUpperCase() === 'DOCENTE');
  if (!esDocente) return { esDocente: false, oidUsuarioDocente: null };
  const userData = getUserData();
  return { esDocente: true, oidUsuarioDocente: userData?.oidUsuario ?? null };
}

export function verificarFiltroDepartamentos(): boolean {
  if (!isUserDataAvailable()) return false;
  const roles = getUserRoles();
  const rolesEspeciales = [
    'SECRETARIA/O FACULTAD',
    'SECRETARIO',
    'SECRETARIA',
    'DECANO',
  ];
  return roles.some((rol) => rolesEspeciales.includes(rol));
}

export const TIPOS_CONTRATACION_DROPDOWN = [
  { value: '', label: 'TODOS' },
  { value: 'PLANTA', label: 'PLANTA' },
  { value: 'OCASIONAL', label: 'OCASIONAL' },
  { value: 'CATEDRA', label: 'CÁTEDRA' },
  { value: 'BECARIOS_Y_PRACTICANTES', label: 'BECARIOS Y PRACTICANTES' },
  { value: 'BECARIOS_POSTGRADO', label: 'BECARIO POSTGRADO' },
] as const;

export const SEMESTRES_DROPDOWN = [
  { value: '', label: 'TODOS' },
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
] as const;

export function getClasesCalendario(
  esDocente: boolean,
  conDepartamento: boolean,
): string {
  if (!conDepartamento && esDocente) return 'col-xl-4 col-lg-4 col-md-6';
  if (conDepartamento && !esDocente) return 'col-xl-2 col-lg-4 col-md-6';
  return 'col-xl-3 col-lg-4 col-md-6';
}

export function getClasesDepartamento(esDocente: boolean): string {
  return esDocente
    ? 'col-xl-3 col-lg-4 col-md-6'
    : 'col-xl-2 col-lg-4 col-md-6';
}

export function getClasesContratacion(
  esDocente: boolean,
  conDepartamento: boolean,
): string {
  return !conDepartamento && esDocente
    ? 'col-xl-3 col-lg-4 col-md-6'
    : 'col-xl-2 col-lg-4 col-md-6';
}

export function getClasesResponsable(conDepartamento: boolean): string {
  return conDepartamento
    ? 'col-xl-2 col-lg-4 col-md-6'
    : 'col-xl-3 col-lg-4 col-md-6';
}

export function getClasesBotones(
  esDocente: boolean,
  conDepartamento: boolean,
): string {
  const base = 'd-flex justify-content-end align-items-end';
  return !conDepartamento && esDocente
    ? `col-xl-3 col-lg-12 ${base}`
    : `col-xl-2 col-lg-12 ${base}`;
}
