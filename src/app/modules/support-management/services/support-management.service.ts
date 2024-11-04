import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { Observable } from 'rxjs';
import { Actividad } from '../../../core/activities.interface';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupportManagementService {

  private baseUrl: string = environments.baseUrl;

  private filtroParamSubject = new BehaviorSubject<any>({});
  filtroParam$ = this.filtroParamSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  //All teacher activities
  allActivitiesByUser(idUser:string): Observable<Actividad[]>{
    return this.httpClient.get<Actividad[]>(`${this.baseUrl}/actividad/findActivitiesByEvaluado/${idUser}`)
  }
  
  //Activitie by Id
  activitieByFilter (params:HttpParams): Observable<Actividad[]> | null{
    return this.httpClient.get<Actividad[]>(`${this.baseUrl}/actividad/actividades`,{params});
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

  actualizarFiltro(params: any){
    this.filtroParamSubject.next(params);
  }
  


}
