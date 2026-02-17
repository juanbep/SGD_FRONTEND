import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { NecesidadDescargaFilters } from '../../models/necesidad-descarga.model';
import { environment } from '../../../../../environments/environments_sgd';

@Injectable({
  providedIn: 'root',
})
export class NecesidadDescargaService {
  private readonly apiUrl = `${environment.baseUrl}/necesidades/documentos`;

  constructor(private http: HttpClient) {}

  /**
   * Descarga el documento Excel de necesidades
   */
  descargarNecesidades(filters: NecesidadDescargaFilters): Observable<Blob> {
    let params = this.buildHttpParams(filters);

    return this.http
      .get(this.apiUrl, {
        params,
        responseType: 'blob',
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Descarga el documento Excel de necesidades con headers completos
   * Útil para obtener el nombre del archivo del header Content-Disposition
   */
  descargarNecesidadesConHeaders(
    filters: NecesidadDescargaFilters,
  ): Observable<any> {
    let params = this.buildHttpParams(filters);

    return this.http
      .get(this.apiUrl, {
        params,
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(catchError(this.handleError));
  }

  private buildHttpParams(filters: NecesidadDescargaFilters): HttpParams {
    let params = new HttpParams();

    // Parámetro obligatorio
    params = params.set('oidCalendario', filters.oidCalendario.toString());

    // Parámetro opcional (solo si se proporciona)
    if (
      filters.oidDepartamento !== undefined &&
      filters.oidDepartamento !== null
    ) {
      params = params.set(
        'oidDepartamento',
        filters.oidDepartamento.toString(),
      );
    }

    return params;
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en NecesidadDescargaService:', error);
    return throwError(() => error);
  }
}
