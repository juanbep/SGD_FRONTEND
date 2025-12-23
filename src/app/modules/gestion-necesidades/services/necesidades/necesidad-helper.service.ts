import { Injectable, inject } from '@angular/core';
import { NecesidadesService } from './necesidades.service';
import { BaseHelperService } from '../base-helper.service';
import {
  NecesidadResponse,
  NecesidadFilters,
  CreateNecesidadDTO,
  UpdateNecesidadDTO,
} from '../../models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NecesidadHelperService {
  private necesidadService = inject(NecesidadesService);
  private baseHelper = inject(BaseHelperService);

  async getById(id: number): Promise<NecesidadResponse | null> {
    return this.baseHelper.getDataFromResponse(
      this.necesidadService.getNecesidadById(id)
    );
  }

  getByIdObservable(id: number): Observable<NecesidadResponse | null> {
    return this.baseHelper.getDataFromResponseObservable(
      this.necesidadService.getNecesidadById(id)
    );
  }

  async getAll(filters: NecesidadFilters): Promise<NecesidadResponse[]> {
    const response = await this.baseHelper.getDataFromResponse(
      this.necesidadService.getNecesidades(filters)
    );
    return response?.content || [];
  }

  getAllObservable(
    filters: NecesidadFilters
  ): Observable<NecesidadResponse[]> {
    return this.baseHelper
      .getDataFromResponseObservable(
        this.necesidadService.getNecesidades(filters)
      )
      .pipe(map((response) => response?.content || []));
  }

  // CRUD helpers
  async create(data: CreateNecesidadDTO): Promise<NecesidadResponse | null> {
    return this.baseHelper.getDataFromResponse(
      this.necesidadService.createNecesidad(data)
    );
  }

  async update(data: UpdateNecesidadDTO): Promise<NecesidadResponse | null> {
    return this.baseHelper.getDataFromResponse(
      this.necesidadService.updateNecesidad(data)
    );
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.baseHelper.getDataFromResponse(
      this.necesidadService.deleteNecesidad({ oidNecesidad: id })
    );
    return result !== null;
  }

  async getMultipleByIds(ids: number[]): Promise<(NecesidadResponse | null)[]> {
    const promises = ids.map((id) => this.getById(id));
    return this.baseHelper.getMultipleData(promises);
  }

  async getNecesidadMateriaNombre(id: number): Promise<string | null> {
    const necesidad = await this.getById(id);
    return necesidad?.nombreMateria || null;
  }

  async getNecesidadGrupo(id: number): Promise<string | null> {
    const necesidad = await this.getById(id);
    return necesidad?.grupo || null;
  }

  async getNecesidadEstado(id: number): Promise<string | null> {
    const necesidad = await this.getById(id);
    return necesidad?.estado || null;
  }

  async checkNecesidadExists(id: number): Promise<boolean> {
    const necesidad = await this.getById(id);
    return necesidad !== null;
  }
}
