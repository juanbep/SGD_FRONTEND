import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  AsignacionesListResponse,
  CreateAsignacionResponse,
  UpdateAsignacionResponse,
  DeleteAsignacionResponse,
  GetAsignacionResponse,
  CreateAsignacionDTO,
  UpdateAsignacionDTO,
  DeleteAsignacionDTO,
  AsignacionFilters,
} from '../../models';
import { environment } from '../../../../../environments/environments_sgd';

@Injectable({
  providedIn: 'root',
})
export class AsignacionesService {
  private readonly apiUrl = `${environment.baseUrl}/necesidades/asignaciones`;

  constructor(private http: HttpClient) {}

  // READ - Lista con filtros
  getAsignaciones(
    filters: AsignacionFilters
  ): Observable<AsignacionesListResponse> {
    let params = this.buildHttpParams(filters);

    return this.http
      .get<AsignacionesListResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  // GET BY ID
  getAsignacionById(oidAsignacion: number): Observable<GetAsignacionResponse> {
    return this.http
      .get<GetAsignacionResponse>(`${this.apiUrl}/${oidAsignacion}`)
      .pipe(catchError(this.handleError));
  }

  // CREATE
  createAsignacion(
    asignacionData: CreateAsignacionDTO
  ): Observable<CreateAsignacionResponse> {
    return this.http
      .post<CreateAsignacionResponse>(this.apiUrl, asignacionData)
      .pipe(catchError(this.handleError));
  }

  // UPDATE
  updateAsignacion(
    asignacionData: UpdateAsignacionDTO
  ): Observable<UpdateAsignacionResponse> {
    const { oidAsignacion, ...updateData } = asignacionData;

    return this.http
      .put<UpdateAsignacionResponse>(
        `${this.apiUrl}/${oidAsignacion}`,
        updateData
      )
      .pipe(catchError(this.handleError));
  }

  // DELETE
  deleteAsignacion(
    deleteData: DeleteAsignacionDTO
  ): Observable<DeleteAsignacionResponse> {
    return this.http
      .delete<DeleteAsignacionResponse>(
        `${this.apiUrl}/${deleteData.oidAsignacion}`
      )
      .pipe(catchError(this.handleError));
  }

  private buildHttpParams(filters: AsignacionFilters): HttpParams {
    let params = new HttpParams();

    // Paginación
    if (filters.page !== undefined) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.size !== undefined) {
      params = params.set('size', filters.size.toString());
    }

    // Filtro obligatorio
    if (
      filters.oidCalendario !== undefined &&
      filters.oidCalendario !== null &&
      filters.oidCalendario !== ''
    ) {
      params = params.set('oidCalendario', filters.oidCalendario.toString());
    }

    // Filtros opcionales
    if (
      filters.oidDepartamento !== undefined &&
      filters.oidDepartamento !== null &&
      filters.oidDepartamento !== ''
    ) {
      params = params.set(
        'oidDepartamento',
        filters.oidDepartamento.toString()
      );
    }
    if (filters.nombreMateria?.trim()) {
      params = params.set('nombreMateria', filters.nombreMateria.trim());
    }
    if (
      filters.semestreMateria !== undefined &&
      filters.semestreMateria !== null &&
      filters.semestreMateria !== ''
    ) {
      params = params.set(
        'semestreMateria',
        filters.semestreMateria.toString()
      );
    }
    if (filters.codigoMateria?.trim()) {
      params = params.set('codigoMateria', filters.codigoMateria.trim());
    }

    // Ordenamiento
    if (filters.sort) {
      params = params.set('sort', filters.sort);
    }

    return params;
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en AsignacionesService:', error);
    return throwError(() => error);
  }
}
