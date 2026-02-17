import { Injectable, inject } from '@angular/core';
import {
  ConfiguracionResponse,
  ConfiguracionFilters,
  CreateConfiguracionDTO,
  UpdateConfiguracionDTO,
} from '../models/configuracion.model';
import { map, Observable } from 'rxjs';
import { ConfiguracionService } from './configuracion.service';
import { BaseHelperService } from '../services/base-helper.service';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionHelperService {
  private configuracionService = inject(ConfiguracionService);
  private baseHelper = inject(BaseHelperService);

  async getById(id: number): Promise<ConfiguracionResponse | null> {
    return this.baseHelper.getDataFromResponse(
      this.configuracionService.getConfiguracionById(id),
    );
  }

  getByIdObservable(id: number): Observable<ConfiguracionResponse | null> {
    return this.baseHelper.getDataFromResponseObservable(
      this.configuracionService.getConfiguracionById(id),
    );
  }

  async getAll(
    filters: ConfiguracionFilters,
  ): Promise<ConfiguracionResponse[]> {
    const response = await this.baseHelper.getDataFromResponse(
      this.configuracionService.getConfiguraciones(filters),
    );
    return response?.content || [];
  }

  getAllObservable(
    filters: ConfiguracionFilters,
  ): Observable<ConfiguracionResponse[]> {
    return this.baseHelper
      .getDataFromResponseObservable(
        this.configuracionService.getConfiguraciones(filters),
      )
      .pipe(map((response) => response?.content || []));
  }

  // GET BY CLAVE - Método especial que devuelve el valor directamente
  async getValorByClave(clave: string): Promise<string | null> {
    return this.baseHelper.getDataFromResponse(
      this.configuracionService.getConfiguracionByClave(clave),
    );
  }

  getValorByClaveObservable(clave: string): Observable<string | null> {
    return this.baseHelper.getDataFromResponseObservable(
      this.configuracionService.getConfiguracionByClave(clave),
    );
  }

  // CRUD helpers
  async create(
    data: CreateConfiguracionDTO,
  ): Promise<ConfiguracionResponse | null> {
    return this.baseHelper.getDataFromResponse(
      this.configuracionService.createConfiguracion(data),
    );
  }

  async update(
    data: UpdateConfiguracionDTO,
  ): Promise<ConfiguracionResponse | null> {
    return this.baseHelper.getDataFromResponse(
      this.configuracionService.updateConfiguracion(data),
    );
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.baseHelper.getDataFromResponse(
      this.configuracionService.deleteConfiguracion({ oidConfigGeneral: id }),
    );
    return result !== null;
  }

  async getMultipleByIds(
    ids: number[],
  ): Promise<(ConfiguracionResponse | null)[]> {
    const promises = ids.map((id) => this.getById(id));
    return this.baseHelper.getMultipleData(promises);
  }

  // Métodos helper específicos del negocio
  async checkConfiguracionExists(clave: string): Promise<boolean> {
    const valor = await this.getValorByClave(clave);
    return valor !== null;
  }

  async isConfiguracionHabilitada(id: number): Promise<boolean> {
    const config = await this.getById(id);
    return config?.habilitado || false;
  }

  // Helper para obtener configuraciones habilitadas
  async getConfiguracionesHabilitadas(): Promise<ConfiguracionResponse[]> {
    return this.getAll({ habilitado: true });
  }

  // Helper para obtener múltiples valores por claves
  async getMultipleValoresByClaves(
    claves: string[],
  ): Promise<(string | null)[]> {
    const promises = claves.map((clave) => this.getValorByClave(clave));
    return Promise.all(promises);
  }
}
