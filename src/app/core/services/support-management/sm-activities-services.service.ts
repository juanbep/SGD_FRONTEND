import { Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessagesInfoService } from '../../../shared/services/messages-info.service';
import { ActivityResponse, SourceEvaluation } from '../../models/activities.interface';

@Injectable({
  providedIn: 'root'
})
export class SmActivitiesServicesService {
  
  private baseUrl: string = environments.baseUrl;
  
  constructor(private httpClient: HttpClient) { }

  /*
    * Method to get all the activities by user
    * @param evaluatedId: string
    * @param activityCode:string
    * @param activityType:string
    * @param evaluatorName:string
    * @param roles:string
    * @returns void
    */
  getActivities(evaluatedId: string, activityCode: string, activityType: string, evaluatorName: string, roles: string, page: number | null, totalPage:number |null ): Observable<ActivityResponse> {
    let params = new HttpParams()
      .set('idEvaluado', evaluatedId)
      .set('codigoActividad', activityCode)
      .set('tipoActividad', activityType)
      .set('nombreEvaluador', evaluatorName)
      .set('roles', roles)
      .set('page', page? page.toString() : '' )
      .set('size', totalPage? totalPage.toString() : '' );
    return this.httpClient.get<ActivityResponse>(`${this.baseUrl}/actividad/findActivitiesByEvaluado`, { params });
  }

  /*
    * Method to send the evaluation of the activities
    * @param file:File
    * @param observation:string
    * @param observation:string
    * @param source:SourceEvaluation[]
    * @returns void
    */
  saveSelfAssessment(file: File, observation: string, source: SourceEvaluation[], reports:File[]): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('informeFuente', file);
    formData.append('observation', observation);
    formData.append('sources', JSON.stringify(source));
    reports.forEach((report, index) => {
      formData.append('informeEjecutivo' + (index+1), report);
    });
    return this.httpClient.post(`${this.baseUrl}/fuente/save`, formData, { responseType: 'text' });
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
  
}
