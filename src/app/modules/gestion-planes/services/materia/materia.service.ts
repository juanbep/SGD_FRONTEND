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

    if (filters.page !== undefined) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.size !== undefined) {
      params = params.set('size', filters.size.toString());
    }

    if (filters.oidPlan !== undefined) {
      params = params.set('oidPlan', filters.oidPlan.toString());
    }

    if (filters.sort?.trim()) {
      params = params.set('sort', filters.sort.trim());
    }

    if (filters.oidDepartamento !== undefined) {
      params = params.set(
        'oidDepartamento',
        filters.oidDepartamento.toString()
      );
    }

    if (filters.semestre !== undefined) {
      params = params.set('semestre', filters.semestre.toString());
    }

    if (filters.codigo?.trim()) {
      params = params.set('codigo', filters.codigo.trim());
    }

    if (filters.nombre?.trim()) {
      params = params.set('nombre', filters.nombre.trim());
    }

    if (filters.oidMateria?.trim()) {
      params = params.set('oidmateria', filters.oidMateria.trim());
    }

    return params;
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en Materias Service:', error);
    return throwError(() => error);
  }
}
