import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Responsabilidad } from '../../../core/responsabilitie.interface';
import { environments } from '../../../../environments/environments';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Fuente, SourceEvaluation } from '../../../core/activities.interface';
import { MessagesInfoService } from '../../../shared/services/messages-info.service';

@Injectable({providedIn: 'root'})
export class SupportManagementResponsabilitiesService {
    
    private baseUrl: string = environments.baseUrl;
    private dataResponsabilities = new BehaviorSubject<any>({});

    constructor(private httpClient: HttpClient, private toastr: MessagesInfoService) { }
    
    
    getDataResponsabilities():Observable<Responsabilidad[]>{
        return this.dataResponsabilities.asObservable();
    }
    
    allResponsabilitiesByUser(idUser:string){
        let params = new HttpParams().set('idEvaluador',idUser);
        this.httpClient.get<Responsabilidad[]>(`${this.baseUrl}/actividad/findActivitiesByEvaluador`,{params}).subscribe(
            data=>{
                this.dataResponsabilities.next(data);
            });
    }

    uploadResponsabilitiesFilter(params:HttpParams){
        this.httpClient.get<Responsabilidad[]>(`${this.baseUrl}/actividad/findActivitiesByEvaluador`,{params}).subscribe(
            data=>{
                this.dataResponsabilities.next(data);
            });
    }


    sendEvaluationResponsabilities(file: File, observation: string, source: SourceEvaluation[]) {
        const formData = new FormData();
        formData.append('archivo', file);
        formData.append('observacion', observation);
        formData.append('fuentes', JSON.stringify(source));
        this.httpClient.post(`${this.baseUrl}/fuente/save`, formData,{ responseType: 'text' }).subscribe(
            {
                next: data => {
                    this.allResponsabilitiesByUser("4");
                    this.toastr.showSuccessMessage('La evaluación se ha enviado correctamente', 'Evaluación enviada');
                },
                error: error => {
                    this.toastr.showErrorMessage('Error al enviar la evaluación', 'Error');
                }
            }
            
        );
    }


    downloadFileSource(idSource: number): Observable<Blob> {
        return this.httpClient.get(`${this.baseUrl}/fuente/download/${idSource}`, { responseType: 'blob' });
    }



}