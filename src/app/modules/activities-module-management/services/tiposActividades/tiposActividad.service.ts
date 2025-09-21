import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environments_sgd';
import {
  TiposActividadListResponse,
  GetTipoActividadResponse,
  CreateTipoActividadResponse,
  UpdateTipoActividadResponse,
  DeleteTipoActividadResponse,
  TipoActividadFilters,
  CreateTipoActividadDto,
  UpdateTipoActividadDto,
  DeleteTipoActividadDto,
} from '../../models';

@Injectable({
  providedIn: 'root',
})
export class TiposActividadService {
  private readonly apiUrl = `${environment.baseUrl}/tipo-actividad`;

  constructor(private http: HttpClient) {}

  // READ - Lista con filtros y paginación
  getTiposActividad(
    filters: TipoActividadFilters = {}
  ): Observable<TiposActividadListResponse> {
    let params = this.buildHttpParams(filters);

    return this.http
      .get<TiposActividadListResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  // GET BY ID
  getTipoActividadById(
    oidTipoActividad: number
  ): Observable<GetTipoActividadResponse> {
    return this.http
      .get<GetTipoActividadResponse>(`${this.apiUrl}/${oidTipoActividad}`)
      .pipe(catchError(this.handleError));
  }

  // CREATE - Posiblemente no se use pero por si las moscas
  createTipoActividad(
    tipoActividadData: CreateTipoActividadDto
  ): Observable<CreateTipoActividadResponse> {
    return this.http
      .post<CreateTipoActividadResponse>(this.apiUrl, tipoActividadData)
      .pipe(catchError(this.handleError));
  }

  // UPDATE - Posiblemente no se use pero por si las moscas
  updateTipoActividad(
    tipoActividadData: UpdateTipoActividadDto
  ): Observable<UpdateTipoActividadResponse> {
    const { oidTipoActividad, ...updateData } = tipoActividadData;

    return this.http
      .put<UpdateTipoActividadResponse>(
        `${this.apiUrl}/${oidTipoActividad}`,
        updateData
      )
      .pipe(catchError(this.handleError));
  }

  // DELETE - Posiblemente no se use pero por si las moscas
  deleteTipoActividad(
    deleteData: DeleteTipoActividadDto
  ): Observable<DeleteTipoActividadResponse> {
    return this.http
      .delete<DeleteTipoActividadResponse>(
        `${this.apiUrl}/${deleteData.oidTipoActividad}`
      )
      .pipe(catchError(this.handleError));
  }

  private buildHttpParams(filters: TipoActividadFilters): HttpParams {
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
    if (filters.descripcion?.trim()) {
      params = params.set('descripcion', filters.descripcion.trim());
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
    console.error('Error en TiposActividadService:', error);
    return throwError(
      () =>
        new Error(error.mensaje || 'Error en el servicio de tipos de actividad')
    );
  }
}
