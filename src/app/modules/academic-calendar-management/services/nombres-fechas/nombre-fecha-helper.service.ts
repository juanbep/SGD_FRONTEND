import { Injectable, inject } from '@angular/core';
import { NombresFechasService } from '../../services';
import { BaseHelperService } from '../base-helper.service';

import {
  NombreFecha,
  CreateNombreFechaDto,
  UpdateNombreFechaDto,
  NombreFechaFilters,
} from '../../models';

import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NombreFechaHelperService {
  private nombreFechaService = inject(NombresFechasService);
  private baseHelper = inject(BaseHelperService);

  //Método para obtener un fecha por su ID
  async getById(id: number): Promise<NombreFecha | null> {
    return this.baseHelper.getDataFromResponse(
      this.nombreFechaService.getNombreFechaById(id)
    );
  }

  getByIdObservable(id: number): Observable<NombreFecha | null> {
    return this.baseHelper.getDataFromResponseObservable(
      this.nombreFechaService.getNombreFechaById(id)
    );
  }

  async getAll(filters: NombreFechaFilters = {}): Promise<NombreFecha[]> {
    const response = await this.baseHelper.getDataFromResponse(
      this.nombreFechaService.getNombresFecha(filters)
    );
    return response?.content || [];
  }

  getAllObservable(
    filters: NombreFechaFilters = {}
  ): Observable<NombreFecha[]> {
    return this.baseHelper
      .getDataFromResponseObservable(
        this.nombreFechaService.getNombresFecha(filters)
      )
      .pipe(map((response) => response?.content || []));
  }

  // CRUD helpers
  async create(data: CreateNombreFechaDto): Promise<NombreFecha | null> {
    return this.baseHelper.getDataFromResponse(
      this.nombreFechaService.createNombreFecha(data)
    );
  }

  async update(data: UpdateNombreFechaDto): Promise<NombreFecha | null> {
    return this.baseHelper.getDataFromResponse(
      this.nombreFechaService.updateNombreFecha(data)
    );
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.baseHelper.getDataFromResponse(
      this.nombreFechaService.deleteNombreFecha({ oidNombreFecha: id })
    );
    return result === true;
  }

  // Métodos específicos del dominio

  async getNombreFechaNombre(id: number): Promise<string | null> {
    const nombreFecha = await this.getById(id);
    return nombreFecha?.nombre || null;
  }

  async checkNombreFechaExists(id: number): Promise<boolean> {
    const nombreFecha = await this.getById(id);
    return nombreFecha !== null;
  }

  // Helpers para dropdowns y selecciones

  async getAllForDropdown(): Promise<
    {
      value: number;
      label: string;
      tieneTemplate: boolean;
      uniqueDate: boolean;
    }[]
  > {
    const nombresFecha = await this.getAll({ size: 200 });
    return nombresFecha.map((nf) => ({
      value: nf.oidNombreFecha,
      label: nf.nombre,
      tieneTemplate: this.tieneTemplate(nf.nombre),
      uniqueDate: nf.uniqueDate,
    }));
  }

  async searchByNombre(nombre: string): Promise<NombreFecha[]> {
    return this.getAll({ nombre, size: 50 });
  }

  // Helpers para templates y placeholders

  tieneTemplate(nombre: string): boolean {
    return nombre.includes('{') && nombre.includes('}');
  }

  async getNombresConTemplate(): Promise<NombreFecha[]> {
    const todos = await this.getAll({ size: 200 });
    return todos.filter((nf) => this.tieneTemplate(nf.nombre));
  }

  async getNombresSinTemplate(): Promise<NombreFecha[]> {
    const todos = await this.getAll({ size: 200 });
    return todos.filter((nf) => !this.tieneTemplate(nf.nombre));
  }

  reemplazarTemplate(
    nombreTemplate: string,
    valores: Record<string, string>
  ): string {
    let resultado = nombreTemplate;

    Object.keys(valores).forEach((key) => {
      const placeholder = `{${key}}`;
      resultado = resultado.replace(new RegExp(placeholder, 'g'), valores[key]);
    });

    return resultado;
  }

  async getNombreConValores(
    id: number,
    valores: Record<string, string>
  ): Promise<string | null> {
    const nombreFecha = await this.getById(id);
    if (!nombreFecha) return null;

    return this.reemplazarTemplate(nombreFecha.nombre, valores);
  }

  // Ejemplo de uso: getNombreConValores(4, { calendar: '2026 - 1' })
  // Resultado: "Plazo máximo para presentar solicitudes de cancelación de asignaturas y/o matrícula del 2026 - 1, debidamente justificadas"

  extraerPlaceholders(nombreTemplate: string): string[] {
    const regex = /\{([^}]+)\}/g;
    const placeholders: string[] = [];
    let match;

    while ((match = regex.exec(nombreTemplate)) !== null) {
      placeholders.push(match[1]);
    }

    return placeholders;
  }

  async getPlaceholdersPorId(id: number): Promise<string[] | null> {
    const nombreFecha = await this.getById(id);
    if (!nombreFecha) return null;

    return this.extraerPlaceholders(nombreFecha.nombre);
  }

  // Helpers para validaciones

  async validateNombreUnico(
    nombre: string,
    excludeId?: number
  ): Promise<boolean> {
    const existentes = await this.getAll({ nombre, size: 10 });

    if (excludeId) {
      return !existentes.some((nf) => nf.oidNombreFecha !== excludeId);
    }

    return existentes.length === 0;
  }

  // Helper para ordenar alfabéticamente
  async getAllOrdenados(): Promise<NombreFecha[]> {
    return this.getAll({
      sortBy: 'nombre',
      sortDirection: 'asc',
      size: 200,
    });
  }

  // Helper para agrupar por tipo (con template o sin template)
  async getAllAgrupados(): Promise<{
    conTemplate: NombreFecha[];
    sinTemplate: NombreFecha[];
  }> {
    const todos = await this.getAll({ size: 200 });

    return {
      conTemplate: todos.filter((nf) => this.tieneTemplate(nf.nombre)),
      sinTemplate: todos.filter((nf) => !this.tieneTemplate(nf.nombre)),
    };
  }
}
