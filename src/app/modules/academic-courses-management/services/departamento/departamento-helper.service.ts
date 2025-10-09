import { Injectable, inject } from '@angular/core';
import { DepartamentoService } from './departamento.service';
import { BaseHelperService } from '../base-helper.service';
import {
  Departamento,
  CreateDepartamentoDto,
  UpdateDepartamentoDto,
  DepartamentoFilters,
} from '../../models';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepartamentoHelperService {
  private departamentoService = inject(DepartamentoService);
  private baseHelper = inject(BaseHelperService);

  // Métodos Génericos
  async getById(id: number): Promise<Departamento | null> {
    return this.baseHelper.getDataFromResponse(
      this.departamentoService.getDepartamentoById(id)
    );
  }

  getByIdObservable(id: number): Observable<Departamento | null> {
    return this.baseHelper.getDataFromResponseObservable(
      this.departamentoService.getDepartamentoById(id)
    );
  }

  async getAll(filters: DepartamentoFilters = {}): Promise<Departamento[]> {
    const response = await this.baseHelper.getDataFromResponse(
      this.departamentoService.getDepartamentos(filters)
    );
    return response?.content || [];
  }

  getAllObservable(
    filters: DepartamentoFilters = {}
  ): Observable<Departamento[]> {
    return this.baseHelper
      .getDataFromResponseObservable(
        this.departamentoService.getDepartamentos(filters)
      )
      .pipe(map((response) => response?.content || []));
  }

  // CRUD helpers
  async create(data: CreateDepartamentoDto): Promise<Departamento | null> {
    return this.baseHelper.getDataFromResponse(
      this.departamentoService.createDepartamento(data)
    );
  }

  async update(data: UpdateDepartamentoDto): Promise<Departamento | null> {
    return this.baseHelper.getDataFromResponse(
      this.departamentoService.updateDepartamento(data)
    );
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.baseHelper.getDataFromResponse(
      this.departamentoService.deleteDepartamento({ oidDepartamento: id })
    );
    return result === true;
  }

  // Métodos específicos del dominio
  async getDepartamentoNombre(id: number): Promise<string | null> {
    const departamento = await this.getById(id);
    return departamento?.nombre || null;
  }

  //OPCIONAL YA QUE EN TEORIA SOLO ES PARA LA FIET
  async getDepartamentoFacultad(id: number): Promise<string | null> {
    const departamento = await this.getById(id);
    return departamento?.facultad || null;
  }

  async checkDepartamentoExists(id: number): Promise<boolean> {
    const departamento = await this.getById(id);
    return departamento !== null;
  }

  async getDepartamentoJefe(id: number): Promise<string | null> {
    const departamento = await this.getById(id);
    return departamento?.jefeNombre || null;
  }

  // Helpers para dropdowns y selecciones
  async getAllForDropdown(): Promise<
    { value: number; label: string; facultad: string }[]
  > {
    const departamentos = await this.getAll({ size: 100 });
    return departamentos.map((depto) => ({
      value: depto.oidDepartamento,
      label: depto.nombre,
      facultad: depto.facultad,
    }));
  }

  //OPCIONAL YA QUE EN TEORIA SOLO ES PARA LA FIET
  async getDepartamentosByFacultad(facultad: string): Promise<Departamento[]> {
    return this.getAll({ facultad, size: 100 });
  }

  async getDepartamentosByJefe(jefeId: number): Promise<Departamento[]> {
    return this.getAll({ jefeOidUsuario: jefeId, size: 100 });
  }

  async searchByNombre(nombre: string): Promise<Departamento[]> {
    return this.getAll({ nombre, size: 50 });
  }

  //OPCIONAL YA QUE EN TEORIA SOLO ES PARA LA FIET
  async getFacultadesUnicas(): Promise<string[]> {
    const departamentos = await this.getAll({ size: 100 });
    const facultades = departamentos.map((d) => d.facultad);
    return [...new Set(facultades)];
  }
}
