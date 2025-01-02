import { Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../../models/users.interfaces';
import { Params } from '@angular/router';

@Injectable({providedIn: 'root'})
export class UmUsersServicesService {
    private baseUrl: string = environments.baseUrl;
    constructor(private httpClient: HttpClient) { }

    /*
    * Method to get all the users
    * @param page:number
    * @param totalPage:number
    * @returns void
    * */
    getAllUsers(page: number, totalPage: number): Observable<Users> {
        const params: Params = {
            page: page.toString(),
            size: totalPage.toString(),
        };
        return this.httpClient.get<Users>(`${this.baseUrl}/usuario/all`,{params});
    }
    
}