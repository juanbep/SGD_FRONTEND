import { inject, Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { Observable } from 'rxjs';
import { ActivityResponse } from '../../models/activities.interface';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';
import { UsersResponse } from '../../models/users.interfaces';

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
        return this.httpClient.get<ActivityResponse>(`${this.baseUrl}/actividad/buscarActividadesPorEvaluado`, {params});
    }


    /*
    * Method to get all teachers
    * @returns Observable<UsersResponse>
    * @params rol: 'DOCENTE'
    * */
    getAllTeachers(page:number, totalPage:number):Observable<UsersResponse>{
        let params: Params = {
            page: page.toString(),
            size: totalPage.toString(),
            rol : 'DOCENTE' 
        };
        return this.httpClient.get<UsersResponse>(`${this.baseUrl}/usuario/all`, {params});
    }    
    //TODO: Crear actividad

    saveActivities(){
        
    }

    //TODO: Actualizar actividad

    //TODO: Eliminar actividad

    //TODO: Obtener actividades usuario via KIRA (servicio Universidad del Cauca)



}