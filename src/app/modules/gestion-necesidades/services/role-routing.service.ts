import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoleRoutingService {
  /**
   * Obtiene la ruta de gestión de necesidades según los roles del usuario
   */
  getRutaNecesidades(userRoles: string[]): string {
    // Priorizar roles en caso de múltiples
    if (this.tieneRol(userRoles, ['COORDINADOR'])) {
      return '/app/gestion-necesidades/management/coordinador';
    }

    if (
      this.tieneRol(userRoles, [
        'SECRETARIA/O FACULTAD',
        'SECRETARIO',
        'DECANO',
      ])
    ) {
      return '/app/gestion-necesidades/management/secretario';
    }

    if (
      this.tieneRol(userRoles, [
        'JEFE DE DEPARTAMENTO',
        'JEFE_DEPARTAMENTO',
        'JEFE',
      ])
    ) {
      return '/app/gestion-necesidades/management/jefe';
    }

    // Fallback: redirigir a coordinador por defecto
    return '/app/gestion-necesidades/management/coordinador';
  }

  /**
   * Determina el tipo de rol para necesidades (útil para lógica adicional)
   */
  getTipoRolNecesidades(
    userRoles: string[]
  ): 'coordinador' | 'secretario' | 'jefe' | null {
    if (this.tieneRol(userRoles, ['COORDINADOR'])) return 'coordinador';
    if (
      this.tieneRol(userRoles, [
        'SECRETARIA/O FACULTAD',
        'SECRETARIO',
        'DECANO',
      ])
    )
      return 'secretario';
    if (
      this.tieneRol(userRoles, [
        'JEFE DE DEPARTAMENTO',
        'JEFE_DEPARTAMENTO',
        'JEFE',
      ])
    )
      return 'jefe';
    return null;
  }

  /**
   * Helper privado para verificar si el usuario tiene alguno de los roles especificados
   */
  private tieneRol(userRoles: string[], rolesAVerificar: string[]): boolean {
    return userRoles.some((role) => rolesAVerificar.includes(role));
  }
}
