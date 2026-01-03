import { UserData } from '../models/user.model';

/**
 * Utilidades para manejo de datos del usuario en localStorage
 */

/**
 * Obtiene todos los datos del usuario desde localStorage
 * @returns UserData | null
 */
export function getUserData(): UserData | null {
  try {
    const userData = localStorage.getItem('userData');
    if (userData) {
      return JSON.parse(userData) as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return null;
  }
}

/**
 * Obtiene el OID del departamento del usuario con rol jefe departamento logueado
 * @returns number | 0
 */
export function getUserDepartmentId(): number | 0 {
  const userData = getUserData();
  return userData?.departamentoJefatura?.oidDepartamento || 0;
}

/**
 * Obtiene el OID del pograma del usuario logueado
 * @returns number | 0
 */
export function getUserProgramaId(): number | 0 {
  const userData = getUserData();
  return userData?.programaCoordinador?.oidPrograma || 0;
}

/**
 * Obtiene el OID del usuario logueado
 * @returns number | null
 */
export function getUserId(): number | null {
  const userData = getUserData();
  return userData?.oidUsuario || null;
}

/**
 * Obtiene el nombre completo del usuario logueado
 * @returns string
 */
export function getUserFullName(): string {
  const userData = getUserData();
  if (userData) {
    return `${userData.nombres} ${userData.apellidos}`.trim();
  }
  return '';
}

/**
 * Obtiene el nombre del departamento del usuario logueado
 * @returns string | null
 */
export function getUserDepartmentName(): string | null {
  const userData = getUserData();
  return userData?.departamento?.nombre || null;
}

/**
 * Obtiene los roles del usuario logueado
 * @returns string[]
 */
export function getUserRoles(): string[] {
  const userData = getUserData();
  return userData?.roles?.map((role) => role.nombre) || [];
}

/**
 * Verifica si el usuario tiene un rol específico
 * @param roleName - Nombre del rol a verificar
 * @returns boolean
 */
export function hasRole(roleName: string): boolean {
  const roles = getUserRoles();
  return roles.includes(roleName);
}

/**
 * Guarda los datos del usuario en localStorage
 * @param userData - Datos del usuario a guardar
 */
export function saveUserData(userData: UserData): void {
  try {
    localStorage.setItem('userData', JSON.stringify(userData));
  } catch (error) {
    console.error('Error al guardar datos del usuario:', error);
  }
}

/**
 * Elimina los datos del usuario de localStorage
 */
export function clearUserData(): void {
  localStorage.removeItem('userData');
}

/**
 * Verifica si existe información del usuario en localStorage
 * @returns boolean
 */
export function isUserDataAvailable(): boolean {
  return getUserData() !== null;
}
