import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { Userinfo } from '../models/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AsAuthServiceService {

  private apiUrl = environments.baseUrl;

  constructor(private http: HttpClient) { }

  /**
   * Login
   * @param username
   * @param password
   */
  login(username: string, password: string): void {
    sessionStorage.setItem('token', 'Bearer token');
  }

  /**
   * get user info
   * @param idUser
   * @returns Observable<Userinfo>
   */
  getUserInfo(idUser: number): Observable<Userinfo> {
    return this.http.get<Userinfo>(`${this.apiUrl}/users/${idUser}`);
  }


}
