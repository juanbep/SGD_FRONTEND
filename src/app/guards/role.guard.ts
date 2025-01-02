import { CanActivateFn } from '@angular/router';

export const RoleGuard: CanActivateFn = (route, state) => {
    const rolesLocalStorage = localStorage.getItem('userRoles');
    const allowedRoles = route.data['roles'] as string[];

    if(rolesLocalStorage && allowedRoles) {
        console.log('allowedRoles', rolesLocalStorage);
        console.log('allowedRoles', allowedRoles);
        const roles = rolesLocalStorage ? JSON.parse(rolesLocalStorage) : [];
        const hasAcces = roles.some((role:string) => allowedRoles.includes(role));
        console.log('roles', roles);
        if(hasAcces) {
            return true;
        }else {
            return false;
        }
    }
    return false;
}