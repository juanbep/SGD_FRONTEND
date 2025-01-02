import { inject, Injectable, signal } from '@angular/core';
import { AsAuthServiceService } from '../../../core/services/as-auth-service.service';
import { Userinfo } from '../../../core/models/auth.interface';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private service: AsAuthServiceService = inject(AsAuthServiceService);

  private _currentUser = signal<Userinfo | null>(null);


  /**
   * 
   * @param username 
   * @param password 
   */
  login(username: string, password: string): void {
    this.service.login(username, password);
  }

  /**
   * 
   * @param idUser 
   * @returns 
   */
  getUserInfo(idUser: number) {
    localStorage.setItem('userRoles', JSON.stringify(['Docente','Estudiante','Jefe de departamento']));

    return this.service.getUserInfo(idUser).pipe(
      tap(user => {
        this._currentUser.set(user)
        const roles = user.roles.map(role => role.nombre);
      })
    );
  }
}

