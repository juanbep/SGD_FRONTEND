import { Injectable, inject } from '@angular/core';
import { ActividadesService } from './actividades.service';
import { BaseHelperService } from '../base-helper.service';
import {
  Actividad,
  ActividadFilters,
  ActividadResponse,
  CreateActividadDTO, // ACTUALIZADO: minúscula
  UpdateActividadDTO, // ACTUALIZADO: minúscula
  DesasignarUsuarioResponse,
} from '../../models';
import { firstValueFrom, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActividadHelperService {
  private actividadService = inject(ActividadesService);
  private baseHelper = inject(BaseHelperService);

  async getById(id: number): Promise<ActividadResponse | null> {
    return this.baseHelper.getDataFromResponse(
      this.actividadService.getActividadById(id)
    );
  }

  getByIdObservable(id: number): Observable<ActividadResponse | null> {
    return this.baseHelper.getDataFromResponseObservable(
      this.actividadService.getActividadById(id)
    );
  }

  async getAll(filters: ActividadFilters = {}): Promise<ActividadResponse[]> {
    const response = await this.baseHelper.getDataFromResponse(
      this.actividadService.getActividades(filters)
    );
    return response?.content || [];
  }

  getAllObservable(
    filters: ActividadFilters = {}
  ): Observable<ActividadResponse[]> {
    return this.baseHelper
      .getDataFromResponseObservable(
        this.actividadService.getActividades(filters)
      )
      .pipe(map((response) => response?.content || []));
  }

  // CRUD helpers
  async create(data: CreateActividadDTO): Promise<ActividadResponse | null> {
    return this.baseHelper.getDataFromResponse(
      this.actividadService.createActividad(data)
    );
  }

  // Crear múltiples actividades en lote
  async createMultiple(data: CreateActividadDTO[]): Promise<{
    exitosas: ActividadResponse[];
    fallidas: { indice: number; mensaje: string }[];
    total: number;
  }> {
    const response = await this.baseHelper.getDataFromResponse(
      this.actividadService.createActividadesEnLote(data)
    );

    if (!response || response.length === 0) {
      return { exitosas: [], fallidas: [], total: 0 };
    }

    // Separar exitosas de fallidas
    const exitosas: ActividadResponse[] = [];
    const fallidas: { indice: number; mensaje: string }[] = [];

    response.forEach((resultado) => {
      if (resultado.exito && resultado.actividad) {
        exitosas.push(resultado.actividad);
      } else {
        fallidas.push({
          indice: resultado.indice,
          mensaje: resultado.mensaje,
        });
      }
    });

    return {
      exitosas,
      fallidas,
      total: response.length,
    };
  }

  async update(data: UpdateActividadDTO): Promise<ActividadResponse | null> {
    return this.baseHelper.getDataFromResponse(
      this.actividadService.updateActividad(data)
    );
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.baseHelper.getDataFromResponse(
      this.actividadService.deleteActividad({ oidActividad: id })
    );
    return result === true || result === null; // trampita mientras se acomoda por parte del backend
  }

  async getMultipleByIds(ids: number[]): Promise<(ActividadResponse | null)[]> {
    const promises = ids.map((id) => this.getById(id));
    return this.baseHelper.getMultipleData(promises);
  }

  async getActividadNombre(id: number): Promise<string | null> {
    const actividad = await this.getById(id);
    return actividad?.actividad.nombreActividad || null;
  }

  async getActividadTipo(id: number): Promise<string | null> {
    const actividad = await this.getById(id);
    return actividad?.actividad.tipoActividad.nombre || null;
  }

  async checkActividadExists(id: number): Promise<boolean> {
    const actividad = await this.getById(id);
    return actividad !== null;
  }

  async desasignarUsuario(
    oidActividad: number,
    oidCalendario: number,
    oidUsuario: number
  ): Promise<DesasignarUsuarioResponse | null> {
    return this.baseHelper.getDataFromResponse(
      this.actividadService.desasignarUsuarioDeActividad(
        oidActividad,
        oidCalendario,
        oidUsuario
      )
    );
  }

  desasignarUsuarioObservable(
    oidActividad: number,
    oidCalendario: number,
    oidUsuario: number
  ): Observable<DesasignarUsuarioResponse | null> {
    return this.baseHelper.getDataFromResponseObservable(
      this.actividadService.desasignarUsuarioDeActividad(
        oidActividad,
        oidCalendario,
        oidUsuario
      )
    );
  }
}
