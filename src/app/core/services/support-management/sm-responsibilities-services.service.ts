 import { Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResponsabilityResponse } from '../../models/responsibilitie.interface';
import { SourceEvaluation } from '../../models/responsibilitie.interface';

@Injectable({
    providedIn: 'root'
})
export class SmResponsibilitiesServicesService {

    private baseUrl: string = environments.baseUrl;

    constructor(private httpClient: HttpClient) { }

    /*
        * Method to get the responsibilities by user
        * @param evaluatorId:string
        * @param activityCode:string
        * @param activityType:string
        * @param evaluatorName:string
        * @param roles:string
        * @returns Observable<Responsabilidad>
        */

    getResponsibilities(evaluatorId: string, activityCode: string, activityType: string, evaluatorName: string, roles: string, page:number|null, totalPage:number|null): Observable<ResponsabilityResponse> {
        let params = new HttpParams()
            .set( 'idEvaluador', evaluatorId )
            .set( 'codigoActividad', activityCode )
            .set( 'tipoActividad', activityType )
            .set( 'nombreEvaluado', evaluatorName )
            .set( 'roles', roles )
            .set( 'page', page? page.toString() : '' )
            .set( 'size', totalPage? totalPage.toString() : '' );
        return this.httpClient.get<ResponsabilityResponse>(`${this.baseUrl}/actividad/findActivitiesByEvaluador`, { params });
    }

    /*
        * Method to send the evaluation of the responsibilities
        * @param file:File
        * @param observation:string
        * @param source:SourceResposability[]
        * @returns void
        */

    saveResponsibilityEvaluation(file: File, observation: string, source: SourceEvaluation[]): Observable<any> {
        const formData = new FormData();
        formData.append('informeFuente', file);
        formData.append('observation', observation);
        formData.append('sources', JSON.stringify(source));
        return this.httpClient.post(`${this.baseUrl}/fuente/save`, formData, { responseType: 'text' });
    }

    /*
        * Method to download the file source
        * @param idSource:number
        * @returns Observable<Blob>
        */

    downloadSourceFile(idSource: number): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}/fuente/download/${idSource}`, { responseType: 'blob' });
    }

    /*
        * Method to download the report file
        * @param idSource:number
        * @param report:boolean
        * @returns Observable<any>
        */

    downloadReportFile(idSource: number, report:boolean ): Observable<any> {
        let params = new HttpParams().set('report', report);
        return this.httpClient.get(`${this.baseUrl}/fuente/download/${idSource}`, { params, responseType: 'blob' });
      }
      

}
