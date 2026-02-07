import { Injectable, inject } from '@angular/core';
import { UsuarioService } from '../users/usuario.service';
import { BaseHelperService } from '../base-helper.service';
import { Usuario, UsuarioFilters } from '../../models';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioHelperService {
  private usuarioService = inject(UsuarioService);
  private baseHelper = inject(BaseHelperService);

  // Métodos headless para consumo programático

  async getById(id: number): Promise<Usuario | null> {
    return this.baseHelper.getDataFromResponse(
      this.usuarioService.getUsuarioById(id)
    );
  }

  getByIdObservable(id: number): Observable<Usuario | null> {
    return this.baseHelper.getDataFromResponseObservable(
      this.usuarioService.getUsuarioById(id)
    );
  }

  async getAll(filters: UsuarioFilters = {}): Promise<Usuario[]> {
    const response = await this.baseHelper.getDataFromResponse(
      this.usuarioService.getUsuarios(filters)
    );
    return response?.content || [];
  }

  getAllObservable(filters: UsuarioFilters = {}): Observable<Usuario[]> {
    return this.baseHelper
      .getDataFromResponseObservable(this.usuarioService.getUsuarios(filters))
      .pipe(map((response) => response?.content || []));
  }

  // Métodos de conveniencia específicos del dominio

  async getUsuarioNombreCompleto(id: number): Promise<string | null> {
    const usuario = await this.getById(id);
    if (usuario) {
      return `${usuario.nombres} ${usuario.apellidos}`;
    }
    return null;
  }

  async getUsuarioIdentificacion(id: number): Promise<string | null> {
    const usuario = await this.getById(id);
    return usuario?.identificacion || null;
  }

  async checkUsuarioExists(id: number): Promise<boolean> {
    const usuario = await this.getById(id);
    return usuario !== null;
  }

  async getUsuarioCorreo(id: number): Promise<string | null> {
    const usuario = await this.getById(id);
    return usuario?.correo || null;
  }

  // Helpers específicos para dropdowns y selecciones

  async getAllForDropdown(): Promise<
    { value: number; label: string; identificacion: string }[]
  > {
    const usuarios = await this.getAll({ size: 100 });
    return usuarios.map((usuario) => ({
      value: usuario.oidUsuario,
      label: `${usuario.nombres} ${usuario.apellidos}`,
      identificacion: usuario.identificacion,
    }));
  }

  async getUsuariosByEstado(estadoNombre: string): Promise<Usuario[]> {
    return this.getAll({ estadoNombre, size: 100 });
  }

  async getUsuariosActivos(): Promise<Usuario[]> {
    return this.getUsuariosByEstado('ACTIVO');
  }

  async getUsuariosByRol(rolNombre: string): Promise<Usuario[]> {
    return this.getAll({ rolNombre, size: 100 });
  }

  async getDocentes(): Promise<Usuario[]> {
    return this.getUsuariosByRol('DOCENTE');
  }

  async getUsuariosByFacultad(facultad: string): Promise<Usuario[]> {
    return this.getAll({ facultad, size: 100 });
  }

  async getUsuariosByDepartamento(departamento: string): Promise<Usuario[]> {
    return this.getAll({ departamento, size: 100 });
  }

  async getUsuariosByCategoria(categoria: string): Promise<Usuario[]> {
    return this.getAll({ categoria, size: 100 });
  }

  async searchByNombre(searchTerm: string): Promise<Usuario[]> {
    return this.getAll({ nombres: searchTerm, size: 50 });
  }

  async searchByIdentificacion(identificacion: string): Promise<Usuario[]> {
    return this.getAll({ identificacion, size: 50 });
  }

  // Helpers para validaciones

  async usuarioTieneRol(
    usuarioId: number,
    rolNombre: string
  ): Promise<boolean> {
    const usuario = await this.getById(usuarioId);
    if (!usuario) return false;

    return usuario.roles.some((rol) => rol.nombre === rolNombre);
  }

  async getUsuarioRoles(usuarioId: number): Promise<string[]> {
    const usuario = await this.getById(usuarioId);
    if (!usuario) return [];

    return usuario.roles.map((rol) => rol.nombre);
  }

  async esDocente(usuarioId: number): Promise<boolean> {
    return this.usuarioTieneRol(usuarioId, 'DOCENTE');
  }

  async getUsuarioDepartamento(usuarioId: number): Promise<string | null> {
    const usuario = await this.getById(usuarioId);
    return usuario?.usuarioDetalle.departamento || null;
  }

  async getUsuarioFacultad(usuarioId: number): Promise<string | null> {
    const usuario = await this.getById(usuarioId);
    return usuario?.usuarioDetalle.facultad || null;
  }
}
