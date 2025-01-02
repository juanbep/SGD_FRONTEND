import { inject, Injectable } from '@angular/core';
import { UmUsersServicesService } from '../../../../../core/services/users-management/um-users-services.service';

@Injectable({providedIn: 'root'})
export class UsersServiceService {
    
    umUsersServicesService = inject(UmUsersServicesService);

    /*
    * Method to get all the users
    * @param page:number
    * @param totalPage:number
    * */

    getAllUsers(page: number, totalPage: number) {
        return this.umUsersServicesService.getAllUsers(page, totalPage);
    }

    

}