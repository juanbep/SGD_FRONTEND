import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  ActividadesListResponse,
  CreateActividadResponse,
  UpdateActividadResponse,
  DeleteActividadResponse,
  GetActividadResponse,
  CreateActividadDTO,
  UpdateActividadDTO,
  DeleteActividadDTO,
  DesasignarUsuarioActividadResponse,
  ActividadFilters,
  CreateActividadesBatchResponse,
  ActividadDocenciaFilters,
  ActividadesDocenciaListResponse,
} from '../../models';
import { environment } from '../../../../../environments/environments_sgd';
import { ActividadDocenciaResponse } from '../../models/actividad-docencia-response.model';

@Injectable({
  providedIn: 'root',
})
export class ActividadesService {
  private readonly apiUrl = `${environment.baseUrl}/usuario-actividad-calendario`;

  constructor(private http: HttpClient) {}

  // READ - Lista con filtros
  getActividades(
    filters: ActividadFilters = {}
  ): Observable<ActividadesListResponse> {
    let params = this.buildHttpParams(filters);

    return this.http
      .get<ActividadesListResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  // GET BY ID
  getActividadById(oidActividad: number): Observable<GetActividadResponse> {
    return this.http
      .get<GetActividadResponse>(`${this.apiUrl}/${oidActividad}`)
      .pipe(catchError(this.handleError));
  }

  // CREATE - Actividad única
  createActividad(
    actividadData: CreateActividadDTO
  ): Observable<CreateActividadResponse> {
    return this.http
      .post<CreateActividadResponse>(this.apiUrl, actividadData)
      .pipe(catchError(this.handleError));
  }

  // NUEVO: CREATE - Múltiples actividades en lote
  createActividadesEnLote(
    actividadesData: CreateActividadDTO[]
  ): Observable<CreateActividadesBatchResponse> {
    // Tipo actualizado
    return this.http
      .post<CreateActividadesBatchResponse>(
        `${this.apiUrl}/batch`,
        actividadesData
      )
      .pipe(catchError(this.handleError));
  }

  // UPDATE
  updateActividad(
    actividadData: UpdateActividadDTO
  ): Observable<UpdateActividadResponse> {
    const { oidActividad, ...updateData } = actividadData;

    return this.http
      .put<UpdateActividadResponse>(
        `${this.apiUrl}/${oidActividad}`,
        updateData
      )
      .pipe(catchError(this.handleError));
  }

  // DELETE
  deleteActividad(
    deleteData: DeleteActividadDTO
  ): Observable<DeleteActividadResponse> {
    return this.http
      .delete<DeleteActividadResponse>(
        `${this.apiUrl}/${deleteData.oidActividad}`
      )
      .pipe(catchError(this.handleError));
  }

  // DESASIGNAR USUARIO DE ACTIVIDAD
  desasignarUsuarioDeActividad(
    oidActividad: number,
    oidCalendario: number,
    oidUsuario: number
  ): Observable<DesasignarUsuarioActividadResponse> {
    const params = new HttpParams()
      .set('oidUsuario', oidUsuario.toString())
      .set('oidCalendario', oidCalendario.toString());

    return this.http
      .delete<DesasignarUsuarioActividadResponse>(
        `${this.apiUrl}/${oidActividad}/relacion`,
        { params }
      )
      .pipe(catchError(this.handleError));
  }

  // READ - Actividades de Docencia con filtros específicos
  getActividadesDocencia(
    filters: ActividadDocenciaFilters = {}
  ): Observable<ActividadesDocenciaListResponse> {
    let params = this.buildHttpParamsDocencia(filters);

    return this.http
      .get<ActividadesDocenciaListResponse>(`${this.apiUrl}/tipo/docencia`, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  private buildHttpParams(filters: ActividadFilters): HttpParams {
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
    if (filters.nombreActividad?.trim()) {
      params = params.set('nombreActividad', filters.nombreActividad.trim());
    }

    // Filtros por ID/estado
    if (
      filters.oidEstadoActividad !== undefined &&
      filters.oidEstadoActividad !== null &&
      filters.oidEstadoActividad !== ''
    ) {
      params = params.set(
        'oidEstadoActividad',
        filters.oidEstadoActividad.toString()
      );
    }
    if (
      filters.oidCalendario !== undefined &&
      filters.oidCalendario !== null &&
      filters.oidCalendario !== ''
    ) {
      params = params.set('oidCalendario', filters.oidCalendario.toString());
    }
    if (
      filters.oidDepartamento !== undefined &&
      filters.oidDepartamento !== null
    ) {
      params = params.set(
        'oidDepartamento',
        filters.oidDepartamento.toString()
      );
    }
    if (
      filters.oidTipoActividad !== undefined &&
      filters.oidTipoActividad !== null &&
      filters.oidTipoActividad !== ''
    ) {
      params = params.set(
        'oidTipoActividad',
        filters.oidTipoActividad.toString()
      );
    }

    // Filtro por Usuario Responsable
    if (
      filters.oidUsuarioResponsable !== undefined &&
      filters.oidUsuarioResponsable !== null &&
      filters.oidUsuarioResponsable !== ''
    ) {
      params = params.set(
        'oidUsuarioResponsable',
        filters.oidUsuarioResponsable.toString()
      );
    }

    // Filtros por rangos
    if (filters.horasMin !== undefined) {
      params = params.set('horasMin', filters.horasMin.toString());
    }
    if (filters.horasMax !== undefined) {
      params = params.set('horasMax', filters.horasMax.toString());
    }
    if (filters.semanasMin !== undefined) {
      params = params.set('semanasMin', filters.semanasMin.toString());
    }
    if (filters.semanasMax !== undefined) {
      params = params.set('semanasMax', filters.semanasMax.toString());
    }

    // Filtros por fechas
    if (filters.fechaCreacionDesde) {
      params = params.set('fechaCreacionDesde', filters.fechaCreacionDesde);
    }
    if (filters.fechaCreacionHasta) {
      params = params.set('fechaCreacionHasta', filters.fechaCreacionHasta);
    }

    // Filtros por atributos específicos
    if (filters.semestre?.trim()) {
      params = params.set('semestre', filters.semestre.trim());
    }
    if (filters.nombreEstudiante?.trim()) {
      params = params.set('nombreEstudiante', filters.nombreEstudiante.trim());
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

  private buildHttpParamsDocencia(
    filters: ActividadDocenciaFilters
  ): HttpParams {
    let params = new HttpParams();

    // Paginación (obligatorios)
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
      filters.oidDepartamento !== undefined &&
      filters.oidDepartamento !== null &&
      filters.oidDepartamento !== undefined
    ) {
      params = params.set(
        'oidDepartamento',
        filters.oidDepartamento.toString()
      );
    }

    // Filtros opcionales
    if (
      filters.oidUsuario !== undefined &&
      filters.oidUsuario !== null &&
      filters.oidUsuario !== ''
    ) {
      params = params.set('oidUsuario', filters.oidUsuario.toString());
    }

    if (filters.tipoContratacion?.trim()) {
      params = params.set('tipoContratacion', filters.tipoContratacion.trim());
    }

    if (filters.semestre !== undefined && filters.semestre !== null) {
      params = params.set('semestre', filters.semestre.toString());
    }

    // Ordenamiento
    if (filters.sort) {
      params = params.set('sort', filters.sort);
    }

    return params;
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en ActividadesService:', error);
    return throwError(() => error);
  }
}
