import { Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewUser, User, UsersResponse } from '../../models/users.interfaces';
import { Params } from '@angular/router';

@Injectable({providedIn: 'root'})
export class UmUsersServicesService {
    private baseUrl: string = environments.baseUrl;
    constructor(private httpClient: HttpClient) { }

    /*
    * Method to get all the users
    * @param page:number
    * @param totalPage:number
    * @returns Observable<UsersResponse>
    * */
    getAllUsers(page: number, totalPage: number): Observable<UsersResponse> {
        const params: Params = {
            page: page.toString(),
            size: totalPage.toString(),
        };
        return this.httpClient.get<UsersResponse>(`${this.baseUrl}/usuario/all`,{params});
    }
    
    /*
    * Method to get a user by id
    * @param id:number
    * @returns Observable<User>
    * */

    getUserbyId(id: number): Observable<User> {
        return this.httpClient.get<User>(`${this.baseUrl}/usuario/find/${id}`);
    }


    /*
    * Method to save a user
    * @param user:NewUser
    * @returns Observable<UsersResponse>
    * */
    
    saveUser(user: NewUser): Observable<UsersResponse> {
        return this.httpClient.post<UsersResponse>(`${this.baseUrl}/usuario/save`, user);
    }

    /*
    * Method to update a user
    * @param idUsuario:number
    * @param user:NewUser
    * @returns Observable<User>
    * */
    updateUsers(idUsuario:number,user: NewUser): Observable<NewUser> {
        return this.httpClient.put<NewUser>(`${this.baseUrl}/usuario/update/${idUsuario}`, user);
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
    getUserByParams(page:number, size:number, faculty:string | null, department:string | null, category:string | null, hiring: string | null, dedication:string | null, studies: string | null, rol: string | null, state: number | null ): Observable<UsersResponse>{
        const params: Params = {
            page: page.toString(),
            size: size.toString(),
            facultad: faculty || '',
            departament: department || '',
            categoria: category || '',
            contratiacion: hiring || '',
            dedicacion: dedication || '',
            estudios: studies || '',
            rol: rol || '',
            estado: state || ''
        };
        return this.httpClient.get<UsersResponse>(`${this.baseUrl}/usuario/all`, {params});
    }

}