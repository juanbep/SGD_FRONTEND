import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { UmUsersServicesService } from '../../../../../core/services/users-management/um-users-services.service';
import { UsuarioResponse } from '../../../../../core/models/response/usuario-response.model';
import { PagedResponse } from '../../../../../core/models/response/paged-response.model';
import { UsuarioCreate } from '../../../../../core/models/modified/usuario-create.model';

@Injectable({providedIn: 'root'})
export class UsersServiceService {
    
    private umUsersServicesService = inject(UmUsersServicesService);
    
    private usersSignal: WritableSignal<PagedResponse<UsuarioResponse> | null> = signal(null);

    private paramsFilterSignal: WritableSignal< {nameUser:string | null, identification:string | null, faculty:string | null, program: string | null, rol: string | null, state: string | null   }  | null> = signal(null);


    /*
    * Method to set the params filter signal
    * @param newData:{nameUser:string, identification:string, faculty:string, program: string, rol: string, state: string}
    * */
    setParamsFilter(newData: {nameUser:string, identification:string, faculty:string, program: string, rol: string, state: string   }){
        this.paramsFilterSignal.update(data => data = newData);
    }

    /*
    * Method to get the params filter signal
    * @returns {nameUser:string, identification:string, faculty:string, program: string, rol: string, state: string} | null
    * */
    getParamsFilter(){
        return this.paramsFilterSignal();
    }

    /*
    * Method to set the users signal
    * @param newData:User[]
    * */
    setUsers(newData: PagedResponse<UsuarioResponse>){
        this.usersSignal.update(data => data = newData);
    }

    /*
    * Method to get the users signal
    * @returns User[] | null
    * */
    getDatUsers(){
        return this.usersSignal();
    }

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

    saveUser(user: UsuarioCreate[]) {
        return this.umUsersServicesService.saveUser(user);
    }
    
    /*
    * Method to update a user
    * @param idUsuario:number
    * @param user:NewUser
    * @returns Observable<User>
    * */
    updateUsers(idUsuario:number,user: UsuarioCreate) {
        return this.umUsersServicesService.updateUsers(idUsuario, user);
    }


    /*
    * Method to get all the users by params
    * @param page:number
    * @param totalPage:number
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
    getAllUsersByParams(page: number, totalPage: number, userId: string | null, userName: string | null ,faculty: string | null, department: string | null, category: string | null, hiring: string | null, dedication: string | null, studies: string | null, rol: string | null, state: string | null) {
        return this.umUsersServicesService.getAllUsersByParams(page, totalPage, userId, userName, faculty, department, category, hiring, dedication, studies, rol, state);
    }

}