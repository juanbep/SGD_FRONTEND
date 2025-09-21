import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import {
  CargosActividadListResponse,
  GetCargoActividadResponse,
  CreateCargoActividadResponse,
  UpdateCargoActividadResponse,
  DeleteCargoActividadResponse,
  CargoActividadFilters,
  CreateCargoActividadDTO,
  UpdateCargoActividadDTO,
  DeleteCargoActividadDTO,
} from '../../models/cargos-actividad.models';
import { environment } from '../../../../../environments/environments_sgd';

@Injectable({
  providedIn: 'root',
})
export class CargosActividadService {
  private readonly apiUrl = `${environment.baseUrl}/cargos-actividad`;

  constructor(private http: HttpClient) {}

  // READ - Lista con filtros y paginación
  getCargosActividad(
    filters: CargoActividadFilters = {}
  ): Observable<CargosActividadListResponse> {
    let params = this.buildHttpParams(filters);

    return this.http
      .get<CargosActividadListResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  // GET BY ID
  getCargoActividadById(
    oidCargoActividad: number
  ): Observable<GetCargoActividadResponse> {
    return this.http
      .get<GetCargoActividadResponse>(`${this.apiUrl}/${oidCargoActividad}`)
      .pipe(catchError(this.handleError));
  }

  // CREATE
  createCargoActividad(
    cargoData: CreateCargoActividadDTO
  ): Observable<CreateCargoActividadResponse> {
    return this.http
      .post<CreateCargoActividadResponse>(this.apiUrl, cargoData)
      .pipe(catchError(this.handleError));
  }

  // UPDATE
  updateCargoActividad(
    cargoData: UpdateCargoActividadDTO
  ): Observable<UpdateCargoActividadResponse> {
    const { oidCargoActividad, ...updateData } = cargoData;

    return this.http
      .put<UpdateCargoActividadResponse>(
        `${this.apiUrl}/${oidCargoActividad}`,
        updateData
      )
      .pipe(catchError(this.handleError));
  }

  // DELETE
  deleteCargoActividad(
    deleteData: DeleteCargoActividadDTO
  ): Observable<DeleteCargoActividadResponse> {
    return this.http
      .delete<DeleteCargoActividadResponse>(
        `${this.apiUrl}/${deleteData.oidCargoActividad}`
      )
      .pipe(catchError(this.handleError));
  }

  private buildHttpParams(filters: CargoActividadFilters): HttpParams {
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

    // Filtros específicos
    if (filters.tipo?.trim()) {
      params = params.set('tipo', filters.tipo.trim());
    }
    if (filters.oidTipoActividad !== undefined) {
      params = params.set('tipoActividad', filters.oidTipoActividad.toString());
    }
    if (filters.nombreTipoActividad?.trim()) {
      params = params.set(
        'nombreTipoActividad',
        filters.nombreTipoActividad.trim()
      );
    }

    // Filtros por rango de horas
    if (filters.maxHorasSemanaMin !== undefined) {
      params = params.set(
        'maxHorasSemanaMin',
        filters.maxHorasSemanaMin.toString()
      );
    }
    if (filters.maxHorasSemanaMax !== undefined) {
      params = params.set(
        'maxHorasSemanaMax',
        filters.maxHorasSemanaMax.toString()
      );
    }

    // Filtros por fechas
    if (filters.fechaCreacionDesde) {
      params = params.set('fechaCreacionDesde', filters.fechaCreacionDesde);
    }
    if (filters.fechaCreacionHasta) {
      params = params.set('fechaCreacionHasta', filters.fechaCreacionHasta);
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
    console.error('Error en CargosActividadService:', error);
    return throwError(
      () =>
        new Error(
          error.mensaje || 'Error en el servicio de cargos de actividad'
        )
    );
  }
}
