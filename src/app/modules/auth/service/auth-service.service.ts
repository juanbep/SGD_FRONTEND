import { inject, Injectable } from '@angular/core';
import { AsAuthServiceService } from '../../../core/services/as-auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private service:AsAuthServiceService = inject(AsAuthServiceService);

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
    return this.service.getUserInfo(idUser);
  }

}
