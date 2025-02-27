import { inject, Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PeriodoAcademicoResponse } from '../../models/response/periodo-academico-response.model';
import { PagedResponse } from '../../models/response/paged-response.model';
import { PeriodoAcademicoCreate } from '../../models/modified/periodo-academico-create.model';

@Injectable({ providedIn: 'root' })
export class ApmAcademicPeriodManagementService {

    private httpClient = inject(HttpClient);
    private baseUrl: string = environments.baseUrl;

    /*
    * Method to save a new academic period
    * @param newAcademicPeriod: NewAcademicPeriod
    * @returns Observable<AcademicPeriod>
    * */
    saveNewAcademicPeriod(newAcademicPeriod: PeriodoAcademicoCreate): Observable<PeriodoAcademicoResponse> {
        return this.httpClient.post<PeriodoAcademicoResponse>(`${this.baseUrl}/api/periodos-academicos`, newAcademicPeriod);
    }

    /*
    * Method to get all the academic periods
    * @returns Observable<PeriodoAcademicoResponse>
    * */
    getAllAcademicPeriods(page: number | null, size: number | null): Observable<PagedResponse<PeriodoAcademicoResponse>> {
        let params = new HttpParams()
            .set('page', page? page.toString() : '')
            .set('size', size? size.toString() :'');
        return this.httpClient.get<PagedResponse<PeriodoAcademicoResponse>>(`${this.baseUrl}/api/periodos-academicos`, { params });
    }

    /*
   * Method to edit an academic period
   * @param academicPeriod: AcademicPeriod
   * @returns Observable<AcademicPeriod>
   * */
    editAcademicPeriod(oidAcademicPeriod: number, academicPeriod: PeriodoAcademicoCreate): Observable<string> {
        return this.httpClient.put<string>(`${this.baseUrl}/api/periodos-academicos/${oidAcademicPeriod}`, academicPeriod, { responseType: 'text' as 'json' });
    }

    /*
    * Method to get the active academic period
    * @returns Observable<AcademicPeriod>
    * */
    activeAcademicPeriod(): Observable<PeriodoAcademicoResponse> {
        return this.httpClient.get<PeriodoAcademicoResponse>(`${this.baseUrl}/api/periodos-academicos/activo`);
    }
}