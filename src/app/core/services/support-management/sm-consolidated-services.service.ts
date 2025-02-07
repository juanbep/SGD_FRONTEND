import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { Actividad, Consolidated, ConsolidatedTeachersResponse, Teacher } from '../../models/consolidated.interface';
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

  getTeachers(page:number, totalPage:number):Observable<ConsolidatedTeachersResponse>{
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', totalPage.toString());
    return this.httpClient.get<ConsolidatedTeachersResponse>(this.baseUrl + '/api/usuarios/obtenerEvaluacionDocente', {params});
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
     
    return this.httpClient.get<Consolidated>(this.baseUrl + '/api/consolidado/generarConsolidado', {params});
  }

  /*
  * Save consolidated
  * @param {any} consolidated
  * @returns {any}
  * */
  saveConsolidated(idEvaluado:number):any{
    let params = new HttpParams().set('idEvaluado', 15).set('idEvaluador',18).set('nota','nota');
    return this.httpClient.post(this.baseUrl + '/api/consolidado/aprobarConsolidado', '', { params: params, responseType: 'text' });
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

  //TODO: Downloads all support files
  downloadAllSupportFiles(teacherId: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/soporte/download/${teacherId}`, { responseType: 'blob' });
  }

}
