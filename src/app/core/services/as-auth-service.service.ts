import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { SimpleResponse } from '../models/response/simple-response.model';
import { UsuarioResponse } from '../models/response/usuario-response.model';

@Injectable({
  providedIn: 'root'
})
export class AsAuthServiceService {

  

  public usersLogin: {email:string, pass:string, idUser:number} [] = [
    {email: 'atoledo@unicauca.edu.co', pass: 'admin', idUser: 17},
    {email: 'oscar.vivas@unicauca.edu.co', pass: 'admin', idUser: 1},
    {email: 'elena.munoz@unicauca.edu.co', pass: 'admin', idUser: 2},
    {email: 'karin.correa@unicauca.edu.co', pass: 'admin', idUser: 3},
    {email: 'sonia.henao@unicauca.edu.co', pass: 'admin', idUser: 4},
    {email: 'mosquera@unicauca.edu.co', pass: 'admin', idUser: 5},
    {email: 'angelgarzon@unicauca.edu.co', pass: 'admin', idUser: 6},
    {email: 'jhoansarria@unicauca.edu.co', pass: 'admin', idUser: 7},
    {email: 'olopez@unicauca.edu.co', pass: 'admin', idUser: 8},
    {email: 'ivan.ortiz@unicauca.edu.co', pass: 'admin', idUser: 9},
    {email: 'hernan.trullo@unicauca.edu.co', pass: 'admin', idUser: 10},
    {email: 'juan.arango@unicauca.edu.co', pass: 'admin', idUser: 11},
    {email: 'hermes.vargas@unicauca.edu.co', pass: 'admin', idUser: 12},
    {email: 'iliana.rumbo@unicauca.edu.co', pass: 'admin', idUser: 13},
    {email: 'omaira.tapias@unicauca.edu.co', pass: 'admin', idUser: 14},
    {email: 'jose.salgado@unicauca.edu.co', pass: 'admin', idUser: 15},
    {email: 'jairo.marin@unicauca.edu.co', pass: 'admin', idUser: 16},
    {email: 'jhaybermelo@gmail.com', pass: 'admin', idUser: 40},
    {email: 'vsandres@unicauca.edu.co', pass: 'admin', idUser: 45},
  ];

  private apiUrl = environments.baseUrlAuth;
  private baseUrl = environments.baseUrl;

  constructor(private http: HttpClient) { }

  /**
   * Login
   * @param username
   * @param password
   */
  login(userEmail: string, password: string): number | null {
    if(this.usersLogin.find(user => user.email === userEmail && user.pass === password)) {
      sessionStorage.setItem('token', '1234567890');
      sessionStorage.setItem('idUser', this.usersLogin.find(user => user.email === userEmail && user.pass === password)?.idUser.toString() || '');
      return this.usersLogin.find(user => user.email === userEmail && user.pass === password)?.idUser || null;
    }
    return null;
  }

  /**
   * get user info
   * @param idUser
   * @returns Observable<UserInfo>
   */
  getUserInfo(token: string): Observable<SimpleResponse<UsuarioResponse>> {
    return this.http.get<SimpleResponse<UsuarioResponse>>(`${this.baseUrl}/api/usuarios/logueado`);
  }

  loginGoogle(token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/auth/google`, { token });
  }

}
