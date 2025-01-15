import { inject, Injectable } from '@angular/core';
import { UmUsersServicesService } from '../../../../../core/services/users-management/um-users-services.service';
import { NewUser, User } from '../../../../../core/models/users.interfaces';

@Injectable({providedIn: 'root'})
export class UsersServiceService {
    
    umUsersServicesService = inject(UmUsersServicesService);

    /*
    * Method to get all the users
    * @param page:number
    * @param totalPage:number
    * @returns Observable<UsersResponse>
    * */

    getAllUsers(page: number, totalPage: number) {
        return this.umUsersServicesService.getAllUsers(page, totalPage);
    }

    /*
    * Method to get a user by id
    * @param id:number
    * @returns Observable<User>
    * */

    getUserbyId(id: number) {
        return this.umUsersServicesService.getUserbyId(id);
    }

    /*
    * Method to save a user
    * @param user:NewUser
    * @returns Observable<UsersResponse>
    * */

    saveUser(user: NewUser) {
        return this.umUsersServicesService.saveUser(user);
    }
    
    /*
    * Method to update a user
    * @param idUsuario:number
    * @param user:NewUser
    * @returns Observable<User>
    * */
    updateUsers(idUsuario:number,user: NewUser) {
        return this.umUsersServicesService.updateUsers(idUsuario, user);
    }
}