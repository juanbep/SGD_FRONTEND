import { Injectable, inject } from '@angular/core';
import { AsignacionesService } from './asignaciones.service';
import { BaseHelperService } from '../base-helper.service';
import {
  AsignacionResponse,
  AsignacionFilters,
  CreateAsignacionDTO,
  UpdateAsignacionDTO,
} from '../../models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AsignacionHelperService {
  private asignacionService = inject(AsignacionesService);
  private baseHelper = inject(BaseHelperService);

  async getById(id: number): Promise<AsignacionResponse | null> {
    return this.baseHelper.getDataFromResponse(
      this.asignacionService.getAsignacionById(id)
    );
  }

  getByIdObservable(id: number): Observable<AsignacionResponse | null> {
    return this.baseHelper.getDataFromResponseObservable(
      this.asignacionService.getAsignacionById(id)
    );
  }

  async getAll(filters: AsignacionFilters): Promise<AsignacionResponse[]> {
    const response = await this.baseHelper.getDataFromResponse(
      this.asignacionService.getAsignaciones(filters)
    );
    return response?.content || [];
  }

  getAllObservable(
    filters: AsignacionFilters
  ): Observable<AsignacionResponse[]> {
    return this.baseHelper
      .getDataFromResponseObservable(
        this.asignacionService.getAsignaciones(filters)
      )
      .pipe(map((response) => response?.content || []));
  }

  // CRUD helpers
  async create(data: CreateAsignacionDTO): Promise<AsignacionResponse | null> {
    return this.baseHelper.getDataFromResponse(
      this.asignacionService.createAsignacion(data)
    );
  }

  async update(data: UpdateAsignacionDTO): Promise<AsignacionResponse | null> {
    return this.baseHelper.getDataFromResponse(
      this.asignacionService.updateAsignacion(data)
    );
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.baseHelper.getDataFromResponse(
      this.asignacionService.deleteAsignacion({ oidAsignacion: id })
    );
    return result !== null;
  }

  async getMultipleByIds(
    ids: number[]
  ): Promise<(AsignacionResponse | null)[]> {
    const promises = ids.map((id) => this.getById(id));
    return this.baseHelper.getMultipleData(promises);
  }

  async getAsignacionNombreDocente(id: number): Promise<string | null> {
    const asignacion = await this.getById(id);
    return asignacion?.nombreDocente || null;
  }

  async getAsignacionNombreMateria(id: number): Promise<string | null> {
    const asignacion = await this.getById(id);
    return asignacion?.nombreMateria || null;
  }

  async getAsignacionGrupo(id: number): Promise<string | null> {
    const asignacion = await this.getById(id);
    return asignacion?.grupo || null;
  }

  async getAsignacionHorasDocencia(id: number): Promise<number | null> {
    const asignacion = await this.getById(id);
    return asignacion?.horasDocencia || null;
  }

  async checkAsignacionExists(id: number): Promise<boolean> {
    const asignacion = await this.getById(id);
    return asignacion !== null;
  }
}
