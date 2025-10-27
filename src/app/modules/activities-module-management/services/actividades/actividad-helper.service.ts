import { Injectable, inject } from '@angular/core';
import { ActividadesService } from './actividades.service';
import { BaseHelperService } from '../base-helper.service';
import {
  Actividad,
  ActividadFilters,
  ActividadResponse,
  CreateActividadDTO,
  UpdateActividadDTO,
} from '../../models';
import { map, Observable } from 'rxjs';

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
}
