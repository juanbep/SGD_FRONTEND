import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  NombresFechaListResponse,
  GetNombreFechaResponse,
  CreateNombreFechaResponse,
  UpdateNombreFechaResponse,
  DeleteNombreFechaResponse,
  NombreFechaFilters,
  CreateNombreFechaDto,
  UpdateNombreFechaDto,
  DeleteNombreFechaDto,
} from '../../models';
import { environment } from '../../../../../environments/environments_sgd';

@Injectable({
  providedIn: 'root',
})
export class NombresFechasService {
  private readonly apiUrl = `${environment.baseUrl}/nombre-fechas`;

  constructor(private http: HttpClient) {}

  // READ - Lista con filtros y paginación
  getNombresFecha(
    filters: NombreFechaFilters = {}
  ): Observable<NombresFechaListResponse> {
    let params = this.buildHttpParams(filters);

    return this.http
      .get<NombresFechaListResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  // GET BY ID
  getNombreFechaById(
    oidNombreFecha: number
  ): Observable<GetNombreFechaResponse> {
    return this.http
      .get<GetNombreFechaResponse>(`${this.apiUrl}/${oidNombreFecha}`)
      .pipe(catchError(this.handleError));
  }

  // CREATE
  createNombreFecha(
    nombreFechaData: CreateNombreFechaDto
  ): Observable<CreateNombreFechaResponse> {
    return this.http
      .post<CreateNombreFechaResponse>(this.apiUrl, nombreFechaData)
      .pipe(catchError(this.handleError));
  }

  // UPDATE
  updateNombreFecha(
    nombreFechaData: UpdateNombreFechaDto
  ): Observable<UpdateNombreFechaResponse> {
    const { oidNombreFecha, ...updateData } = nombreFechaData;

    return this.http
      .put<UpdateNombreFechaResponse>(
        `${this.apiUrl}/${oidNombreFecha}`,
        updateData
      )
      .pipe(catchError(this.handleError));
  }

  // DELETE
  deleteNombreFecha(
    deleteData: DeleteNombreFechaDto
  ): Observable<DeleteNombreFechaResponse> {
    return this.http
      .delete<DeleteNombreFechaResponse>(
        `${this.apiUrl}/${deleteData.oidNombreFecha}`
      )
      .pipe(catchError(this.handleError));
  }

  private buildHttpParams(filters: NombreFechaFilters): HttpParams {
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

    // Filtros por usuario
    if (filters.usuarioCreacion?.trim()) {
      params = params.set('usuarioCreacion', filters.usuarioCreacion.trim());
    }
    if (filters.usuarioActualizacion?.trim()) {
      params = params.set(
        'usuarioActualizacion',
        filters.usuarioActualizacion.trim()
      );
    }

    // Filtros por fechas
    if (filters.fechaCreacionDesde) {
      params = params.set('fechaCreacionDesde', filters.fechaCreacionDesde);
    }
    if (filters.fechaCreacionHasta) {
      params = params.set('fechaCreacionHasta', filters.fechaCreacionHasta);
    }

    // Filtros especiales
    if (filters.tieneTemplate !== undefined) {
      params = params.set('tieneTemplate', filters.tieneTemplate.toString());
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
    console.error('Error en NombreFechaService:', error);
    return throwError(
      () =>
        new Error(error.mensaje || 'Error en el servicio de nombres de fechas')
    );
  }
}
