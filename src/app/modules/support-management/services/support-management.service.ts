import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { Observable } from 'rxjs';
import { Actividad, SourceEvaluation } from '../../../core/activities.interface';
import { BehaviorSubject } from 'rxjs';
import { MessagesInfoService } from '../../../shared/services/messages-info.service';


@Injectable({
  providedIn: 'root'
})
export class SupportManagementService {


  private baseUrl: string = environments.baseUrl;
  private dataActivitie = new BehaviorSubject<any>({});
  private filtroParamSubject = new BehaviorSubject<any>({});

  constructor(private httpClient: HttpClient, private toastr: MessagesInfoService) { }

  //All activities without filter
  allActivitiesWithoutFilter(userId: string): Observable<Actividad[]> {
    let params = new HttpParams().set('idEvaluado', userId);
    return this.httpClient.get<Actividad[]>(`${this.baseUrl}/actividad/findActivitiesByEvaluado`, { params });
  }

  getDataActivities(): Observable<Actividad[]> {
    return this.dataActivitie.asObservable();
  }

  //All teacher activities
  allActivitiesByUser(userIda: string) {
    let params = new HttpParams().set('idEvaluado', userIda);
    this.httpClient.get<Actividad[]>(`${this.baseUrl}/actividad/findActivitiesByEvaluado`, { params }).subscribe(
      {
        next: data => {
          this.dataActivitie.next(data);
        },
        error: error => {
          this.toastr.showErrorMessage('Error al consultar la información', 'Error');
        }
      }
    )
  }


  uploadActivitiesFilter(params: HttpParams) {
    console.log(params);
    this.httpClient.get<Actividad[]>(`${this.baseUrl}/actividad/findActivitiesByEvaluado`, { params }).subscribe(
      {
        next: data => {
          this.dataActivitie.next(data);
        },
        error: error => {
          this.toastr.showErrorMessage('Error al consultar la información', 'Error');
        }
      });
  }

  sendActivities(file: File, observation: string, source: SourceEvaluation[], reports:File[]): void {
    const formData: FormData = new FormData();
    formData.append('informeFuente', file);
    formData.append('observation', observation);
    formData.append('sources', JSON.stringify(source));
    reports.forEach((report, index) => {
      formData.append('informeEjecutivo' + (index+1), report);
    });
    this.httpClient.post(`${this.baseUrl}/fuente/save`, formData, { responseType: 'text' }).subscribe({
      next: data => {
        this.allActivitiesByUser("6");
        this.toastr.showSuccessMessage('La evaluación se ha enviado correctamente', 'Evaluación enviada');
      },
      error: error => {
        this.toastr.showErrorMessage('Error al enviar la evaluación', 'Error');
      }
    });
  }


  //uploadSupport
  uploadSupport() {
    return this.httpClient.post;
  }

  //All user responsabilities

  AllResponsabilities() {
    return this.httpClient.get
  }

  //Responsabilitie by Id

  responsabilitie(id: string) {
    return this.httpClient.get
  }

  actualizarFiltro(params: any) {
    this.filtroParamSubject.next(params);
  }



}
