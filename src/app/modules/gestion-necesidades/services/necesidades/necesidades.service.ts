import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  NecesidadesListResponse,
  CreateNecesidadResponse,
  UpdateNecesidadResponse,
  DeleteNecesidadResponse,
  GetNecesidadResponse,
  CreateNecesidadDTO,
  UpdateNecesidadDTO,
  DeleteNecesidadDTO,
  NecesidadFilters,
  CreateNecesidadLoteDTO,
  CreateNecesidadLoteResponse,
} from '../../models';
import { environment } from '../../../../../environments/environments_sgd';

@Injectable({
  providedIn: 'root',
})
export class NecesidadesService {
  private readonly apiUrl = `${environment.baseUrl}/necesidades`;

  constructor(private http: HttpClient) {}

  // READ - Lista con filtros
  getNecesidades(
    filters: NecesidadFilters
  ): Observable<NecesidadesListResponse> {
    let params = this.buildHttpParams(filters);

    return this.http
      .get<NecesidadesListResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  // GET BY ID
  getNecesidadById(oidNecesidad: number): Observable<GetNecesidadResponse> {
    return this.http
      .get<GetNecesidadResponse>(`${this.apiUrl}/${oidNecesidad}`)
      .pipe(catchError(this.handleError));
  }

  // CREATE
  createNecesidad(
    necesidadData: CreateNecesidadDTO
  ): Observable<CreateNecesidadResponse> {
    return this.http
      .post<CreateNecesidadResponse>(this.apiUrl, necesidadData)
      .pipe(catchError(this.handleError));
  }

  // CREATE LOTE
  createNecesidadesLote(
    loteData: CreateNecesidadLoteDTO
  ): Observable<CreateNecesidadLoteResponse> {
    return this.http
      .post<CreateNecesidadLoteResponse>(`${this.apiUrl}/lote`, loteData)
      .pipe(catchError(this.handleError));
  }

  // UPDATE
  updateNecesidad(
    necesidadData: UpdateNecesidadDTO
  ): Observable<UpdateNecesidadResponse> {
    const { oidNecesidad, ...updateData } = necesidadData;

    return this.http
      .put<UpdateNecesidadResponse>(
        `${this.apiUrl}/${oidNecesidad}`,
        updateData
      )
      .pipe(catchError(this.handleError));
  }

  // DELETE
  deleteNecesidad(
    deleteData: DeleteNecesidadDTO
  ): Observable<DeleteNecesidadResponse> {
    return this.http
      .delete<DeleteNecesidadResponse>(
        `${this.apiUrl}/${deleteData.oidNecesidad}`
      )
      .pipe(catchError(this.handleError));
  }

  private buildHttpParams(filters: NecesidadFilters): HttpParams {
    let params = new HttpParams();

    // Paginación
    if (filters.page !== undefined) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.size !== undefined) {
      params = params.set('size', filters.size.toString());
    }

    // Filtros obligatorios
    if (
      filters.oidCalendario !== undefined &&
      filters.oidCalendario !== null &&
      filters.oidCalendario !== ''
    ) {
      params = params.set('oidCalendario', filters.oidCalendario.toString());
    }
    if (
      filters.oidPrograma !== undefined &&
      filters.oidPrograma !== null &&
      filters.oidPrograma !== ''
    ) {
      params = params.set('oidPrograma', filters.oidPrograma.toString());
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
    if (filters.estado?.trim()) {
      params = params.set('estado', filters.estado.trim());
    }
    if (
      filters.idMateria !== undefined &&
      filters.idMateria !== null &&
      filters.idMateria !== ''
    ) {
      params = params.set('idMateria', filters.idMateria.toString());
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
    console.error('Error en NecesidadesService:', error);
    return throwError(() => error);
  }
}
