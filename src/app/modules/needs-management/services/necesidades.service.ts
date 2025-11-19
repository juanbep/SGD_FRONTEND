import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environments } from '../../../../environments/environments';
import { ApiResponse } from '../models/api-response.interface';
import { PageResponse } from '../models/page-response.interface';
import { Necesidad } from '../models/necesidad.interface';

export interface FiltrosNecesidad {
  periodoOid?: string;
  departamentoOid?: string;
  programaOid?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class NecesidadesService {
  private readonly baseUrl = `${environments.baseUrlSGD}/sgd-back/api/necesidades`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Lista necesidades con paginación y filtros opcionales
   */
  listar(filtros?: FiltrosNecesidad): Observable<PageResponse<Necesidad>> {
    const params = this.buildParams(filtros);

    return this.http
      .get<ApiResponse<PageResponse<Necesidad>>>(this.baseUrl, { params })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error('Error al listar necesidades', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Construye los parámetros de consulta para las necesidades
   */
  private buildParams(filtros?: FiltrosNecesidad): HttpParams {
    let params = new HttpParams();

    if (filtros) {
      const { periodoOid, departamentoOid, programaOid, page, size } = filtros;

      if (periodoOid) params = params.set('periodoOid', periodoOid);
      if (departamentoOid)
        params = params.set('departamentoOid', departamentoOid);
      if (programaOid) params = params.set('programaOid', programaOid);
      if (page !== undefined) params = params.set('page', page.toString());
      if (size !== undefined) params = params.set('size', size.toString());
    }

    return params;
  }

  /**
   * Obtener una necesidad por OID
   */
  obtenerPorId(oid: number): Observable<Necesidad> {
    const url = `${this.baseUrl}/${oid}`;
    return this.http
      .get<ApiResponse<Necesidad>>(url)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error(`Error al obtener necesidad ${oid}`, error);
          return throwError(() => error);
        })
      );
  }
}
