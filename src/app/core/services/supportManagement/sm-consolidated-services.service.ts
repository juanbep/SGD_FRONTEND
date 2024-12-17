import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { Consolidated, Teacher } from '../../models/consolidated.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SmConsolidatedServicesService {

  private apiUrl = environments.baseUrl;

  constructor(private http: HttpClient) { }

  /*
    * Get teachers
    * @returns {any}
    * */

  getTeachers():Observable<Teacher[]>{
    return this.http.get<Teacher[]>(this.apiUrl + '/usuario/obtenerDocentes');
  }

  /*
  * Get info teacher
  * @param {number} teacherId
  * @returns {any}
  * */

  getInfoTeacher(teacherId: number):any{ 
    return this.http.get(this.apiUrl + '/teachers/' + teacherId);
  }

  /*
  * Get consolidated by teacher
  * @param {number} teacherId
  * @returns {any}
  * */
  getConsolidatedByTeacher(teacherId: number, department: string):Observable<Consolidated>{
    let params = new HttpParams()
      .set('evaluadoId', teacherId.toString())
      .set('departamento', department);
    return this.http.get<Consolidated>(this.apiUrl + '/consolidado/generarConsolidado', {params});
  }

  /*
  * Save consolidated
  * @param {any} consolidated
  * @returns {any}
  * */
  saveConsolidated(consolidated: any):any{
    return this.http.post(this.apiUrl + '/consolidated', consolidated);
  }

  /*
  * Send email
  * @param {number} teacherId
  * @param {any} email
  * @returns {any}
  * */
  getConslidatedByTeacher(teacherId: number):any{
    return this.http.get(this.apiUrl + '/consolidated/' + teacherId);
  }

  /*
  * Save consolidated
  * @param {any} consolidated
  * @returns {any}
  * */
  sendEmail(emails: string[], observation:string):any{
    let params = new HttpParams()
      .set('observation', observation)
      .set('emails', emails.toString());
    return this.http.post(`${this.apiUrl}/email`, {params});
  }

}
