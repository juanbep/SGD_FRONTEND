import { inject, Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActividadResponse } from '../../models/response/actividad-response.model';
import { SimpleResponse } from '../../models/response/simple-response.model';
import { PagedResponse } from '../../models/response/paged-response.model';
import { FuenteCreate } from '../../models/modified/fuente-create.model';
import { UsuarioConsolidadoResponse } from '../../models/response/usuario-consolidado-response.model';
import { AutoevaluacionFuente } from '../../models/modified/autoevaluacion-fuente.model';

@Injectable({
  providedIn: 'root',
})
export class SmActivitiesServicesService {

  private httpClient= inject(HttpClient);
  
  private baseUrl: string = environments.baseUrl;
  
  /*
   * Method to get the activities of the teacher
   * @param evaluatedId:number
   * @param activityName:string
   * @param activityType:string
   * @param evaluatorName:string
   * @param roles:string
   * @param page:number
   * @param totalPage:number
   * @returns Observable<SimpleResponse<PagedResponse<ActividadResponse>>>
   */
  getActivities(
    evaluatedId: number,
    activityName: string | null,
    activityType: string | null,
    evaluatorName: string | null,
    roles: string | null,
    page: number | null,
    totalPage: number | null
  ): Observable<SimpleResponse<PagedResponse<ActividadResponse>>> {
    let params = new HttpParams()
      .set('idEvaluado', evaluatedId)
      .set('codigoActividad', activityName ? activityName : '')
      .set('tipoActividad', activityType ? activityType : '')
      .set('nombreEvaluador', evaluatorName ? evaluatorName : '')
      .set('roles', roles ? roles : '')
      .set('page', page ? page.toString() : '')
      .set('size', totalPage ? totalPage.toString() : '');
    return this.httpClient.get<
      SimpleResponse<PagedResponse<ActividadResponse>>
    >(`${this.baseUrl}/api/actividades/buscarActividadesPorEvaluado`, {
      params,
    });
  }

  /*
   * Method to get the activities of the teacher
   * @returns Observable<PagedResponse<ActividadResponse>>
   */
  getActivityById(id: number): Observable<ActividadResponse> {
    return this.httpClient
      .get<SimpleResponse<ActividadResponse>>(
        `${this.baseUrl}/api/actividades/${id}`
      )
      .pipe(map((resp) => resp.data));
  }


  /*
   * Method to get the general information of the teacher
   * @param idEvaluated:string
   * @returns Observable<TeacherInformationResponse>
   */
  getInfoTeacher(idEvaluated: string): Observable<UsuarioConsolidadoResponse> {
    return this.httpClient.get<UsuarioConsolidadoResponse>(
      `${this.baseUrl}/api/consolidado/informacion-general/${idEvaluated}`
    );
  }

  /*
   * Method to send the evaluation of the activities
   * @param file:File
   * @param observation:string
   * @param observation:string
   * @param source:SourceEvaluation[]
   * @returns void
   */
  saveSelfAssessment(
    file: File,
    observation: string,
    source: FuenteCreate[],
    reports: File[]
  ): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('informeFuente', file);
    formData.append('observation', observation);
    formData.append('sources', JSON.stringify(source));
    reports.forEach((report, index) => {
      formData.append('informeEjecutivo' + (index + 1), report);
    });
    return this.httpClient.post(`${this.baseUrl}/api/fuente`, formData, {
      responseType: 'text',
    });
  }

  saveSelfAssessmentForm(autoevaluacionFuente: AutoevaluacionFuente): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/fuente`, autoevaluacionFuente, {
      responseType: 'text',
    });
  }

  /*
   * Method to download the source file
   * @param idSource:number
   * @returns void
   */
  downloadSourceFile(idSource: number): Observable<any> {
    return this.httpClient.get(
      `${this.baseUrl}/api/fuente/download/${idSource}`,
      { responseType: 'blob' }
    );
  }

  /*
   * Method to download the report file
   * @param idSource:number
   * @param report:boolean
   * @returns void
   * */

  downloadReportFile(idSource: number, report: boolean): Observable<any> {
    let params = new HttpParams().set('report', report);
    return this.httpClient.get(
      `${this.baseUrl}/api/fuente/download/${idSource}`,
      { params, responseType: 'blob' }
    );
  }
}
