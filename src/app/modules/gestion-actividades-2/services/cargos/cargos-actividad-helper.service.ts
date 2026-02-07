import { Injectable, inject } from '@angular/core';
import { CargosActividadService } from './cargos-actividad.service';
import { BaseHelperService } from '../base-helper.service';
import {
  CargoActividad,
  CreateCargoActividadDTO,
  UpdateCargoActividadDTO,
  CargoActividadFilters,
  TIPOS_CARGO,
} from '../../models';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CargosActividadHelperService {
  private cargosActividadService = inject(CargosActividadService);
  private baseHelper = inject(BaseHelperService);

  async getById(id: number): Promise<CargoActividad | null> {
    return this.baseHelper.getDataFromResponse(
      this.cargosActividadService.getCargoActividadById(id)
    );
  }

  getByIdObservable(id: number): Observable<CargoActividad | null> {
    return this.baseHelper.getDataFromResponseObservable(
      this.cargosActividadService.getCargoActividadById(id)
    );
  }

  async getAll(filters: CargoActividadFilters = {}): Promise<CargoActividad[]> {
    const response = await this.baseHelper.getDataFromResponse(
      this.cargosActividadService.getCargosActividad(filters)
    );
    return response?.content || [];
  }

  getAllObservable(
    filters: CargoActividadFilters = {}
  ): Observable<CargoActividad[]> {
    return this.baseHelper
      .getDataFromResponseObservable(
        this.cargosActividadService.getCargosActividad(filters)
      )
      .pipe(map((response) => response?.content || []));
  }

  // CRUD helpers
  async create(data: CreateCargoActividadDTO): Promise<CargoActividad | null> {
    return this.baseHelper.getDataFromResponse(
      this.cargosActividadService.createCargoActividad(data)
    );
  }

  async update(data: UpdateCargoActividadDTO): Promise<CargoActividad | null> {
    return this.baseHelper.getDataFromResponse(
      this.cargosActividadService.updateCargoActividad(data)
    );
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.baseHelper.getDataFromResponse(
      this.cargosActividadService.deleteCargoActividad({
        oidCargoActividad: id,
      })
    );
    return result === true;
  }

  // Métodos de conveniencia específicos del dominio
  async getCargoNombre(id: number): Promise<string | null> {
    const cargo = await this.getById(id);
    return cargo?.nombre || null;
  }

  async getCargoMaxHoras(id: number): Promise<number | null> {
    const cargo = await this.getById(id);
    return cargo?.maxHorasSemana || null;
  }

  async checkCargoExists(id: number): Promise<boolean> {
    const cargo = await this.getById(id);
    return cargo !== null;
  }

  // Helpers Auxiliares
  async getAllForDropdown(): Promise<
    { value: number; label: string; maxHoras: number }[]
  > {
    const cargos = await this.getAll();
    return cargos.map((cargo) => ({
      value: cargo.oidCargoActividad,
      label: cargo.nombre,
      maxHoras: cargo.maxHorasSemana,
    }));
  }

  async getCargosByTipo(tipo: string): Promise<CargoActividad[]> {
    return this.getAll({ tipo, size: 100 });
  }

  async getCargosByTipoActividad(
    oidTipoActividad: number
  ): Promise<CargoActividad[]> {
    return this.getAll({ oidTipoActividad, size: 100 });
  }

  async searchByNombre(searchTerm: string): Promise<CargoActividad[]> {
    return this.getAll({ nombre: searchTerm, size: 50 });
  }

  // Helper para obtener cargos con restricciones de horas
  async getCargosByMaxHoras(maxHoras: number): Promise<CargoActividad[]> {
    return this.getAll({ maxHorasSemanaMax: maxHoras, size: 100 });
  }

  // Helper para validaciones
  async validateCargoForActividad(
    cargoId: number,
    horasRequeridas: number
  ): Promise<boolean> {
    const cargo = await this.getById(cargoId);
    if (!cargo) return false;

    return horasRequeridas <= cargo.maxHorasSemana;
  }
}
