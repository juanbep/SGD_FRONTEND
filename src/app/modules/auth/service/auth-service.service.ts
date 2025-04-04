import { computed, inject, Injectable, signal, SimpleChange } from '@angular/core';
import { AsAuthServiceService } from '../../../core/services/as-auth-service.service';
import { tap } from 'rxjs';
import { UsuarioResponse } from '../../../core/models/response/usuario-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private service: AsAuthServiceService = inject(AsAuthServiceService);

  private _currentUser = signal<UsuarioResponse | null>(null);

  public currentUser = computed(() => this._currentUser());

  public idCurrentUser: number | null = null;

  
  get currentUserValue(): UsuarioResponse | null {
    return this._currentUser();
  }

  /**
   * 
   * @param username 
   * @param password 
   */
  login(username: string, password: string): number | null {
    this.idCurrentUser = this.service.login(username, password);
    return this.idCurrentUser;
  }

  /**
   * 
   * @param idUser 
   * @returns 
   */
  getUserInfo() {
    if(this.idCurrentUser) {
    return this.service.getUserInfo(this.idCurrentUser).pipe(
      tap(user => {
        this._currentUser.set(user.data);
        localStorage.setItem('userRoles',JSON.stringify(user.data.roles.map(role => role.nombre)));
      })
    );
  }else{
    if(sessionStorage.getItem('idUser')){
      return this.service.getUserInfo(Number(sessionStorage.getItem('idUser'))).pipe(
        tap(user => {
          this._currentUser.set(user.data);
          localStorage.setItem('userRoles',JSON.stringify(user.data.roles.map(role => role.nombre)));
        })
      );

    }
  }
  return null;
  }
}

