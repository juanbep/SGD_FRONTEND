import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { Observable } from 'rxjs';
import { PagedResponse } from '../../models/response/paged-response.model';
import { UsuarioConsolidadoResponse } from '../../models/response/usuario-consolidado-response.model';
import { DetalleUsuarioConsolidadoResponse } from '../../models/response/detalle-usuario-cosolidado-response.model';
import { ActividadConsolidadoResponse } from '../../models/response/actividad-consolidado-response.model';
import { ActividadResponse } from '../../models/response/actividad-response.model';
import { SimpleResponse } from '../../models/response/simple-response.model';
import { ConsolidadoCrearResponse } from '../../models/response/consolidado-crear-response-model';
import { UsuarioConsolidadoCreadoResponse } from '../../models/response/usuarios-consolidado-creado-response.model';
import { ConsolidadoHistoricoResponse } from '../../models/response/consolidado-historico-response.model';

@Injectable({
  providedIn: 'root',
})
export class SmConsolidatedServicesService {
  private baseUrl = environments.baseUrl;

  constructor(private httpClient: HttpClient) {}

  /*
   * Get users with consolidated created
   * @param {number} page
   * @param {number} totalPage
   * @param {string} department
   * @returns {Observable<SimpleResponse<PagedResponse<UsuarioConsolidadoCreadoResponse>>}
   * */
  getUsersWithConsolidatedCreated(
    page: number,
    totalPage: number,
    department: string | null,
    userId: string | null,
    userName: string | null,
    category: string | null,
    rol: string | null
  ): Observable<
    SimpleResponse<PagedResponse<UsuarioConsolidadoCreadoResponse>>
  > {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', totalPage.toString())
      .set('departamento', department || '')
      .set('identificacion', userId || '')
      .set('nombre', userName || '')
      .set('categoria', category || '')
      .set('rol', rol || '');
    return this.httpClient.get<
      SimpleResponse<PagedResponse<UsuarioConsolidadoCreadoResponse>>
    >(this.baseUrl + '/api/consolidado', { params });
  }

  /*
   * Get teachers
   * @returns {any}
   * */

  getTeachers(
    page: number,
    totalPage: number,
    department: string,
    evaluatedName: string | null,
    contractType: string | null,
    evaluatedId: string | null,
  ): Observable<SimpleResponse<PagedResponse<UsuarioConsolidadoResponse>>> {
    let params = new HttpParams()
      .set('departamento', department)
      .set('nombre', evaluatedName || '')
      .set('tipoContrato', contractType || '')
      .set('identificacion', evaluatedId || '')
      .set('page', page.toString())
      .set('size', totalPage.toString());

    return this.httpClient.get<
      SimpleResponse<PagedResponse<UsuarioConsolidadoResponse>>
    >(this.baseUrl + '/api/usuarios/obtenerEvaluacionDocente', { params });
  }

  /*
   * Get info teacher
   * @param {number} teacherId
   * @returns {SimpleResponse<DetalleUsuarioConsolidadoResponse>}
   * */

  getInfoTeacher(
    teacherId: number
  ): Observable<SimpleResponse<DetalleUsuarioConsolidadoResponse>> {
    let params = new HttpParams().set('idEvaluado', teacherId.toString());
    return this.httpClient.get<
      SimpleResponse<DetalleUsuarioConsolidadoResponse>
    >(this.baseUrl + '/api/consolidado/informacion-general', { params });
  }

  /*
   * Get consolidated by teacher
   * @param {number} teacherId
   * @returns {any}
   * */
  getConsolidatedByTeacher(
    teacherId: number,
    page: number,
    size: number
  ): Observable<SimpleResponse<ActividadConsolidadoResponse>> {
    let params = new HttpParams()
      .set('idEvaluado', teacherId)
      .set('page', page)
      .set('size', size);
    return this.httpClient.get<SimpleResponse<ActividadConsolidadoResponse>>(
      this.baseUrl + '/api/consolidado/actividades',
      { params }
    );
  }

