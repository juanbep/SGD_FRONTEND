import { Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResponsabilidadResponse } from '../../models/response/responsabilidad-response.model';
import { PagedResponse } from '../../models/response/paged-response.model';
import { FuenteCreate } from '../../models/modified/fuente-create.model';
import { SimpleResponse } from '../../models/response/simple-response.model';
import { FuenteEstudianteFormulario } from '../../models/modified/fuente-estudiante-formulario.model';
import { FuenteEstudianteFormularioResponse } from '../../models/response/fuente-estudiante-formulario-response.model';
import { FuenteCoordinadorFormulario } from '../../models/modified/fuente-coordinador-formulario.model';
import { FuenteCoordinadorFormularioResponse } from '../../models/response/fuente-coordinador-formulario-response.model';

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

    getResponsibilities(evaluatorId: string, activityName: string | null, activityType: string | null, evaluatorName: string | null, roles: string | null, asignacionDefault: boolean , page: number | null, totalPage: number | null): Observable<SimpleResponse<PagedResponse<ResponsabilidadResponse>>> {
        let params = new HttpParams()
            .set('idEvaluador', evaluatorId)
            .set('nombreActividad', activityName ? activityName : '')
            .set('tipoActividad', activityType ? activityType : '')
            .set('nombreEvaluado', evaluatorName ? evaluatorName : '')
            .set('roles', roles ? roles : '')
            .set('asignacionDefault', asignacionDefault)
            .set('page', page ? page.toString() : '')
            .set('size', totalPage ? totalPage.toString() : '');
        return this.httpClient.get<SimpleResponse<PagedResponse<ResponsabilidadResponse>>>(`${this.baseUrl}/api/actividades/buscarActividadesPorEvaluador`, { params });
    }

    /*
        * Method to get the responsibilities by id
        * @param id:number
        * @returns Observable<SimpleResponse<FuenteEstudianteFormularioResponse>>
        */


    getInfoResponsibilityByForm(idSource: number): Observable<SimpleResponse<FuenteEstudianteFormularioResponse>> {
        return this.httpClient.get<SimpleResponse<FuenteEstudianteFormularioResponse>>(`${this.baseUrl}/api/evaluacion-estudiante/fuente/${idSource}`);
    }

    /*
        * Method to get the responsibilities by id
        * @param id:number
        * @returns Observable<SimpleResponse<FuenteCoordinadorFormulario>>
        */
    getInforResponsibilityByFormCoordinator(idSource: number): Observable<SimpleResponse<FuenteCoordinadorFormularioResponse>> {
        return this.httpClient.get<SimpleResponse<FuenteCoordinadorFormularioResponse>>(`${this.baseUrl}/api/informes-administracion/fuente/${idSource}`);
    }

    /*
        * Method to send the evaluation of the responsibilities
        * @param file:File
        * @param observation:string
        * @param source:SourceResposability[]
        * @returns void
        */

    saveResponsibilityEvaluation(file: File, observation: string, source: FuenteCreate[]): Observable<any> {
        const formData = new FormData();
        formData.append('informeFuente', file);
        formData.append('observation', observation);
        formData.append('sources', JSON.stringify(source));
        return this.httpClient.post(`${this.baseUrl}/api/fuente`, formData, { responseType: 'text' });
    }

    /*
        * Method to save the responsibility by form student
        * @param fuenteEstudianteFormulario:FuenteEstudianteFormulario 
        * @param reportDocument:File
        * @returns Observable<any>
        */

    saveResponibilityFormStundent(fuenteEstudianteFormulario: FuenteEstudianteFormulario, reportDocument: File): Observable<any> {
        const formData = new FormData();
        formData.append('data', JSON.stringify(fuenteEstudianteFormulario));
        formData.append('documentoFuente', reportDocument);
        return this.httpClient.post(`${this.baseUrl}/api/evaluacion-estudiante`, formData, { responseType: 'text' });
    }

    /*
        * Method to save the responsibility by form coordinator 
        * @param fuenteCoordinadorFormulario:FuenteCoordinadorFormulario
        * @param reportDocument:File
        * @param signature:File
        * @returns Observable<any>W
        */
    saveResponsibilityFormCoordinator(fuenteCoordinadorFormulario: FuenteCoordinadorFormulario, reportDocument: File): Observable<any> {
        const formData = new FormData();
        formData.append('data', JSON.stringify(fuenteCoordinadorFormulario));
        formData.append('documentoAdministracion', reportDocument);
        return this.httpClient.post(`${this.baseUrl}/api/informes-administracion`, formData, { responseType: 'text' });
    }

    /*
        * Method to download the file source
        * @param idSource:number
        * @returns Observable<Blob>
        */

    downloadSourceFile(idSource: number): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}/api/fuente/download/${idSource}`, { responseType: 'blob' });
    }

    /*
        * Method to download the report file
        * @param idSource:number
        * @param report:boolean
        * @returns Observable<any>
        */

    downloadReportFile(idSource: number, report: boolean): Observable<any> {
        let params = new HttpParams().set('report', report);
        return this.httpClient.get(`${this.baseUrl}/api/fuente/download/${idSource}`, { params, responseType: 'blob' });
    }





}
