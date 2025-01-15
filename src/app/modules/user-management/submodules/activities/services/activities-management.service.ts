import { inject, Injectable } from '@angular/core';
import { UmActivitiesServiceService } from '../../../../../core/services/users-management/um-activities-services.service';
import { UmUsersServicesService } from '../../../../../core/services/users-management/um-users-services.service';

@Injectable({providedIn: 'root'})
export class ActivitiesManagementService {
   
    umActivitiesServiceService = inject(UmActivitiesServiceService);
    umUsersServicesService = inject(UmUsersServicesService);
    
    /*
    * Method to get all the activities by user
    * @param idUser:number
    * @returns Observable<ActivityResponse>
    * */
    getActivitiesByUser(page:number, size: number, idUser: number) {
        return this.umActivitiesServiceService.getActivitiesByUser(page, size, idUser);
    } 

    /*
    * Method to get all teachers
    * @returns Observable<UsersResponse>
    * */
    getAllTeachers(page: number, totalPage: number) {
        return this.umActivitiesServiceService.getAllTeachers(page, totalPage);
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
    getUserByParams(page:number, size:number, faculty:string | null, department:string | null, category:string | null, hiring: string | null, dedication:string | null, studies: string | null, rol: string | null, state: number | null ) {
        return this.umUsersServicesService.getUserByParams(page, size, faculty, department, category, hiring, dedication, studies, rol, state);
    }

    /*
    * Method to get a user by id
    * @param idUser:number
    * @returns Observable<User>
    * */
    getUserById(idUser: number) {
        return this.umUsersServicesService.getUserbyId(idUser);
    }
    
}