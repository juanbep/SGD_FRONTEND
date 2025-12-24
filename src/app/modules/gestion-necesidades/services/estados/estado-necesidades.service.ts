import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  CambioEstadoResponse,
  CambioEstadoParams,
  CambioEstadoPorOidDTO,
} from '../../models';
import { environment } from '../../../../../environments/environments_sgd';

@Injectable({
  providedIn: 'root',
})
export class EstadoNecesidadesService {
  private readonly apiUrl = `${environment.baseUrl}/necesidades/estado`;

  constructor(private http: HttpClient) {}

  // ========== MÉTODO GENÉRICO ==========

  /**
   * Método genérico para cambiar estado de necesidades en lote
   * @param estadoOrigen Estado actual de las necesidades
   * @param estadoDestino Estado al que se quiere transicionar
   * @param params Parámetros requeridos (oidCalendario, oidPrograma, oidDepartamento)
   */
  cambiarEstado(
    estadoOrigen: string,
    estadoDestino: string,
    params: CambioEstadoParams
  ): Observable<CambioEstadoResponse> {
    const httpParams = this.buildHttpParams(params);

    return this.http
      .patch<CambioEstadoResponse>(
        `${this.apiUrl}/${estadoOrigen}/${estadoDestino}`,
        null,
        { params: httpParams }
      )
      .pipe(catchError(this.handleError));
  }

  // ========== MÉTODO ESPECIAL: CAMBIO POR OIDs ==========

  /**
   * Cambiar estado de un grupo específico de necesidades por sus OIDs
   * @param data DTO con oidNecesidades, estadoOrigen y estadoDestino
   * @param oidCalendario ID del calendario
   * @param oidDepartamento ID del departamento
   */
  cambiarEstadoPorOid(
    data: CambioEstadoPorOidDTO,
    oidCalendario: number,
    oidDepartamento: number
  ): Observable<CambioEstadoResponse> {
    const params = new HttpParams()
      .set('oidCalendario', oidCalendario.toString())
      .set('oidDepartamento', oidDepartamento.toString());

    return this.http
      .patch<CambioEstadoResponse>(`${this.apiUrl}/por-oid`, data, { params })
      .pipe(catchError(this.handleError));
  }

  // ========== MÉTODOS ESPECÍFICOS POR TRANSICIÓN ==========

  /**
   * BORRADOR → EN_REVISION_SECRETARIO
   * Enviar necesidades en borrador a revisión del secretario
   */
  enviarBorradorARevisionSecretario(
    oidCalendario: number,
    oidPrograma: number
  ): Observable<CambioEstadoResponse> {
    return this.cambiarEstado('borrador', 'en-revision-secretario', {
      oidCalendario,
      oidPrograma,
    });
  }

  /**
   * EN_REVISION_SECRETARIO → BORRADOR
   * Devolver necesidades desde revisión secretario a borrador
   */
  devolverRevisionSecretarioABorrador(
    oidCalendario: number,
    oidPrograma: number
  ): Observable<CambioEstadoResponse> {
    return this.cambiarEstado('en-revision-secretario', 'borrador', {
      oidCalendario,
      oidPrograma,
    });
  }

  /**
   * EN_REVISION_SECRETARIO → EN_REVISION_JEFE
   * Enviar necesidades desde revisión secretario a revisión jefe
   */
  enviarRevisionSecretarioARevisionJefe(
    oidCalendario: number,
    oidPrograma: number,
    oidDepartamento: number
  ): Observable<CambioEstadoResponse> {
    return this.cambiarEstado('en-revision-secretario', 'en-revision-jefe', {
      oidCalendario,
      oidPrograma,
      oidDepartamento,
    });
  }

  /**
   * EN_REVISION_JEFE → EN_REVISION_SECRETARIO
   * Devolver necesidades desde revisión jefe a revisión secretario
   */
  devolverRevisionJefeARevisionSecretario(
    oidCalendario: number,
    oidPrograma: number,
    oidDepartamento: number
  ): Observable<CambioEstadoResponse> {
    return this.cambiarEstado('en-revision-jefe', 'en-revision-secretario', {
      oidCalendario,
      oidPrograma,
      oidDepartamento,
    });
  }

  /**
   * EN_REVISION_JEFE → NO_ASIGNADA
   * Enviar necesidades desde revisión jefe a no asignadas
   */
  enviarRevisionJefeANoAsignada(
    oidCalendario: number,
    oidDepartamento: number
  ): Observable<CambioEstadoResponse> {
    return this.cambiarEstado('en-revision-jefe', 'no-asignada', {
      oidCalendario,
      oidDepartamento,
    });
  }

  // ========== MÉTODOS PRIVADOS ==========

  private buildHttpParams(params: CambioEstadoParams): HttpParams {
    let httpParams = new HttpParams();

    if (params.oidCalendario !== undefined && params.oidCalendario !== null) {
      httpParams = httpParams.set(
        'oidCalendario',
        params.oidCalendario.toString()
      );
    }
    if (params.oidPrograma !== undefined && params.oidPrograma !== null) {
      httpParams = httpParams.set('oidPrograma', params.oidPrograma.toString());
    }
    if (
      params.oidDepartamento !== undefined &&
      params.oidDepartamento !== null
    ) {
      httpParams = httpParams.set(
        'oidDepartamento',
        params.oidDepartamento.toString()
      );
    }

    return httpParams;
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en EstadoNecesidadesService:', error);
    return throwError(() => error);
  }
}
