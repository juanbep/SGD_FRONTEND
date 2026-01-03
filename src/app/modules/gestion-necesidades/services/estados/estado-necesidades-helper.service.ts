import { Injectable, inject } from '@angular/core';
import { EstadoNecesidadesService } from './estado-necesidades.service';
import { BaseHelperService } from '../base-helper.service';
import {
  CambioEstadoData,
  CambioEstadoParams,
  CambioEstadoPorOidDTO,
} from '../../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstadoNecesidadesHelperService {
  private estadoService = inject(EstadoNecesidadesService);
  private baseHelper = inject(BaseHelperService);

  // ========== MÉTODO GENÉRICO ==========

  async cambiarEstado(
    estadoOrigen: string,
    estadoDestino: string,
    params: CambioEstadoParams
  ): Promise<CambioEstadoData | null> {
    return this.baseHelper.getDataFromResponse(
      this.estadoService.cambiarEstado(estadoOrigen, estadoDestino, params)
    );
  }

  cambiarEstadoObservable(
    estadoOrigen: string,
    estadoDestino: string,
    params: CambioEstadoParams
  ): Observable<CambioEstadoData | null> {
    return this.baseHelper.getDataFromResponseObservable(
      this.estadoService.cambiarEstado(estadoOrigen, estadoDestino, params)
    );
  }

  // ========== MÉTODO POR OID ==========

  async cambiarEstadoPorOid(
    data: CambioEstadoPorOidDTO,
    oidCalendario: number,
    oidDepartamento: number
  ): Promise<CambioEstadoData | null> {
    return this.baseHelper.getDataFromResponse(
      this.estadoService.cambiarEstadoPorOid(
        data,
        oidCalendario,
        oidDepartamento
      )
    );
  }

  cambiarEstadoPorOidObservable(
    data: CambioEstadoPorOidDTO,
    oidCalendario: number,
    oidDepartamento: number
  ): Observable<CambioEstadoData | null> {
    return this.baseHelper.getDataFromResponseObservable(
      this.estadoService.cambiarEstadoPorOid(
        data,
        oidCalendario,
        oidDepartamento
      )
    );
  }

  // ========== MÉTODOS ESPECÍFICOS (ACTUALIZADOS) ==========

  async enviarBorradorARevisionSecretario(
    oidCalendario: number,
    oidPrograma: number,
    oidNecesidades?: number[]
  ): Promise<CambioEstadoData | null> {
    return this.baseHelper.getDataFromResponse(
      this.estadoService.enviarBorradorARevisionSecretario(
        oidCalendario,
        oidPrograma,
        oidNecesidades
      )
    );
  }

  async devolverRevisionSecretarioABorrador(
    oidCalendario: number,
    oidPrograma: number,
    oidNecesidades?: number[]
  ): Promise<CambioEstadoData | null> {
    return this.baseHelper.getDataFromResponse(
      this.estadoService.devolverRevisionSecretarioABorrador(
        oidCalendario,
        oidPrograma,
        oidNecesidades
      )
    );
  }

  async enviarRevisionSecretarioARevisionJefe(
    oidCalendario: number,
    oidPrograma: number,
    oidNecesidades?: number[]
  ): Promise<CambioEstadoData | null> {
    return this.baseHelper.getDataFromResponse(
      this.estadoService.enviarRevisionSecretarioARevisionJefe(
        oidCalendario,
        oidPrograma,
        oidNecesidades
      )
    );
  }

  async devolverRevisionJefeARevisionSecretario(
    oidCalendario: number,
    oidPrograma: number,
    oidDepartamento: number,
    oidNecesidades?: number[]
  ): Promise<CambioEstadoData | null> {
    return this.baseHelper.getDataFromResponse(
      this.estadoService.devolverRevisionJefeARevisionSecretario(
        oidCalendario,
        oidPrograma,
        oidDepartamento,
        oidNecesidades
      )
    );
  }

  async enviarRevisionJefeANoAsignada(
    oidCalendario: number,
    oidDepartamento: number,
    oidNecesidades?: number[]
  ): Promise<CambioEstadoData | null> {
    return this.baseHelper.getDataFromResponse(
      this.estadoService.enviarRevisionJefeANoAsignada(
        oidCalendario,
        oidDepartamento,
        oidNecesidades
      )
    );
  }

  // ========== MÉTODOS DE UTILIDAD ==========

  /**
   * Verifica si una transición fue exitosa
   */
  async wasTransitionSuccessful(
    estadoOrigen: string,
    estadoDestino: string,
    params: CambioEstadoParams
  ): Promise<boolean> {
    const result = await this.cambiarEstado(
      estadoOrigen,
      estadoDestino,
      params
    );
    return result !== null && result.totalNecesidades > 0;
  }

  /**
   * Obtiene el total de necesidades afectadas en una transición
   */
  async getTotalNecesidadesAfectadas(
    estadoOrigen: string,
    estadoDestino: string,
    params: CambioEstadoParams
  ): Promise<number> {
    const result = await this.cambiarEstado(
      estadoOrigen,
      estadoDestino,
      params
    );
    return result?.totalNecesidades || 0;
  }
}
