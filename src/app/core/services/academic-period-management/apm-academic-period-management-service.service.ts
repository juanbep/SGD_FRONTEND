import { inject, Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { Observable } from 'rxjs';
import { AcademicPeriod, AcademicPeriodResponse, NewAcademicPeriod } from '../../models/academicPeriods';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApmAcademicPeriodManagementService {

    private httpClient = inject(HttpClient);
    private baseUrl: string = environments.baseUrl;

    /*
    * Method to save a new academic period
    * @param newAcademicPeriod: NewAcademicPeriod
    * @returns Observable<AcademicPeriod>
    * */
    saveNewAcademicPeriod(newAcademicPeriod: NewAcademicPeriod): Observable<AcademicPeriod> {
        return this.httpClient.post<AcademicPeriod>(`${this.baseUrl}/api/periodos-academicos`, newAcademicPeriod);
    }

    /*
    * Method to get all the academic periods
    * @returns Observable<AcademicPeriodResponse>
    * */
    getAllAcademicPeriods(page: number | null, size: number | null): Observable<AcademicPeriodResponse> {
        let params = new HttpParams()
            .set('page', page? page.toString() : '')
            .set('size', size? size.toString() :'');
        return this.httpClient.get<AcademicPeriodResponse>(`${this.baseUrl}/api/periodos-academicos`, { params });
    }

    /*
   * Method to edit an academic period
   * @param academicPeriod: AcademicPeriod
   * @returns Observable<AcademicPeriod>
   * */
    editAcademicPeriod(oidAcademicPeriod: number, academicPeriod: NewAcademicPeriod): Observable<string> {
        return this.httpClient.put<string>(`${this.baseUrl}/api/periodos-academicos/${oidAcademicPeriod}`, academicPeriod, { responseType: 'text' as 'json' });
    }

    /*
    * Method to get the active academic period
    * @returns Observable<AcademicPeriod>
    * */
    activeAcademicPeriod(): Observable<AcademicPeriod> {
        return this.httpClient.get<AcademicPeriod>(`${this.baseUrl}/api/periodos-academicos/activo`);
    }
}