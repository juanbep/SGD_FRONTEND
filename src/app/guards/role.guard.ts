import { CanActivateFn } from '@angular/router';

export const RoleGuard: CanActivateFn = (route, state) => {
  const rolesLocalStorage = localStorage.getItem('userRoles');
  const allowedRoles = route.data['roles'] as string[];

  if (rolesLocalStorage && allowedRoles) {
    const roles = rolesLocalStorage ? JSON.parse(rolesLocalStorage) : [];
    const hasAcces = roles.some((role: string) => allowedRoles.includes(role));
    if (hasAcces) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};
