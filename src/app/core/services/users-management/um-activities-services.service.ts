import { inject, Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { map, Observable } from 'rxjs';
import { Activity, ActivityByIdResponse, ActivityResponse, NewActivity } from '../../models/activities.interface';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';

@Injectable({providedIn: 'root'})
export class UmActivitiesServiceService {

    private httpClient:HttpClient = inject(HttpClient);
    
    baseUrl:string = environments.baseUrl;

    /*
    * Method to get all the activities by user
    * @param idUser:number
    * @returns Observable<ActivityResponse>
    * */
    getActivitiesByUser(page:number, size:number, idUser: number):Observable<ActivityResponse> {
        let params:Params = {
            page: page.toString(),
            size: size.toString(),
            idEvaluado: idUser
        }
        return this.httpClient.get<ActivityResponse>(`${this.baseUrl}/api/actividades/buscarActividadesPorEvaluado`, {params});
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
    getActivitiesByParams(page:number, size:number, idEvaluated:number, nameActivity:string | null, typeActivity:string | null, activityCode:string | null, administrativeCode: string| null, vriCode:string | null):Observable<ActivityResponse> {
        let params:Params = {
            page: page.toString(),
            size: size.toString(),
            idEvaluado : idEvaluated.toString(),
            nombreActividad: nameActivity || '',
            tipoActividad: typeActivity || '',
            codigoActividad: activityCode || '',
            actoAdministrativo: administrativeCode || '',
            codVRI: vriCode || ''
        }
        return this.httpClient.get<ActivityResponse>(`${this.baseUrl}/api/actividades/buscarActividadesPorEvaluado`, {params});
    }


    /*
    * Method to get activity by id
    * @param idActivity:number
    * @returns Observable<Activity>
    * */
    getActivityById(idActivity:number):Observable<Activity> {
        return this.httpClient.get<ActivityByIdResponse>(`${this.baseUrl}/api/actividades/${idActivity}`).pipe(
            map((response:ActivityByIdResponse) => response.data)
        );
    }


    
    /*
    * Method to save new activity
    * @param newActivity:NewActivity
    * @returns Observable<any>
    * */
    saveNewActivity(newActivity: NewActivity): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}/api/actividades`, newActivity);
    }


    /*
    * Method to update activity
    * @param idActivity:number
    * @param activity:Activity
    * @returns Observable<any>
    * */
    updateActivity(idActivity: number,activity: NewActivity): Observable<any> {
        return this.httpClient.put(`${this.baseUrl}/api/actividades/${idActivity}`, activity);
    }

    

    //TODO: Eliminar actividad

    //TODO: Obtener actividades usuario via KIRA (servicio Universidad del Cauca)

}