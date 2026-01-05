import { Injectable, inject } from '@angular/core';

import {
  SeleccionadoResponse,
  SeleccionadoFilters,
  CreateSeleccionadoDTO,
  UpdateSeleccionadoDTO,
} from '../models';
import { map, Observable } from 'rxjs';
import { SeleccionadosService } from './seleccionado.service';
import { BaseHelperService } from '../shared/base-helper.service';

@Injectable({
  providedIn: 'root',
})
export class SeleccionadoHelperService {
  private seleccionadoService = inject(SeleccionadosService);
  private baseHelper = inject(BaseHelperService);

  async getById(id: number): Promise<SeleccionadoResponse | null> {
    return this.baseHelper.getDataFromResponse(
      this.seleccionadoService.getSeleccionadoById(id)
    );
  }

  getByIdObservable(id: number): Observable<SeleccionadoResponse | null> {
    return this.baseHelper.getDataFromResponseObservable(
      this.seleccionadoService.getSeleccionadoById(id)
    );
  }

  async getAll(filters: SeleccionadoFilters): Promise<SeleccionadoResponse[]> {
    const response = await this.baseHelper.getDataFromResponse(
      this.seleccionadoService.getSeleccionados(filters)
    );
    return response?.content || [];
  }

  getAllObservable(
    filters: SeleccionadoFilters
  ): Observable<SeleccionadoResponse[]> {
    return this.baseHelper
      .getDataFromResponseObservable(
        this.seleccionadoService.getSeleccionados(filters)
      )
      .pipe(map((response) => response?.content || []));
  }

  // CRUD helpers
  async create(
    data: CreateSeleccionadoDTO
  ): Promise<SeleccionadoResponse | null> {
    return this.baseHelper.getDataFromResponse(
      this.seleccionadoService.createSeleccionado(data)
    );
  }

  async update(
    data: UpdateSeleccionadoDTO
  ): Promise<SeleccionadoResponse | null> {
    return this.baseHelper.getDataFromResponse(
      this.seleccionadoService.updateSeleccionado(data)
    );
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.baseHelper.getDataFromResponse(
      this.seleccionadoService.deleteSeleccionado({ oidSeleccionado: id })
    );
    return result !== null;
  }

  async getMultipleByIds(
    ids: number[]
  ): Promise<(SeleccionadoResponse | null)[]> {
    const promises = ids.map((id) => this.getById(id));
    return this.baseHelper.getMultipleData(promises);
  }

  // Métodos helper específicos del negocio
  async getSeleccionadoUsuarioNombre(id: number): Promise<string | null> {
    const seleccionado = await this.getById(id);
    if (!seleccionado?.usuario) return null;
    return `${seleccionado.usuario.nombres} ${seleccionado.usuario.apellidos}`;
  }

  async getSeleccionadoIdentificacion(id: number): Promise<string | null> {
    const seleccionado = await this.getById(id);
    return seleccionado?.usuario?.identificacion || null;
  }

  async getSeleccionadoTipo(id: number): Promise<string | null> {
    const seleccionado = await this.getById(id);
    return seleccionado?.tipo || null;
  }

  async getSeleccionadoDedicacion(id: number): Promise<string | null> {
    const seleccionado = await this.getById(id);
    return seleccionado?.dedicacion || null;
  }

  async getSeleccionadoDepartamento(id: number): Promise<string | null> {
    const seleccionado = await this.getById(id);
    return seleccionado?.usuario?.usuarioDetalle?.departamento || null;
  }

  async checkSeleccionadoExists(id: number): Promise<boolean> {
    const seleccionado = await this.getById(id);
    return seleccionado !== null;
  }
}
