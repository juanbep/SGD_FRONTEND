import { inject, Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PeriodoAcademicoResponse } from '../../models/response/periodo-academico-response.model';
import { PagedResponse } from '../../models/response/paged-response.model';
import { PeriodoAcademicoCreate } from '../../models/modified/periodo-academico-create.model';
import { SimpleResponse } from '../../models/response/simple-response.model';
import { PeriodoAcademicoKiraResponse } from '../../models/response/periodo-academico-kira-response.model';

@Injectable({ providedIn: 'root' })
export class ApmAcademicPeriodManagementService {

    private httpClient = inject(HttpClient);
    private baseUrl: string = environments.baseUrl;
    private baseUrlLaborDocente: string = environments.baseUrlLaborDocente;

    /*
    * Method to save a new academic period
    * @param newAcademicPeriod: NewAcademicPeriod
    * @returns Observable<SimpleResponse<PeriodoAcademicoResponse>>
    * */
    saveNewAcademicPeriod(newAcademicPeriod: PeriodoAcademicoCreate): Observable<SimpleResponse<PeriodoAcademicoResponse>> {
        return this.httpClient.post<SimpleResponse<PeriodoAcademicoResponse>>(`${this.baseUrl}/api/periodos-academicos`, newAcademicPeriod);
    }

    /*
    * Method to get all the academic periods
    * @param page: number
    * @param size: number
    * @returns Observable<SimpleResponse<PagedResponse<PeriodoAcademicoResponse>>>
    * 
    * */
    getAllAcademicPeriods(page: number | null, size: number | null): Observable<SimpleResponse<PagedResponse<PeriodoAcademicoResponse>>> {
        let params = new HttpParams()
            .set('page', page? page.toString() : '')
            .set('size', size? size.toString() :'');
        return this.httpClient.get<SimpleResponse<PagedResponse<PeriodoAcademicoResponse>>>(`${this.baseUrl}/api/periodos-academicos`, { params });
    }

    /*
   * Method to edit an academic period
   * @param oidAcademicPeriod: number
   * @param academicPeriod: AcademicPeriod
   * @returns Observable<SimpleResponse<any>>
   * */
    editAcademicPeriod(oidAcademicPeriod: number, academicPeriod: PeriodoAcademicoCreate): Observable<SimpleResponse<any>> {
        return this.httpClient.put<SimpleResponse<any>>(`${this.baseUrl}/api/periodos-academicos/${oidAcademicPeriod}`, academicPeriod, { responseType: 'json' });
    }

    /*
    * Method to get the active academic period
    * @returns Observable<SimpleResponse<PeriodoAcademicoResponse>> 
    * */
    activeAcademicPeriod(): Observable<SimpleResponse<PeriodoAcademicoResponse>> {
        return this.httpClient.get<SimpleResponse<PeriodoAcademicoResponse>>(`${this.baseUrl}/api/periodos-academicos/activo`);
    }

    
    loadInfoTechersAndActivities(idPeriodo: string){
        let params = new HttpParams()
            .set('idFacultad', 1)
            .set('idPeriodo', idPeriodo);

        return this.httpClient.post<SimpleResponse<any>>(`${this.baseUrlLaborDocente}/api/labor-docente`, params, { responseType: 'json' });
    }

    getAcademicPeriodsByKira(): Observable<SimpleResponse<PeriodoAcademicoKiraResponse[]>> {
        return this.httpClient.get<SimpleResponse<PeriodoAcademicoKiraResponse[]>>(`${this.baseUrl}/api/periodos-academicos/kira`, { responseType: 'json' });
    }

}