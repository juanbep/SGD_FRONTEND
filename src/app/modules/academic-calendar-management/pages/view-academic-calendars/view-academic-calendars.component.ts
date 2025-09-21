import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Utils } from '../../utils/calendario.utils';
import { Calendario, PaginatedResponse } from '../../models';
import { CalendarioService } from '../../services';
import { CalendarioHelperService } from '../../services/calendario/calendario-helper.service';

@Component({
  selector: 'app-view-academic-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './view-academic-calendars.component.html',
  styleUrl: './view-academic-calendars.component.css',
})
export class ViewAcademicCalendarsComponent implements OnInit {
  // Paginación
  page = 0;
  size = 10;
  totalElements = 0;

  // Datos
  calendarios: Calendario[] = [];
  loading = false;
  error: string | null = null;

  // Utils
  calendarioUtils = Utils;
  Math = Math;

  constructor(
    private calendarioService: CalendarioService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarCalendarios();
  }

  cargarCalendarios(): void {
    this.loading = true;
    this.error = null;

    this.calendarioService
      .getCalendariosAcademicos({
        page: this.page,
        size: this.size,
      })
      .subscribe({
        next: (response) => {
          if (response.codigo === 200) {
            this.calendarios = response.data.content;
            this.totalElements = response.data.totalElements;
            this.toastr.success(
              response.mensaje || 'Calendarios cargados correctamente'
            );
          } else {
            this.toastr.warning(
              response.mensaje || 'Respuesta inesperada del servidor'
            );
          }
          this.loading = false;
        },
        error: (error) => {
          this.handleError(error, 'cargar calendarios');
          this.loading = false;
        },
      });
  }

  // ✅ Navegación de página - Nueva petición HTTP
  irAPagina(nuevaPagina: number): void {
    this.page = nuevaPagina;
    this.cargarCalendarios();
  }

  // ✅ Cambio de tamaño de página
  onPageSizeChange(event: any): void {
    this.size = parseInt(event.target.value);
    this.page = 0; // Resetear a primera página
    this.cargarCalendarios();
  }

  // ✅ Utilidades de paginación
  getTotalPaginas(): number {
    return Math.ceil(this.totalElements / this.size);
  }

  getPaginasVisibles(): number[] {
    const totalPaginas = this.getTotalPaginas();
    if (totalPaginas <= 1) return [];

    const paginas: number[] = [];
    const inicio = Math.max(0, this.page - 2);
    const fin = Math.min(totalPaginas - 1, this.page + 2);

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    return paginas;
  }

  getInfoPaginacion(): string {
    if (this.totalElements === 0) return '0 registros';

    const inicio = this.page * this.size + 1;
    const fin = Math.min((this.page + 1) * this.size, this.totalElements);

    return `${inicio} - ${fin} de ${this.totalElements} registros`;
  }

  trackByCalendario(index: number, item: Calendario): any {
    return item.oidcalendario;
  }

  // ✅ Manejo de errores
  private handleError(error: any, operacion: string): void {
    const codigoBackend = error?.error?.codigo || error.status || '—';
    const mensajeBackend =
      error?.error?.mensaje ||
      error?.message ||
      `Error al ${operacion}. Intenta de nuevo.`;

    this.error = `Status Code: ${codigoBackend} - ${mensajeBackend}`;

    this.toastr.error(
      `Status Code: ${codigoBackend} - ${mensajeBackend}`,
      'Error'
    );
  }

  reintentar(): void {
    this.cargarCalendarios();
  }
}
