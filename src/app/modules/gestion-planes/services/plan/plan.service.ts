import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  PlanesListResponse,
  GetPlanResponse,
  CreatePlanResponse,
  UpdatePlanResponse,
  DeletePlanResponse,
  PlanFilters,
  CreatePlanDto,
  UpdatePlanDto,
  DeletePlanDto,
} from '../../models';
import { environment } from '../../../../../environments/environments_sgd';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private readonly apiUrl = `${environment.baseUrl}/planes`;

  constructor(private http: HttpClient) {}

  // READ - Lista con filtros y paginación
  getPlanes(filters: PlanFilters = {}): Observable<PlanesListResponse> {
    let params = this.buildHttpParams(filters);

    return this.http
      .get<PlanesListResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  // GET BY ID
  getPlanById(oidPlan: number): Observable<GetPlanResponse> {
    return this.http
      .get<GetPlanResponse>(`${this.apiUrl}/${oidPlan}`)
      .pipe(catchError(this.handleError));
  }

  // CREATE
  createPlan(planData: CreatePlanDto): Observable<CreatePlanResponse> {
    return this.http
      .post<CreatePlanResponse>(this.apiUrl, planData)
      .pipe(catchError(this.handleError));
  }

  // UPDATE
  updatePlan(
    oidPlan: number,
    planData: UpdatePlanDto
  ): Observable<UpdatePlanResponse> {
    return this.http
      .put<UpdatePlanResponse>(`${this.apiUrl}/${oidPlan}`, planData)
      .pipe(catchError(this.handleError));
  }

  // DELETE
  deletePlan(deleteData: DeletePlanDto): Observable<DeletePlanResponse> {
    return this.http
      .delete<DeletePlanResponse>(`${this.apiUrl}/${deleteData.oidPlan}`)
      .pipe(catchError(this.handleError));
  }

  // Crear plan con opción de copiar materias
  createPlanCopia(
    planData: CreatePlanDto,
    oidPlanBase?: number
  ): Observable<CreatePlanResponse> {
    const body = {
      ...planData,
      oidPlanBase: oidPlanBase || null,
    };

    return this.http
      .post<CreatePlanResponse>(`${this.apiUrl}/crear-con-copia`, body)
      .pipe(catchError(this.handleError));
  }

  private buildHttpParams(filters: PlanFilters): HttpParams {
    let params = new HttpParams();

    // Paginación
    if (filters.page !== undefined) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.size !== undefined) {
      params = params.set('size', filters.size.toString());
    }

    // Filtros de búsqueda
    if (filters.searchTerm?.trim()) {
      params = params.set('search', filters.searchTerm.trim());
    }
    if (filters.numero) {
      params = params.set('numero', filters.numero);
    }
    if (filters.acuerdo?.trim()) {
      params = params.set('acuerdo', filters.acuerdo.trim());
    }

    // Filtros específicos
    if (filters.estado?.trim()) {
      params = params.set('estado', filters.estado.trim());
    }
    if (filters.estados && filters.estados.length > 0) {
      params = params.set('estados', filters.estados.join(','));
    }
    if (filters.oidPrograma !== undefined) {
      params = params.set('oidPrograma', filters.oidPrograma.toString());
    }
    if (filters.nombrePrograma?.trim()) {
      params = params.set('nombrePrograma', filters.nombrePrograma.trim());
    }

    // Filtros por fechas
    if (filters.fechaAprobacionDesde) {
      params = params.set('fechaAprobacionDesde', filters.fechaAprobacionDesde);
    }
    if (filters.fechaAprobacionHasta) {
      params = params.set('fechaAprobacionHasta', filters.fechaAprobacionHasta);
    }
    if (filters.fechaCreacionDesde) {
      params = params.set('fechaCreacionDesde', filters.fechaCreacionDesde);
    }
    if (filters.fechaCreacionHasta) {
      params = params.set('fechaCreacionHasta', filters.fechaCreacionHasta);
    }

    // Ordenamiento
    if (filters.sort?.trim()) {
      params = params.set('sort', filters.sort.trim());
    }

    if (filters.sortBy) {
      params = params.set('sort', filters.sortBy);
    }
    if (filters.sortDirection) {
      params = params.set('direction', filters.sortDirection);
    }

    return params;
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en PlanService:', error);
    return throwError(() => error);
  }
}
