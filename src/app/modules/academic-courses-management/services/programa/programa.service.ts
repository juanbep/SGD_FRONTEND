import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import {
  ProgramasListResponse,
  GetProgramaResponse,
  CreateProgramaResponse,
  UpdateProgramaResponse,
  DeleteProgramaResponse,
  ProgramaFilters,
  CreateProgramaDto,
  UpdateProgramaDto,
  DeleteProgramaDto,
} from '../../models';
import { environment } from '../../../../../environments/environments_sgd';

@Injectable({
  providedIn: 'root',
})
export class ProgramaService {
  private readonly apiUrl = `${environment.baseUrl}/programas`;

  constructor(private http: HttpClient) {}

  // READ - Lista con filtros y paginación
  getProgramas(
    filters: ProgramaFilters = {}
  ): Observable<ProgramasListResponse> {
    let params = this.buildHttpParams(filters);

    return this.http
      .get<ProgramasListResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  // GET BY ID
  getProgramaById(oidPrograma: number): Observable<GetProgramaResponse> {
    return this.http
      .get<GetProgramaResponse>(`${this.apiUrl}/${oidPrograma}`)
      .pipe(catchError(this.handleError));
  }

  // CREATE
  createPrograma(
    programaData: CreateProgramaDto
  ): Observable<CreateProgramaResponse> {
    return this.http
      .post<CreateProgramaResponse>(this.apiUrl, programaData)
      .pipe(catchError(this.handleError));
  }

  // UPDATE
  updatePrograma(
    programaData: UpdateProgramaDto
  ): Observable<UpdateProgramaResponse> {
    const { oidPrograma, ...updateData } = programaData;

    return this.http
      .put<UpdateProgramaResponse>(`${this.apiUrl}/${oidPrograma}`, updateData)
      .pipe(catchError(this.handleError));
  }

  // DELETE
  deletePrograma(
    deleteData: DeleteProgramaDto
  ): Observable<DeleteProgramaResponse> {
    return this.http
      .delete<DeleteProgramaResponse>(
        `${this.apiUrl}/${deleteData.oidPrograma}`
      )
      .pipe(catchError(this.handleError));
  }

  private buildHttpParams(filters: ProgramaFilters): HttpParams {
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
    if (filters.nombre?.trim()) {
      params = params.set('nombre', filters.nombre.trim());
    }
    if (filters.nombreCorto?.trim()) {
      params = params.set('nombreCorto', filters.nombreCorto.trim());
    }

    // Filtros específicos
    if (filters.coordinadorOidUsuario !== undefined) {
      params = params.set(
        'coordinadorOidUsuario',
        filters.coordinadorOidUsuario.toString()
      );
    }
    if (filters.coordinadorNombre?.trim()) {
      params = params.set(
        'coordinadorNombre',
        filters.coordinadorNombre.trim()
      );
    }

    // Filtros por fechas
    if (filters.fechaCreacionDesde) {
      params = params.set('fechaCreacionDesde', filters.fechaCreacionDesde);
    }
    if (filters.fechaCreacionHasta) {
      params = params.set('fechaCreacionHasta', filters.fechaCreacionHasta);
    }

    // Ordenamiento
    if (filters.sortBy) {
      params = params.set('sort', filters.sortBy);
    }
    if (filters.sortDirection) {
      params = params.set('direction', filters.sortDirection);
    }

    return params;
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en ProgramaService:', error);
    return throwError(
      () => new Error(error.mensaje || 'Error en el servicio de programas')
    );
  }
}