  getConsolidatedActitiesTeacherByParams(
    teacherId: number,
    page: number,
    size: number,
    activityType: string,
    activityName: string,
    sourceType: string,
    sourceState: string
  ): Observable<SimpleResponse<ActividadConsolidadoResponse>> {
    let params = new HttpParams()
      .set('idEvaluado', teacherId)
      .set('page', page)
      .set('size', size)
      .set('idTipoActividad', activityType)
      .set('nombreActividad', activityName)
      .set('idTipoFuente', sourceType)
      .set('idEstadoFuente', sourceState);
    return this.httpClient.get<SimpleResponse<ActividadConsolidadoResponse>>(
      this.baseUrl + '/api/consolidado/actividades',
      { params }
    );
  }

  /*
   * Save consolidated
   * @param {any} consolidated
   * @returns {any}
   * */
  saveConsolidated(
    idEvaluated: number,
    idEvaluator: number,
    observation: string
  ): Observable<SimpleResponse<ConsolidadoCrearResponse>> {
    let params = new HttpParams()
      .set('idEvaluado', idEvaluated)
      .set('idEvaluador', idEvaluator)
      .set('nota', observation);
    return this.httpClient.post<SimpleResponse<ConsolidadoCrearResponse>>(
      this.baseUrl + '/api/consolidado/aprobar',
      '',
      { params: params }
    );
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

  /*
   * Method to get all the activities by user
   * @param evaluatedId: string
   * @returns observable<Actividad>
   * */
  getActivityByOidActivity(oidActivity: number): Observable<ActividadResponse> {
    return this.httpClient.get<ActividadResponse>(
      `${this.baseUrl}/api/actividades/${oidActivity}`
    );
  }

  /*
   * Method to download all support files
   * @param period:string
   * @param department:string
   * @param contractType:string
   * @param idUser:number
   * @returns blob
   * */
  downloadAllSupportFiles(
    period: string,
    department: string | null,
    contractType: string | null,
    idUser: number | null,
    esConsolidado: boolean | null
  ): Observable<any> {
    const params = new HttpParams()
      .set('periodo', period)
      .set('departamento', department || '')
      .set('tipoContrato', contractType || '')
      .set('oidUsuario', idUser || '')
      .set('esConsolidado', esConsolidado || false);
    return this.httpClient.get(`${this.baseUrl}/api/download/zip`, {
      params,
      responseType: 'blob',
    });
  }

  /*
   * Method to download the consolidated file
   * @param idConsolidado:number
   * @returns blob
   * */
  downloadConsolidatedFile(idConsolidado: number): Observable<any> {
    const params = new HttpParams().set('idConsolidado', idConsolidado);
    return this.httpClient.get(
      `${this.baseUrl}/api/consolidado/descargar-consolidado`,
      { params, responseType: 'blob' }
    );
  }

  historicalConsolidated(page: number, totalPage:number, academicPeriodsId: number[], evaluatedName: string | null, contractType: string | null, evaluatedId: string | null): Observable<SimpleResponse<PagedResponse<ConsolidadoHistoricoResponse>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', totalPage.toString())
      .set('periodos', academicPeriodsId.toString())
      .set('nombre', evaluatedName || '')
      .set('categoria', contractType || '')
      .set('identificacion', evaluatedId || '');

    return this.httpClient.get<SimpleResponse<PagedResponse<ConsolidadoHistoricoResponse>>>(`${this.baseUrl}/api/consolidado/historico-calificaciones`, { params });
  }

  downloadConsolidatedGeneralFile(departmentId: string){
    const params = new HttpParams().set('departamento', departmentId);
    return this.httpClient.get(
      `${this.baseUrl}/api/usuarios/exportar-evaluacion-docente-excel`,
      { params, responseType: 'blob' }
    );
  }
}
