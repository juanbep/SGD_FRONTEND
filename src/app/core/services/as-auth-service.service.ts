import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { SimpleResponse } from '../models/response/simple-response.model';
import { UsuarioResponse } from '../models/response/usuario-response.model';

@Injectable({
  providedIn: 'root'
})
export class AsAuthServiceService {

  public usersLogin: {email:string, pass:string} [] = [{email: 'admin',pass: 'admin'}];


  private apiUrl = environments.baseUrl;

  constructor(private http: HttpClient) { }

  /**
   * Login
   * @param username
   * @param password
   */
  login(userEmail: string, password: string): void {
    if(this.usersLogin.find(user => user.email === userEmail && user.pass === password)) {
      sessionStorage.setItem('token', '1234567890');
    }
  }

  /**
   * get user info
   * @param idUser
   * @returns Observable<UserInfo>
   */
  getUserInfo(idUser: number): Observable<SimpleResponse<UsuarioResponse>> {
    return this.http.get<SimpleResponse<UsuarioResponse>>(`${this.apiUrl}/api/usuarios/${idUser}`);
  }


}
