import { inject, Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';
import { PagedResponse } from '../../models/response/paged-response.model';
import { ActividadResponse } from '../../models/response/actividad-response.model';
import { SimpleResponse } from '../../models/response/simple-response.model';
import { ActividadCreate } from '../../models/modified/actividad-create.model';

@Injectable({ providedIn: 'root' })
export class UmActivitiesServiceService {
  private httpClient: HttpClient = inject(HttpClient);

  baseUrl: string = environments.baseUrl;

  /*
   * Method to get all the activities by user
   * @param idUser:number
   * @returns Observable<ActivityResponse>
   * */
  getActivitiesByUser(
    page: number,
    size: number,
    idUser: number
  ): Observable<SimpleResponse<PagedResponse<ActividadResponse>>> {
    let params: Params = {
      page: page.toString(),
      size: size.toString(),
      idEvaluado: idUser,
    };
    return this.httpClient.get<
      SimpleResponse<PagedResponse<ActividadResponse>>
    >(`${this.baseUrl}/api/actividades/buscarActividadesPorEvaluado`, {
      params,
    });
  }

  /*
   * Method to get all the activities by params
   * @param page:number
   * @param size:number
   * @param idEvaluated:number
   * @param nameActivity:string
   * @param typeActivity:string
   * @param activityCode:string
   * @param administrativeCode:string
   * @param vriCode:string
   * @returns Observable<ActivityResponse>
   * */
  getActivitiesByParams(
    page: number,
    size: number,
    idEvaluated: number,
    nameActivity: string | null,
    typeActivity: string | null,
    activityCode: string | null,
    administrativeCode: string | null,
    vriCode: string | null
  ): Observable<SimpleResponse<PagedResponse<ActividadResponse>>> {
    let params: Params = {
      page: page.toString(),
      size: size.toString(),
      idEvaluado: idEvaluated.toString(),
      nombreActividad: nameActivity || '',
      tipoActividad: typeActivity || '',
      codigoActividad: activityCode || '',
      actoAdministrativo: administrativeCode || '',
      codVRI: vriCode || '',
    };
    return this.httpClient.get<
      SimpleResponse<PagedResponse<ActividadResponse>>
    >(`${this.baseUrl}/api/actividades/buscarActividadesPorEvaluado`, {
      params,
    });
  }

  /*
   * Method to get activity by id
   * @param idActivity:number
   * @returns Observable<Activity>
   * */
  getActivityById(idActivity: number): Observable<ActividadResponse> {
    return this.httpClient
      .get<SimpleResponse<ActividadResponse>>(
        `${this.baseUrl}/api/actividades/${idActivity}`
      )
      .pipe(
        map((response: SimpleResponse<ActividadResponse>) => response.data)
      );
  }

  /*
   * Method to save new activity
   * @param newActivity:NewActivity
   * @returns Observable<any>
   * */
  saveNewActivity(newActivity: ActividadCreate[]): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/actividades`, newActivity);
  }

  /*
   * Method to update activity
   * @param idActivity:number
   * @param activity:Activity
   * @returns Observable<any>
   * */
  updateActivity(
    idActivity: number,
    activity: ActividadCreate
  ): Observable<any> {
    return this.httpClient.put(
      `${this.baseUrl}/api/actividades/${idActivity}`,
      activity
    );
  }

  //TODO: Eliminar actividad

  //TODO: Obtener actividades usuario via KIRA (servicio Universidad del Cauca)
}
