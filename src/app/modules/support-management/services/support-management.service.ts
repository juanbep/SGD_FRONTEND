import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments.pro';
import { Observable } from 'rxjs';
import { Actividad } from '../../../core/activities.interface';

@Injectable({
  providedIn: 'root'
})
export class SupportManagementService {

  private baseUrl: string = environments.baseUrl;

  constructor(private httpClient: HttpClient) { }

  //All teacher activities
  allActivities (): Observable<Actividad[]>{
    return this.httpClient.get<Actividad[]>(`http://localhost:3000/Actividades`)
  }
  
  //Activitie by Id
  activitie (id: string): Observable<Actividad> | null{
    return null;
  }

  //uploadSupport
  
  uploadSupport(){
    return this.httpClient.post;
  }

  //All user responsabilities
  
  AllResponsabilities(){
    return this.httpClient.get
  }

  //Responsabilitie by Id

  responsabilitie(id: string){
    return this.httpClient.get
  }
  
}
