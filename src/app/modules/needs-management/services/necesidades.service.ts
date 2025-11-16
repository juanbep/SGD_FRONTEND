import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    let params = new HttpParams();

    if (filtros) {
      if (filtros.periodoOid)
        params = params.set('periodoOid', filtros.periodoOid);
      if (filtros.departamentoOid)
        params = params.set('departamentoOid', filtros.departamentoOid);
      if (filtros.programaOid)
        params = params.set('programaOid', filtros.programaOid);
      if (filtros.page !== undefined)
        params = params.set('page', filtros.page.toString());
      if (filtros.size !== undefined)
        params = params.set('size', filtros.size.toString());
    }

    return this.http
      .get<ApiResponse<PageResponse<Necesidad>>>(this.baseUrl, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Obtener una necesidad por OID
   */
  obtenerPorId(oid: number): Observable<Necesidad> {
    const url = `${this.baseUrl}/${oid}`;
    return this.http
      .get<ApiResponse<Necesidad>>(url)
      .pipe(map((response) => response.data));
  }
}
