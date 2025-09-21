import { Injectable, inject } from '@angular/core';
import { CalendarioService } from './calendario.service';
import { BaseHelperService } from '../base-helper.service';
import {
  Calendario,
  CreateCalendarioDTO,
  UpdateCalendarioDTO,
  CalendarioFilters,
  EstadoCalendario,
} from '../../models';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarioHelperService {
  private calendarioService = inject(CalendarioService);
  private baseHelper = inject(BaseHelperService);

  async getById(id: number): Promise<Calendario | null> {
    return this.baseHelper.getDataFromResponse(
      this.calendarioService.getCalendarioAcademicoById(id)
    );
  }

  getByIdObservable(id: number): Observable<Calendario | null> {
    return this.baseHelper.getDataFromResponseObservable(
      this.calendarioService.getCalendarioAcademicoById(id)
    );
  }

  async getAll(filters: CalendarioFilters = {}): Promise<Calendario[]> {
    const response = await this.baseHelper.getDataFromResponse(
      this.calendarioService.getCalendariosAcademicos(filters)
    );
    return response?.content || [];
  }

  getAllObservable(filters: CalendarioFilters = {}): Observable<Calendario[]> {
    return this.baseHelper
      .getDataFromResponseObservable(
        this.calendarioService.getCalendariosAcademicos(filters)
      )
      .pipe(map((response) => response?.content || []));
  }

  // CRUD helpers
  async create(data: CreateCalendarioDTO): Promise<Calendario | null> {
    return this.baseHelper.getDataFromResponse(
      this.calendarioService.createCalendarioAcademico(data)
    );
  }

  async update(data: UpdateCalendarioDTO): Promise<Calendario | null> {
    return this.baseHelper.getDataFromResponse(
      this.calendarioService.updateCalendarioAcademico(data)
    );
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.baseHelper.getDataFromResponse(
      this.calendarioService.deleteCalendarioAcademico({ oidcalendario: id })
    );
    return result === true;
  }

  // Métodos auxiliares
  async getCalendarioNombre(id: number): Promise<string | null> {
    const calendario = await this.getById(id);
    if (calendario) {
      return `${calendario.anioCalendario} - ${calendario.numeroCalendario}`;
    }
    return null;
  }

  async checkCalendarioExists(id: number): Promise<boolean> {
    const calendario = await this.getById(id);
    return calendario !== null;
  }

  async getAllForDropdown(): Promise<
    { value: number; label: string; estado: EstadoCalendario }[]
  > {
    const calendarios = await this.getAll({ size: 100 });
    return calendarios.map((calendario) => ({
      value: calendario.oidcalendario,
      label: `${calendario.anioCalendario} - ${calendario.numeroCalendario}`,
      estado: calendario.estado,
    }));
  }

  async getCalendariosByEstado(
    estado: EstadoCalendario
  ): Promise<Calendario[]> {
    return this.getAll({ estado, size: 100 });
  }

  async getCalendariosActivos(): Promise<Calendario[]> {
    return this.getAll({ estado: 'ACTIVO', size: 100 });
  }
}
