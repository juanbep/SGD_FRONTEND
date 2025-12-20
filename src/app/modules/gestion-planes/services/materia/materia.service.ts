import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  MateriasListResponse,
  GetMateriaResponse,
  CreateMateriaResponse,
  UpdateMateriaResponse,
  DeleteMateriaResponse,
  MateriaFilters,
  CreateMateriaDto,
  UpdateMateriaDto,
  DeleteMateriaDto,
} from '../../models';
import { environment } from '../../../../../environments/environments_sgd';

@Injectable({
  providedIn: 'root',
})
export class MateriaService {
  private readonly apiUrl = `${environment.baseUrl}/materias`;
  private readonly apiUrlPlanes = `${environment.baseUrl}/planes`;

  constructor(private http: HttpClient) {}

  // READ - Lista con filtros y paginación
  getMaterias(filters: MateriaFilters = {}): Observable<MateriasListResponse> {
    let params = this.buildHttpParams(filters);

    return this.http
      .get<MateriasListResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  // GET BY ID
  getMateriaById(idMateria: number): Observable<GetMateriaResponse> {
    return this.http
      .get<GetMateriaResponse>(`${this.apiUrl}/${idMateria}`)
      .pipe(catchError(this.handleError));
  }

  // CREATE
  createMateria(
    materiaData: CreateMateriaDto
  ): Observable<CreateMateriaResponse> {
    return this.http
      .post<CreateMateriaResponse>(this.apiUrl, materiaData)
      .pipe(catchError(this.handleError));
  }

  // UPDATE
  updateMateria(
    materiaData: UpdateMateriaDto
  ): Observable<UpdateMateriaResponse> {
    const { idMateria, ...updateData } = materiaData;

    return this.http
      .put<UpdateMateriaResponse>(`${this.apiUrl}/${idMateria}`, updateData)
      .pipe(catchError(this.handleError));
  }

  // DELETE
  deleteMateria(
    deleteData: DeleteMateriaDto
  ): Observable<DeleteMateriaResponse> {
    return this.http
      .delete<DeleteMateriaResponse>(`${this.apiUrl}/${deleteData.idMateria}`)
      .pipe(catchError(this.handleError));
  }

  // DESCARGAR PLANILLA EXCEL MATERIAS
  descargarPlanillaExcel(oidPlan: number): Observable<Blob> {
    return this.http
      .get(`${this.apiUrlPlanes}/documentos/`, {
        params: new HttpParams().set('oidPlan', oidPlan.toString()),
        responseType: 'blob',
      })
      .pipe(catchError(this.handleError));
  }

  cargarPlanillaExcel(oidPlan: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('oidPlan', oidPlan.toString());
    formData.append('file', file);

    return this.http
      .post(`${this.apiUrlPlanes}/documentos/`, formData, {
        responseType: 'text' as 'json',
      })
      .pipe(catchError(this.handleError));
  }

  getMateriasLibres(
    filters: MateriaFilters = {}
  ): Observable<MateriasListResponse> {
    let params = this.buildHttpParams(filters);

    return this.http
      .get<MateriasListResponse>(`${this.apiUrl}/libres`, { params })
      .pipe(catchError(this.handleError));
  }

  private buildHttpParams(filters: MateriaFilters): HttpParams {
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
    if (filters.oidMateria?.trim()) {
      params = params.set('oidMateria', filters.oidMateria.trim());
    }
    if (filters.codigo?.trim()) {
      params = params.set('codigo', filters.codigo.trim());
    }
    if (filters.nombre?.trim()) {
      params = params.set('nombre', filters.nombre.trim());
    }

    // Filtros específicos
    if (filters.semestre !== undefined) {
      params = params.set('semestre', filters.semestre.toString());
    }
    if (filters.oidDepartamento !== undefined) {
      params = params.set(
        'oidDepartamento',
        filters.oidDepartamento.toString()
      );
    }
    if (filters.nombreDepartamento?.trim()) {
      params = params.set(
        'nombreDepartamento',
        filters.nombreDepartamento.trim()
      );
    }
    if (filters.oidPlan !== undefined) {
      params = params.set('oidPlan', filters.oidPlan.toString());
    }
    if (filters.numeroPlan?.trim()) {
      params = params.set('numeroPlan', filters.numeroPlan.trim());
    }

    // Filtros por horas
    if (filters.horasSemanaMinimasDesde !== undefined) {
      params = params.set(
        'horasSemanaMinimasDesde',
        filters.horasSemanaMinimasDesde.toString()
      );
    }
    if (filters.horasSemanaMinimasHasta !== undefined) {
      params = params.set(
        'horasSemanaMinimasHasta',
        filters.horasSemanaMinimasHasta.toString()
      );
    }

    // Filtros por correquisito
    if (filters.tieneCorrequisito !== undefined) {
      params = params.set(
        'tieneCorrequisito',
        filters.tieneCorrequisito.toString()
      );
    }
    if (filters.idCorrequisito !== undefined) {
      params = params.set('idCorrequisito', filters.idCorrequisito.toString());
    }

    // Filtros por fechas
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
    console.error('Error en Materias Service:', error);
    return throwError(() => error);
  }
}
