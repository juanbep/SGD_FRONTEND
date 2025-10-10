import { Injectable, inject } from '@angular/core';
import { MateriaService } from './materia.service';
import { BaseHelperService } from '../base-helper.service';
import {
  Materia,
  CreateMateriaDto,
  UpdateMateriaDto,
  MateriaFilters,
} from '../../models';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MateriaHelperService {
  private materiaService = inject(MateriaService);
  private baseHelper = inject(BaseHelperService);

  // Métodos headless

  async getById(id: number): Promise<Materia | null> {
    return this.baseHelper.getDataFromResponse(
      this.materiaService.getMateriaById(id)
    );
  }

  getByIdObservable(id: number): Observable<Materia | null> {
    return this.baseHelper.getDataFromResponseObservable(
      this.materiaService.getMateriaById(id)
    );
  }

  async getAll(filters: MateriaFilters = {}): Promise<Materia[]> {
    const response = await this.baseHelper.getDataFromResponse(
      this.materiaService.getMaterias(filters)
    );
    return response?.content || [];
  }

  getAllObservable(filters: MateriaFilters = {}): Observable<Materia[]> {
    return this.baseHelper
      .getDataFromResponseObservable(this.materiaService.getMaterias(filters))
      .pipe(map((response) => response?.content || []));
  }

  // CRUD helpers
  async create(data: CreateMateriaDto): Promise<Materia | null> {
    return this.baseHelper.getDataFromResponse(
      this.materiaService.createMateria(data)
    );
  }

  async update(data: UpdateMateriaDto): Promise<Materia | null> {
    return this.baseHelper.getDataFromResponse(
      this.materiaService.updateMateria(data)
    );
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.baseHelper.getDataFromResponse(
      this.materiaService.deleteMateria({ idMateria: id })
    );
    return result === true;
  }

  // Métodos específicos del dominio

  async getMateriaNombre(id: number): Promise<string | null> {
    const materia = await this.getById(id);
    return materia?.nombre || null;
  }

  async getMateriaCodigo(id: number): Promise<string | null> {
    const materia = await this.getById(id);
    return materia?.codigo || null;
  }

  async checkMateriaExists(id: number): Promise<boolean> {
    const materia = await this.getById(id);
    return materia !== null;
  }

  async getMateriaDepartamento(id: number): Promise<string | null> {
    const materia = await this.getById(id);
    return materia?.nombreDepartamento || null;
  }

  async getMateriaCorrequisito(id: number): Promise<string | null> {
    const materia = await this.getById(id);
    return materia?.nombreCorrequisito || null;
  }

  // Helpers para dropdowns y selecciones

  async getAllForDropdown(): Promise<
    { value: number; label: string; codigo: string }[]
  > {
    const materias = await this.getAll({ size: 200 });
    return materias.map((materia) => ({
      value: materia.idMateria,
      label: `${materia.nombre} (${materia.codigo})`,
      codigo: materia.codigo,
    }));
  }

  async getMateriasByPlan(planId: number): Promise<Materia[]> {
    return this.getAll({ oidPlan: planId, size: 200 });
  }

  async getMateriasBySemestre(semestre: number): Promise<Materia[]> {
    return this.getAll({ semestre, size: 200 });
  }

  async getMateriasByDepartamento(departamentoId: number): Promise<Materia[]> {
    return this.getAll({ oidDepartamento: departamentoId, size: 200 });
  }

  async getMateriasBySemestreAndPlan(
    semestre: number,
    planId: number
  ): Promise<Materia[]> {
    return this.getAll({ semestre, oidPlan: planId, size: 200 });
  }

  async getMateriasConCorrequisito(): Promise<Materia[]> {
    return this.getAll({ tieneCorrequisito: true, size: 200 });
  }

  async searchByCodigo(codigo: string): Promise<Materia[]> {
    return this.getAll({ codigo, size: 50 });
  }

  async searchByNombre(nombre: string): Promise<Materia[]> {
    return this.getAll({ nombre, size: 50 });
  }

  // Helpers para validaciones

  async validateCorrequisito(
    materiaId: number,
    correquisitoId: number
  ): Promise<boolean> {
    const materia = await this.getById(materiaId);
    return materia?.idCorrequisito === correquisitoId;
  }

  async tieneCorrequisito(materiaId: number): Promise<boolean> {
    const materia = await this.getById(materiaId);
    return materia?.idCorrequisito !== null;
  }

  async getMateriaSemestre(materiaId: number): Promise<number | null> {
    const materia = await this.getById(materiaId);
    return materia?.semestre || null;
  }

  async getMateriaHorasSemana(materiaId: number): Promise<number | null> {
    const materia = await this.getById(materiaId);
    return materia?.horasSemana || null;
  }
}
