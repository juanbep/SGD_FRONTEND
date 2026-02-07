import { Injectable, inject } from '@angular/core';
import { TiposActividadService } from './tiposActividad.service';
import { BaseHelperService } from '../base-helper.service';

import {
  TipoActividad,
  CreateTipoActividadDto,
  UpdateTipoActividadDto,
  TipoActividadFilters,
  TiposActividadListResponse,
} from '../../models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TiposActividadHelperService {
  private tiposActividadService = inject(TiposActividadService);
  private baseHelper = inject(BaseHelperService);

  async getById(id: number): Promise<TipoActividad | null> {
    return this.baseHelper.getDataFromResponse(
      this.tiposActividadService.getTipoActividadById(id)
    );
  }

  getByIdObservable(id: number): Observable<TipoActividad | null> {
    return this.baseHelper.getDataFromResponseObservable(
      this.tiposActividadService.getTipoActividadById(id)
    );
  }

  // Método para obtener toda la lista
  async getAll(filters: TipoActividadFilters = {}): Promise<TipoActividad[]> {
    const response = await this.baseHelper.getDataFromResponse(
      this.tiposActividadService.getTiposActividad(filters)
    );
    return response?.content || [];
  }

  getAllObservable(
    filters: TipoActividadFilters = {}
  ): Observable<TipoActividad[]> {
    return this.baseHelper
      .getDataFromResponseObservable(
        this.tiposActividadService.getTiposActividad(filters)
      )
      .pipe(map((response) => response?.content || []));
  }

  // CRUD helpers
  async create(data: CreateTipoActividadDto): Promise<TipoActividad | null> {
    return this.baseHelper.getDataFromResponse(
      this.tiposActividadService.createTipoActividad(data)
    );
  }

  async update(data: UpdateTipoActividadDto): Promise<TipoActividad | null> {
    return this.baseHelper.getDataFromResponse(
      this.tiposActividadService.updateTipoActividad(data)
    );
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.baseHelper.getDataFromResponse(
      this.tiposActividadService.deleteTipoActividad({ oidTipoActividad: id })
    );
    return result === true;
  }

  //Métodos auxiliares

  async getTipoNombre(id: number): Promise<string | null> {
    const tipo = await this.getById(id);
    return tipo?.nombre || null;
  }

  async getTipoDescripcion(id: number): Promise<string | null> {
    const tipo = await this.getById(id);
    return tipo?.descripcion || null;
  }

  async checkTipoExists(id: number): Promise<boolean> {
    const tipo = await this.getById(id);
    return tipo !== null;
  }

  async getAllForDropdown(): Promise<{ value: number; label: string }[]> {
    const tipos = await this.getAll();
    return tipos.map((tipo) => ({
      value: tipo.oidTipoActividad,
      label: tipo.nombre,
    }));
  }

  async searchByNombre(searchTerm: string): Promise<TipoActividad[]> {
    return this.getAll({ nombre: searchTerm, size: 50 });
  }
}
