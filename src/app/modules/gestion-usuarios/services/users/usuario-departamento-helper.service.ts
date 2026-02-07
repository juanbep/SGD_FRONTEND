import { Injectable, inject } from '@angular/core';
import { UsuarioDepartamentoService } from '../users/usuario-departamento.service';
import { BaseHelperService } from '../base-helper.service';
import { UsuarioDepartamento, UsuarioDepartamentoFilters } from '../../models';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioDepartamentoHelperService {
  private usuarioDepartamentoService = inject(UsuarioDepartamentoService);
  private baseHelper = inject(BaseHelperService);

  // Métodos headless para consumo programático

  async getById(id: number): Promise<UsuarioDepartamento | null> {
    return this.baseHelper.getDataFromResponse(
      this.usuarioDepartamentoService.getUsuarioDepartamentoById(id)
    );
  }

  getByIdObservable(id: number): Observable<UsuarioDepartamento | null> {
    return this.baseHelper.getDataFromResponseObservable(
      this.usuarioDepartamentoService.getUsuarioDepartamentoById(id)
    );
  }

  async getAll(
    filters: UsuarioDepartamentoFilters = {}
  ): Promise<UsuarioDepartamento[]> {
    const response = await this.baseHelper.getDataFromResponse(
      this.usuarioDepartamentoService.getUsuariosDepartamento(filters)
    );
    return response?.content || [];
  }

  getAllObservable(
    filters: UsuarioDepartamentoFilters = {}
  ): Observable<UsuarioDepartamento[]> {
    return this.baseHelper
      .getDataFromResponseObservable(
        this.usuarioDepartamentoService.getUsuariosDepartamento(filters)
      )
      .pipe(map((response) => response?.content || []));
  }

  // Métodos de conveniencia específicos del dominio

  async getUsuarioNombreCompleto(id: number): Promise<string | null> {
    const usuarioDept = await this.getById(id);
    if (usuarioDept) {
      return `${usuarioDept.usuario.nombres} ${usuarioDept.usuario.apellidos}`;
    }
    return null;
  }

  async getTotalHoras(id: number): Promise<number | null> {
    const usuarioDept = await this.getById(id);
    return usuarioDept?.totalHorasActividades || null;
  }

  async getDepartamentoNombre(id: number): Promise<string | null> {
    const usuarioDept = await this.getById(id);
    return usuarioDept?.nombreDepartamento || null;
  }

  // Helpers específicos para dropdowns y selecciones

  async getAllForDropdown(): Promise<
    { value: number; label: string; departamento: string; horas: number }[]
  > {
    const usuariosDept = await this.getAll({ size: 100 });
    return usuariosDept.map((ud) => ({
      value: ud.usuario.oidUsuario,
      label: `${ud.usuario.nombres} ${ud.usuario.apellidos}`,
      departamento: ud.nombreDepartamento,
      horas: ud.totalHorasActividades,
    }));
  }

  async getByDepartamento(
    oidDepartamento: number
  ): Promise<UsuarioDepartamento[]> {
    return this.getAll({ oidDepartamento, size: 100 });
  }

  async getByDepartamentoNombre(
    nombreDepartamento: string
  ): Promise<UsuarioDepartamento[]> {
    return this.getAll({ nombreDepartamento, size: 100 });
  }

  async getByFacultad(facultad: string): Promise<UsuarioDepartamento[]> {
    return this.getAll({ facultad, size: 100 });
  }

  async getByRol(rolNombre: string): Promise<UsuarioDepartamento[]> {
    return this.getAll({ rolNombre, size: 100 });
  }

  async getDocentes(): Promise<UsuarioDepartamento[]> {
    return this.getByRol('DOCENTE');
  }

  async getByCategoria(categoria: string): Promise<UsuarioDepartamento[]> {
    return this.getAll({ categoria, size: 100 });
  }

  async getByContratacion(
    contratacion: string
  ): Promise<UsuarioDepartamento[]> {
    return this.getAll({ contratacion, size: 100 });
  }

  async getPlanta(): Promise<UsuarioDepartamento[]> {
    return this.getByContratacion('PLANTA');
  }

  async getCatedra(): Promise<UsuarioDepartamento[]> {
    return this.getByContratacion('CATEDRA');
  }

  // Helpers para filtrar por horas

  async getByRangoHoras(
    minHoras: number,
    maxHoras: number
  ): Promise<UsuarioDepartamento[]> {
    return this.getAll({
      minHorasActividades: minHoras,
      maxHorasActividades: maxHoras,
      size: 100,
    });
  }

  async getConHorasMayoresA(horas: number): Promise<UsuarioDepartamento[]> {
    return this.getAll({ minHorasActividades: horas, size: 100 });
  }

  async getConHorasMenoresA(horas: number): Promise<UsuarioDepartamento[]> {
    return this.getAll({ maxHorasActividades: horas, size: 100 });
  }

  // Helpers para validaciones

  async usuarioTieneRol(
    usuarioId: number,
    rolNombre: string
  ): Promise<boolean> {
    const usuarioDept = await this.getById(usuarioId);
    if (!usuarioDept) return false;

    return usuarioDept.usuario.roles.some((rol) => rol.nombre === rolNombre);
  }

  async getRoles(usuarioId: number): Promise<string[]> {
    const usuarioDept = await this.getById(usuarioId);
    if (!usuarioDept) return [];

    return usuarioDept.usuario.roles.map((rol) => rol.nombre);
  }

  async esDocente(usuarioId: number): Promise<boolean> {
    return this.usuarioTieneRol(usuarioId, 'DOCENTE');
  }

  async esJefeDepartamento(usuarioId: number): Promise<boolean> {
    return this.usuarioTieneRol(usuarioId, 'JEFE DE DEPARTAMENTO');
  }

  async getUsuarioFacultad(usuarioId: number): Promise<string | null> {
    const usuarioDept = await this.getById(usuarioId);
    return usuarioDept?.usuario.usuarioDetalle.facultad || null;
  }

  async getUsuarioCategoria(usuarioId: number): Promise<string | null> {
    const usuarioDept = await this.getById(usuarioId);
    return usuarioDept?.usuario.usuarioDetalle.categoria || null;
  }
}
