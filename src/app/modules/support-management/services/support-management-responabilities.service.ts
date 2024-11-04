import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Responsabilidad } from '../../../core/responsabilitie.interface';
import { environments } from '../../../../environments/environments';

@Injectable({providedIn: 'root'})
export class SupportManagementResponsabilitiesService {
    
    private baseUrl: string = environments.baseUrl;
    
    constructor(private httpClient: HttpClient) { }
    
    allResponsabilitiesByUser(idUser:string){
        return this.httpClient.get<Responsabilidad[]>(`${this.baseUrl}/actividad/findActivitiesByEvaluadorInActivePeriod/${idUser}`);
    }

}