import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { Actividad, Consolidated, Teacher } from '../../models/consolidated.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SmConsolidatedServicesService {

  private baseUrl = environments.baseUrl;

  constructor(private httpClient: HttpClient) { }

  /*
    * Get teachers
    * @returns {any}
    * */

  getTeachers():Observable<Teacher[]>{
    return this.httpClient.get<Teacher[]>(this.baseUrl + '/usuario/obtenerDocentes');
  }

  /*
  * Get info teacher
  * @param {number} teacherId
  * @returns {any}
  * */

  getInfoTeacher(teacherId: number):any{ 
    return this.httpClient.get(this.baseUrl + '/teachers/' + teacherId);
  }

  /*
  * Get consolidated by teacher
  * @param {number} teacherId
  * @returns {any}
  * */
  getConsolidatedByTeacher(teacherId: number, department: string):Observable<Consolidated>{
    let params = new HttpParams()
      .set('idEvaluado', teacherId.toString())
      .set('departamento', department);
    return this.httpClient.get<Consolidated>(this.baseUrl + '/consolidado/generarConsolidado', {params});
  }

  /*
  * Save consolidated
  * @param {any} consolidated
  * @returns {any}
  * */
  saveConsolidated(idEvaluado:number):any{
    let params = new HttpParams().set('idEvaluado', idEvaluado);
    return this.httpClient.post(this.baseUrl + '/consolidado/aprobarConsolidado', '', { params: params, responseType: 'text' });
  }

  /*
  * Send email
  * @param {number} teacherId
  * @param {any} email
  * @returns {any}
  * */
  getConslidatedByTeacher(teacherId: number):any{
    return this.httpClient.get(this.baseUrl + '/consolidated/' + teacherId);
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
    return this.httpClient.post(`${this.baseUrl}/email`, {params});
  }

  
  /*
    * Method to download the source file
    * @param idSource:number
    * @returns void
    */
  downloadSourceFile(idSource: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/fuente/download/${idSource}`, { responseType: 'blob' });
  }

  /*
    * Method to download the report file
    * @param idSource:number
    * @param report:boolean
    * @returns void
    * */

  downloadReportFile(idSource: number, report:boolean ): Observable<any> {
    let params = new HttpParams().set('report', report);
    return this.httpClient.get(`${this.baseUrl}/fuente/download/${idSource}`, { params, responseType: 'blob' });
  }

  /*
  * Method to get all the activities by user
  * @param evaluatedId: string
  * @returns observable<Actividad>
  * */
  getActivityByOidActivity(oidActivity: number):Observable<Actividad>{
    return this.httpClient.get<Actividad>(`${this.baseUrl}/actividad/find/${oidActivity}`);
  }




}
