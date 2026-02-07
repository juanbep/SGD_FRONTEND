import { Injectable, inject } from '@angular/core';
import { UsuariosConActividadesService } from '../users/usuarios-con-actividades.service';
import { BaseHelperService } from '../base-helper.service';
import {
  UsuarioDepartamento,
  UsuariosConActividadesFilters,
} from '../../models';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosConActividadesHelperService {
  private usuariosConActividadesService = inject(UsuariosConActividadesService);
  private baseHelper = inject(BaseHelperService);

  // Métodos headless para consumo programático

  async getAll(
    filters: UsuariosConActividadesFilters = {}
  ): Promise<UsuarioDepartamento[]> {
    const response = await this.baseHelper.getDataFromResponse(
      this.usuariosConActividadesService.getUsuariosConActividades(filters)
    );
    return response || [];
  }

  getAllObservable(
    filters: UsuariosConActividadesFilters = {}
  ): Observable<UsuarioDepartamento[]> {
    return this.baseHelper
      .getDataFromResponseObservable(
        this.usuariosConActividadesService.getUsuariosConActividades(filters)
      )
      .pipe(map((response) => response || []));
  }

  // Métodos de conveniencia específicos del dominio

  async getByDepartamento(
    oidDepartamento: number
  ): Promise<UsuarioDepartamento[]> {
    return this.getAll({ oidDepartamento });
  }

  async getByDepartamentoNombre(
    nombreDepartamento: string
  ): Promise<UsuarioDepartamento[]> {
    return this.getAll({ nombreDepartamento });
  }

  async getByFacultad(facultad: string): Promise<UsuarioDepartamento[]> {
    return this.getAll({ facultad });
  }

  async getByRol(rolNombre: string): Promise<UsuarioDepartamento[]> {
    return this.getAll({ rolNombre });
  }

  async getDocentes(): Promise<UsuarioDepartamento[]> {
    return this.getByRol('DOCENTE');
  }

  async getByCategoria(categoria: string): Promise<UsuarioDepartamento[]> {
    return this.getAll({ categoria });
  }

  async getByContratacion(
    contratacion: string
  ): Promise<UsuarioDepartamento[]> {
    return this.getAll({ contratacion });
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
    });
  }

  async getConHorasMayoresA(horas: number): Promise<UsuarioDepartamento[]> {
    return this.getAll({ minHorasActividades: horas });
  }

  async getConHorasMenoresA(horas: number): Promise<UsuarioDepartamento[]> {
    return this.getAll({ maxHorasActividades: horas });
  }

  // Helpers para dropdowns y selecciones

  async getAllForDropdown(): Promise<
    { value: number; label: string; departamento: string; horas: number }[]
  > {
    const usuarios = await this.getAll();
    return usuarios.map((ud) => ({
      value: ud.usuario.oidUsuario,
      label: `${ud.usuario.nombres} ${ud.usuario.apellidos}`,
      departamento: ud.nombreDepartamento,
      horas: ud.totalHorasActividades,
    }));
  }

  // Métodos de utilidad

  async getTotalUsuarios(): Promise<number> {
    const usuarios = await this.getAll();
    return usuarios.length;
  }

  async getSumaHorasTotales(): Promise<number> {
    const usuarios = await this.getAll();
    return usuarios.reduce((sum, u) => sum + u.totalHorasActividades, 0);
  }

  async getPromedioHoras(): Promise<number> {
    const usuarios = await this.getAll();
    if (usuarios.length === 0) return 0;

    const total = usuarios.reduce((sum, u) => sum + u.totalHorasActividades, 0);
    return total / usuarios.length;
  }

  async getUsuarioConMasHoras(): Promise<UsuarioDepartamento | null> {
    const usuarios = await this.getAll();
    if (usuarios.length === 0) return null;

    return usuarios.reduce((max, usuario) =>
      usuario.totalHorasActividades > max.totalHorasActividades ? usuario : max
    );
  }

  async ordenarPorHoras(
    orden: 'asc' | 'desc' = 'desc'
  ): Promise<UsuarioDepartamento[]> {
    const usuarios = await this.getAll();
    return usuarios.sort((a, b) => {
      const diff = a.totalHorasActividades - b.totalHorasActividades;
      return orden === 'asc' ? diff : -diff;
    });
  }
}
