import { Injectable, inject } from '@angular/core';
import { FechasService } from '../../services';
import { BaseHelperService } from '../base-helper.service';
import {
  Fecha,
  CreateFechaDto,
  UpdateFechaDto,
  FechaFilters,
  TipoFecha,
} from '../../models';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FechaHelperService {
  private fechaService = inject(FechasService);
  private baseHelper = inject(BaseHelperService);

  // Métodos headless para consumo programático

  async getById(id: number): Promise<Fecha | null> {
    return this.baseHelper.getDataFromResponse(
      this.fechaService.getFechaById(id)
    );
  }

  getByIdObservable(id: number): Observable<Fecha | null> {
    return this.baseHelper.getDataFromResponseObservable(
      this.fechaService.getFechaById(id)
    );
  }

  async getAll(filters: FechaFilters = {}): Promise<Fecha[]> {
    const response = await this.baseHelper.getDataFromResponse(
      this.fechaService.getFechas(filters)
    );
    return response?.content || [];
  }

  getAllObservable(filters: FechaFilters = {}): Observable<Fecha[]> {
    return this.baseHelper
      .getDataFromResponseObservable(this.fechaService.getFechas(filters))
      .pipe(map((response) => response?.content || []));
  }

  // CRUD helpers
  async create(data: CreateFechaDto): Promise<Fecha | null> {
    return this.baseHelper.getDataFromResponse(
      this.fechaService.createFecha(data)
    );
  }

  async update(data: UpdateFechaDto): Promise<Fecha | null> {
    return this.baseHelper.getDataFromResponse(
      this.fechaService.updateFecha(data)
    );
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.baseHelper.getDataFromResponse(
      this.fechaService.deleteFecha({ oidFecha: id })
    );
    return result === true || result === null; // trampita mientras se acomoda por parte del backend 
  }

  // Métodos de conveniencia específicos del dominio

  async getFechaNombre(id: number): Promise<string | null> {
    const fecha = await this.getById(id);
    return fecha?.nombre || null;
  }

  async checkFechaExists(id: number): Promise<boolean> {
    const fecha = await this.getById(id);
    return fecha !== null;
  }

  async getFechaCalendario(id: number): Promise<string | null> {
    const fecha = await this.getById(id);
    return fecha?.nombreCalendario || null;
  }

  async getFechaTipo(id: number): Promise<TipoFecha | null> {
    const fecha = await this.getById(id);
    return fecha?.tipo || null;
  }

  // Helpers para dropdowns y selecciones

  async getAllForDropdown(): Promise<
    { value: number; label: string; tipo: TipoFecha }[]
  > {
    const fechas = await this.getAll({ size: 200 });
    return fechas.map((fecha) => ({
      value: fecha.oidFecha,
      label: fecha.nombre,
      tipo: fecha.tipo,
    }));
  }

  async getFechasByCalendario(calendarioId: number): Promise<Fecha[]> {
    return this.getAll({ oidCalendario: calendarioId, size: 200 });
  }

  async getFechasByTipo(tipo: TipoFecha): Promise<Fecha[]> {
    return this.getAll({ tipo, size: 200 });
  }

  async getFechasResaltadas(): Promise<Fecha[]> {
    return this.getFechasByTipo('RESALTADAS');
  }

  async getFechasNoResaltadas(): Promise<Fecha[]> {
    return this.getFechasByTipo('NO_RESALTADAS');
  }

  async getFechasResaltadasByCalendario(
    calendarioId: number
  ): Promise<Fecha[]> {
    return this.getAll({
      oidCalendario: calendarioId,
      tipo: 'RESALTADAS',
      size: 200,
    });
  }

  async getFechasNoResaltadasByCalendario(
    calendarioId: number
  ): Promise<Fecha[]> {
    return this.getAll({
      oidCalendario: calendarioId,
      tipo: 'NO_RESALTADAS',
      size: 200,
    });
  }

  async searchByNombre(nombre: string): Promise<Fecha[]> {
    return this.getAll({ nombre, size: 50 });
  }

  // Helpers para validaciones de fechas

  async validateFechaEnRango(
    fechaId: number,
    fechaReferencia: Date
  ): Promise<boolean> {
    const fecha = await this.getById(fechaId);
    if (!fecha) return false;

    const fechaInicial = new Date(fecha.fechaInicial);
    const fechaFin = new Date(fecha.fechaFin);

    return fechaReferencia >= fechaInicial && fechaReferencia <= fechaFin;
  }

  async getFechasActivasEnRango(
    fechaInicio: string,
    fechaFin: string
  ): Promise<Fecha[]> {
    return this.getAll({
      fechaInicialDesde: fechaInicio,
      fechaFinHasta: fechaFin,
      size: 200,
    });
  }

  async getFechasPorRango(
    calendarioId: number,
    fechaDesde: string,
    fechaHasta: string
  ): Promise<Fecha[]> {
    return this.getAll({
      oidCalendario: calendarioId,
      fechaInicialDesde: fechaDesde,
      fechaFinHasta: fechaHasta,
      size: 200,
    });
  }

  // Helper para obtener fechas ordenadas por fecha inicial
  async getFechasOrdenadas(calendarioId?: number): Promise<Fecha[]> {
    const filters: FechaFilters = {
      sortBy: 'fechaInicial',
      sortDirection: 'asc',
      size: 200,
    };

    if (calendarioId) {
      filters.oidCalendario = calendarioId;
    }

    return this.getAll(filters);
  }

  // Helper para verificar si una fecha es de un solo día
  async esFechaUnica(fechaId: number): Promise<boolean> {
    const fecha = await this.getById(fechaId);
    if (!fecha) return false;

    const fechaInicial = new Date(fecha.fechaInicial)
      .toISOString()
      .split('T')[0];
    const fechaFin = new Date(fecha.fechaFin).toISOString().split('T')[0];

    return fechaInicial === fechaFin;
  }

  // Helper para obtener duración en días
  async getDuracionEnDias(fechaId: number): Promise<number | null> {
    const fecha = await this.getById(fechaId);
    if (!fecha) return null;

    const fechaInicial = new Date(fecha.fechaInicial);
    const fechaFin = new Date(fecha.fechaFin);

    const diferenciaMilisegundos = fechaFin.getTime() - fechaInicial.getTime();
    const diferenciaDias = Math.ceil(
      diferenciaMilisegundos / (1000 * 60 * 60 * 24)
    );

    return diferenciaDias + 1; // +1 para incluir ambos días
  }
}
