import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { Actividad, ConsolidatedActivitiesResponse, ConsolidatedTeachersResponse, TeacherInformationResponse } from '../../models/consolidated.interface';
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

  getTeachers(page: number, totalPage: number, department: string): Observable<ConsolidatedTeachersResponse> {
    let params = new HttpParams()
      .set('departamento', department)
      .set('page', page.toString())
      .set('size', totalPage.toString());

    return this.httpClient.get<ConsolidatedTeachersResponse>(this.baseUrl + '/api/usuarios/obtenerEvaluacionDocente', { params });
  }

  /*
  * Get info teacher
  * @param {number} teacherId
  * @returns {any}
  * */

  getInfoTeacher(teacherId: number): Observable<TeacherInformationResponse> {
    let params = new HttpParams()
      .set('idEvaluado', teacherId.toString());
    return this.httpClient.get<TeacherInformationResponse>(this.baseUrl + '/api/consolidado/informacion-general', { params });
  }

  /*
  * Get consolidated by teacher
  * @param {number} teacherId
  * @returns {any}
  * */
  getConsolidatedByTeacher(teacherId: number, page: number, size: number): Observable<ConsolidatedActivitiesResponse> {
    let params = new HttpParams()
      .set('idEvaluado', teacherId)
      .set('page', page)
      .set('size', size);
    return this.httpClient.get<ConsolidatedActivitiesResponse>(this.baseUrl + '/api/consolidado/actividades', { params });
  }

  getConsolidatedActitiesTeacherByParams(teacherId: number, page: number, size: number, activityType: string, activityName: string, sourceType:string, sourceState:string): Observable<ConsolidatedActivitiesResponse> {
    let params = new HttpParams()
      .set('idEvaluado', teacherId)
      .set('page', page)
      .set('size', size)
      .set('idTipoActividad', activityType)
      .set('nombreActividad', activityName)
      .set('idTipoFuente' , sourceType)
      .set('idEstadoFuente', sourceState);
    return this.httpClient.get<ConsolidatedActivitiesResponse>(this.baseUrl + '/api/consolidado/actividades', { params });
  }

  /*
  * Save consolidated
  * @param {any} consolidated
  * @returns {any}
  * */
  saveConsolidated(idEvaluated: number, idEvaluator: number, observation: string): any {
    let params = new HttpParams()
      .set('idEvaluado', idEvaluated)
      .set('idEvaluador', idEvaluator)
      .set('nota', observation);
    return this.httpClient.post(this.baseUrl + '/api/consolidado/aprobar', '', { params: params, responseType: 'text' });
  }

  /*
  * Send email
  * @param {number} teacherId
  * @param {any} email
  * @returns {any}
  * */
  getConslidatedByTeacher(teacherId: number): any {
    return this.httpClient.get(this.baseUrl + '/consolidated/' + teacherId);
  }

  /*
  * Save consolidated
  * @param {any} consolidated
  * @returns {any}
  * */
  sendEmail(emails: string[], observation: string): any {
    let params = new HttpParams()
      .set('observation', observation)
      .set('emails', emails.toString());
    return this.httpClient.post(`${this.baseUrl}/email`, { params });
  }


  /*
    * Method to download the source file
    * @param idSource:number
    * @returns void
    */
  downloadSourceFile(idSource: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/fuente/download/${idSource}`, { responseType: 'blob' });

  }

  /*
    * Method to download the report file
    * @param idSource:number
    * @param report:boolean
    * @returns void
    * */

  downloadReportFile(idSource: number, report: boolean): Observable<any> {
    let params = new HttpParams().set('report', report);
    return this.httpClient.get(`${this.baseUrl}/api/fuente/download/${idSource}`, { params, responseType: 'blob' });
  }

  /*
  * Method to get all the activities by user
  * @param evaluatedId: string
  * @returns observable<Actividad>
  * */
  getActivityByOidActivity(oidActivity: number): Observable<Actividad> {
    return this.httpClient.get<Actividad>(`${this.baseUrl}/api/actividades/${oidActivity}`);
  }


  /*
  * Method to download all support files
  * @param period:string
  * @param department:string
  * @param contractType:string
  * @param idUser:number
  * @returns blob
  * */
  downloadAllSupportFiles(period: string, department:string, contractType:string | null, idUser:number | null): Observable<any> {
    const params = new HttpParams()
    .set('periodo', period)
    .set('departamento', department)
    .set('tipoContrato', contractType || '')
    .set('oidUsuario', idUser || '');
    return this.httpClient.get(`${this.baseUrl}/api/download/zip`, {params,responseType: 'blob' });
  }

}
