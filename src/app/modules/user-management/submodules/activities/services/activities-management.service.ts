import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { UmActivitiesServiceService } from '../../../../../core/services/users-management/um-activities-services.service';
import { UmUsersServicesService } from '../../../../../core/services/users-management/um-users-services.service';
import { PagedResponse } from '../../../../../core/models/response/paged-response.model';
import { UsuarioResponse } from '../../../../../core/models/response/usuario-response.model';
import { ActividadCreate } from '../../../../../core/models/modified/actividad-create.model';
import { ActividadResponse } from '../../../../../core/models/response/actividad-response.model';

@Injectable({ providedIn: 'root' })
export class ActivitiesManagementService {

    private umActivitiesServiceService = inject(UmActivitiesServiceService);
    private umUsersServicesService = inject(UmUsersServicesService);

    private usersSignal: WritableSignal<PagedResponse<UsuarioResponse> | null> = signal(null);
    private activitiesSignal: WritableSignal<PagedResponse<ActividadResponse> | null> = signal(null);

    private paramsUsersFilterSignal: WritableSignal<{ nameUser: string | null, identification: string | null, faculty: string | null, program: string | null, rol: string | null, state: string | null } | null> = signal(null);
    private paramsActivitiesFilterSignal: WritableSignal<{ nameActivity: string | null, typeActivity: string | null, activityCode: string | null, administrativeCode: string | null, vriCode: string | null } | null> = signal(null);

    /*
    * Method to set the params filter signal
    * @param newData:{nameUser:string, identification:string, faculty:string, program: string, rol: string, state: string}
    * */
    setParamsUsersFilter(newData: { nameUser: string, identification: string, faculty: string, program: string, rol: string, state: string }) {
        this.paramsUsersFilterSignal.update(data => data = newData);
    }

    /*
    * Method to get the params filter signal
    * @returns {nameUser:string, identification:string, faculty:string, program: string, rol: string, state: string} | null
    * */
    getParamsUsersFilter() {
        return this.paramsUsersFilterSignal();
    }

    /*
    * Method to set the params filter signal
    * @param newData:{nameActivity:string, date:string, state:string}
    * */
    setParamsActivitiesFilter(newData: { nameActivity: string | null, typeActivity: string | null, activityCode: string | null, administrativeCode: string | null, vriCode: string | null }) {
        this.paramsActivitiesFilterSignal.update(data => data = newData);
    }

    /*
    * Method to get the params filter signal
    * @returns {nameActivity:string, date:string, state:string} | null
    * */
    getParamsActivitiesFilter() {
        return this.paramsActivitiesFilterSignal();
    }

    /*
    * Method to set the users signal
    * @param newData:UsersResponse
    * */
    setUsers(newData: PagedResponse<UsuarioResponse>) {
        this.usersSignal.update(data => data = newData);
    }

    /*
    * Method to get the users signal
    * @returns UsersResponse
    * */
    getDatUsers() {
        return this.usersSignal();
    }

    /*
    * Method to set the activities signal
    * @param newData:ActivityResponse
    * */
    setActivities(newData: PagedResponse<ActividadResponse>) {
        this.activitiesSignal.update(data => data = newData);
    }

    /*
    * Method to get the activities signal
    * @returns ActivityResponse
    * */
    getDatActivities() {
        return this.activitiesSignal();
    }

    /*
    * Method to get all the activities by user
    * @param idUser:number
    * @returns Observable<ActivityResponse>
    * */
    getActivitiesByUser(page: number, size: number, idUser: number) {
        return this.umActivitiesServiceService.getActivitiesByUser(page, size, idUser);
    }

    /*
    * Method to get a user by params
    * @param page:number
    * @param size:number
    * @param faculty:string
    * @param department:string
    * @param category:string
    * @param hiring:string
    * @param dedication:string
    * @param studies:string
    * @param rol:string
    * @param state:string
    * @returns Observable<UsersResponse>
    * */
    getUserByParams(page: number, size: number, userId: string | null, userName: string | null, faculty: string | null, department: string | null, category: string | null, hiring: string | null, dedication: string | null, studies: string | null, rol: string | null, state: string | null) {
        return this.umUsersServicesService.getAllUsersByParams(page, size, userId, userName, faculty, department, category, hiring, dedication, studies, rol, state);
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
    getActivitiesByParams(page: number, size: number, idEvaluated: number, nameActivity: string | null, typeActivity: string | null, activityCode: string | null, administrativeCode: string | null, vriCode: string | null) {
        return this.umActivitiesServiceService.getActivitiesByParams(page, size, idEvaluated, nameActivity, typeActivity, activityCode, administrativeCode, vriCode);
    }

    /*
       * Method to get activity by id
       * @param idActivity:number
       * @returns Observable<Activity>
       * */
    getActivityById(idActivity: number) {
        return this.umActivitiesServiceService.getActivityById(idActivity);
    }




    /*
    * Method to get a user by id
    * @param idUser:number
    * @returns Observable<User>
    * */
    getUserById(idUser: number) {
        return this.umUsersServicesService.getUserbyId(idUser);
    }


    /*
    * Method to save new activity
    * @param newActivity:NewActivity
    * @returns Observable<any>
    * */
    saveNewActivity(newActivity: any) {
        return this.umActivitiesServiceService.saveNewActivity(newActivity);
    }


    /*
    * Method to update activity
    * @param idActivity:number
    * @param activity:Activity
    * @returns Observable<any>
    * */

    updateActivity(idActivity:number,activity: ActividadCreate){
        return this.umActivitiesServiceService.updateActivity(idActivity,activity);
    }



}