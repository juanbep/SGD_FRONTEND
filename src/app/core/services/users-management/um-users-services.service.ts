import { Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Params } from '@angular/router';
import { PagedResponse } from '../../models/response/paged-response.model';
import { UsuarioResponse } from '../../models/response/usuario-response.model';
import { UsuarioCreate } from '../../models/modified/usuario-create.model';
import { SimpleResponse } from '../../models/response/simple-response.model';

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
    getAllUsers(page: number, totalPage: number): Observable<SimpleResponse<PagedResponse<UsuarioResponse>>> {
        const params: Params = {
            page: page.toString(),
            size: totalPage.toString(),
        };
        return this.httpClient.get<SimpleResponse<PagedResponse<UsuarioResponse>>>(`${this.baseUrl}/api/usuario`,{params});
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
    getAllUsersByParams(page: number, totalPage: number, userId: string | null, userName:string | null, faculty: string | null, department: string | null, category: string | null, hiring: string | null, dedication: string | null, studies: string | null, rol: string | null, state: string | null): Observable<SimpleResponse<PagedResponse<UsuarioResponse>>> {
        const params: Params = {
            page: page.toString(),
            size: totalPage.toString(),
            identificacion: userId || '',
            nombre: userName || '',
            facultad: faculty || '',
            departamento: department || '',
            categoria: category || '',
            contratiacion: hiring || '',
            dedicacion: dedication || '',
            estudios: studies || '',
            rol: rol || '',
            estado: state || ''
        };
        return this.httpClient.get<SimpleResponse<PagedResponse<UsuarioResponse>>>(`${this.baseUrl}/api/usuarios`,{params});
    }
    
    /*
    * Method to get a user by id
    * @param id:number
    * @returns Observable<User>
    * */

    getUserbyId(id: number): Observable<UsuarioResponse> {
        return this.httpClient.get<UsuarioResponse>(`${this.baseUrl}/api/usuarios/${id}`);
    }


    /*
    * Method to save a user
    * @param user:NewUser
    * @returns Observable<UsersResponse>
    * */
    
    saveUser(user: UsuarioCreate[]): Observable<UsuarioResponse> {
        return this.httpClient.post<UsuarioResponse>(`${this.baseUrl}/api/usuarios`, user);
    }

    /*
    * Method to update a user
    * @param idUsuario:number
    * @param user:NewUser
    * @returns Observable<User>
    * */
    updateUsers(idUsuario:number,user: UsuarioCreate): Observable<UsuarioCreate> {
        return this.httpClient.put<UsuarioCreate>(`${this.baseUrl}/api/usuarios/${idUsuario}`, user);
    }


}