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


  get currentUserValue(): UsuarioResponse | null {
    return this._currentUser();
  }

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
  getUserInfo() {
    return this.service.getUserInfo(2).pipe(
      tap(user => {
        this._currentUser.set(user.data);
        localStorage.setItem('userRoles',JSON.stringify(user.data.roles.map(role => role.nombre)));
      })
    );
  }
}

