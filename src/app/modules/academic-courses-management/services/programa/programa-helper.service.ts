import { Injectable, inject } from '@angular/core';
import { ProgramaService } from './programa.service';
import { BaseHelperService } from '../base-helper.service';
import {
  Programa,
  CreateProgramaDto,
  UpdateProgramaDto,
  ProgramaFilters,
} from '../../models';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgramaHelperService {
  private programaService = inject(ProgramaService);
  private baseHelper = inject(BaseHelperService);

  // Métodos headless para consumo programático

  async getById(id: number): Promise<Programa | null> {
    return this.baseHelper.getDataFromResponse(
      this.programaService.getProgramaById(id)
    );
  }

  getByIdObservable(id: number): Observable<Programa | null> {
    return this.baseHelper.getDataFromResponseObservable(
      this.programaService.getProgramaById(id)
    );
  }

  async getAll(filters: ProgramaFilters = {}): Promise<Programa[]> {
    const response = await this.baseHelper.getDataFromResponse(
      this.programaService.getProgramas(filters)
    );
    return response?.content || [];
  }

  getAllObservable(filters: ProgramaFilters = {}): Observable<Programa[]> {
    return this.baseHelper
      .getDataFromResponseObservable(this.programaService.getProgramas(filters))
      .pipe(map((response) => response?.content || []));
  }

  // CRUD helpers
  async create(data: CreateProgramaDto): Promise<Programa | null> {
    return this.baseHelper.getDataFromResponse(
      this.programaService.createPrograma(data)
    );
  }

  async update(data: UpdateProgramaDto): Promise<Programa | null> {
    return this.baseHelper.getDataFromResponse(
      this.programaService.updatePrograma(data)
    );
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.baseHelper.getDataFromResponse(
      this.programaService.deletePrograma({ oidPrograma: id })
    );
    return result === true;
  }

  // Métodos para usos específicos del dominio
  async getProgramaNombre(id: number): Promise<string | null> {
    const programa = await this.getById(id);
    return programa?.nombre || null;
  }

  async getProgramaNombreCorto(id: number): Promise<string | null> {
    const programa = await this.getById(id);
    return programa?.nombreCorto || null;
  }

  async checkProgramaExists(id: number): Promise<boolean> {
    const programa = await this.getById(id);
    return programa !== null;
  }

  async getProgramaCoordinador(id: number): Promise<string | null> {
    const programa = await this.getById(id);
    return programa?.coordinadorNombre || null;
  }

  // Helpers para dropdowns y selecciones
  async getAllForDropdown(): Promise<
    { value: number; label: string; nombreCorto: string }[]
  > {
    const programas = await this.getAll({ size: 100 });
    return programas.map((programa) => ({
      value: programa.oidPrograma,
      label: programa.nombre,
      nombreCorto: programa.nombreCorto,
    }));
  }

  async searchByNombre(searchTerm: string): Promise<Programa[]> {
    return this.getAll({ nombre: searchTerm, size: 50 });
  }

  async getProgramasByCoordinador(coordinadorId: number): Promise<Programa[]> {
    return this.getAll({ coordinadorOidUsuario: coordinadorId, size: 100 });
  }
}
