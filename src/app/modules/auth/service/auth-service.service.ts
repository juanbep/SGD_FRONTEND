import { computed, inject, Injectable, signal } from '@angular/core';
import { AsAuthServiceService } from '../../../core/services/as-auth-service.service';
import { UserInfo } from '../../../core/models/auth.interface';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private service: AsAuthServiceService = inject(AsAuthServiceService);

  private _currentUser = signal<UserInfo | null>(null);

  public currentUser = computed(() => this._currentUser());


  get currentUserValue(): UserInfo | null {
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
    return this.service.getUserInfo(114).pipe(
      tap(user => {
        this._currentUser.set(user)
        localStorage.setItem('userRoles',JSON.stringify(user.roles.map(role => role.nombre)));
      })
    );
  }
}

