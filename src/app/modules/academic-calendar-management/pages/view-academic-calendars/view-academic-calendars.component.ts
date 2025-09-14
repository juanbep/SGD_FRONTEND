import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Calendario } from '../../models';
import { RouterModule } from '@angular/router';
import { CalendarioService } from '../../services/calendario.service';
import { ToastrService } from 'ngx-toastr';
import { Utils } from '../../utils/calendario.utils';
import { PaginatedResponse } from '../../shared/shared.model';

@Component({
  selector: 'app-view-academic-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-academic-calendars.component.html',
  styleUrl: './view-academic-calendars.component.css',
})
export class ViewAcademicCalendarsComponent implements OnInit {
  calendarios: Calendario[] = [];
  todosLosCalendarios: any = {
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 50,
    first: true,
    last: true,
  };
  calendarioVigente: any = {
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 10,
    first: true,
    last: true,
  };
  calendariosEspera: any = {
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 10,
    first: true,
    last: true,
  };
  historialCalendarios: any = {
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 10,
    first: true,
    last: true,
  };
  calendarioUtils = Utils;
  Math = Math;

  // Estados de loading por tab
  loading = false;
  loadingVigente = false;
  loadingEspera = false;
  loadingHistorial = false;

  error: string | null = null;

  // Paginación
  page = 0;
  size = 50;
  totalElements = 0;

  constructor(
    private calendarioService: CalendarioService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarTodosLosCalendarios();
  }

  // MÉTODO PRINCIPAL PARA CARGAR TODOS LOS CALENDARIOS
  cargarTodosLosCalendarios(page: number = 0, size: number = 100): void {
    this.loading = true;
    this.loadingVigente = true;
    this.loadingEspera = true;
    this.loadingHistorial = true;
    this.error = null;

    // Cargar más registros para tener datos suficientes para filtrar
    this.calendarioService.obtenerCalendarios(page, size).subscribe({
      next: (response: PaginatedResponse<Calendario>) => {
        console.log('Todos los calendarios cargados:', response);

        this.todosLosCalendarios = response.data;
        this.calendarios = response.data.content; // Mantenido para compatibilidad
        this.totalElements = response.data.totalElements;

        // Filtrar y distribuir en las diferentes secciones
        this.filtrarCalendariosPorEstado();

        if (response.mensaje) {
          this.toastr.success(response.mensaje, 'Calendarios Cargados');
        }

        this.loading = false;
        this.loadingVigente = false;
        this.loadingEspera = false;
        this.loadingHistorial = false;
      },
      error: (error) => {
        console.error('Error al cargar calendarios:', error);
        this.handleError(error, 'cargar calendarios');
        this.loading = false;
        this.loadingVigente = false;
        this.loadingEspera = false;
        this.loadingHistorial = false;
      },
    });
  }

  // MÉTODO PARA FILTRAR CALENDARIOS POR ESTADO
  private filtrarCalendariosPorEstado(): void {
    const calendarios = this.todosLosCalendarios.content || [];

    // Filtrar calendarios vigentes (ACTIVO)
    const vigentes = calendarios.filter(
      (cal: Calendario) => cal.estado === 'ACTIVO'
    );
    this.calendarioVigente = this.crearPaginacionLocal(vigentes, 'vigente');

    // Filtrar calendarios en espera (APROBADO, PENDIENTE)
    const enEspera = calendarios.filter(
      (cal: Calendario) =>
        cal.estado === 'APROBADO' || cal.estado === 'PENDIENTE'
    );
    this.calendariosEspera = this.crearPaginacionLocal(enEspera, 'espera');

    // Filtrar historial (DESHABILITADO)
    const historial = calendarios.filter(
      (cal: Calendario) => cal.estado === 'DESHABILITADO'
    );
    this.historialCalendarios = this.crearPaginacionLocal(
      historial,
      'historial'
    );

    console.log('Calendarios filtrados por estado:', {
      vigentes: vigentes.length,
      enEspera: enEspera.length,
      historial: historial.length,
      total: calendarios.length,
    });
  }

  // MÉTODO PARA CREAR PAGINACIÓN LOCAL
  private crearPaginacionLocal(
    data: Calendario[],
    tipo: string,
    pageSize: number = 10
  ): any {
    const totalElements = data.length;
    const totalPages = Math.ceil(totalElements / pageSize);

    // Obtener página actual según el tipo
    let currentPage = 0;
    switch (tipo) {
      case 'vigente':
        currentPage = this.calendarioVigente?.number || 0;
        break;
      case 'espera':
        currentPage = this.calendariosEspera?.number || 0;
        break;
      case 'historial':
        currentPage = this.historialCalendarios?.number || 0;
        break;
    }

    // Asegurar que currentPage esté dentro del rango válido
    currentPage = Math.max(0, Math.min(currentPage, totalPages - 1));

    // Calcular datos de la página actual
    const startIndex = currentPage * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalElements);
    const pageContent = data.slice(startIndex, endIndex);

    return {
      content: pageContent,
      totalElements: totalElements,
      totalPages: totalPages,
      number: currentPage,
      size: pageSize,
      first: currentPage === 0,
      last: currentPage >= totalPages - 1 || totalPages === 0,
      numberOfElements: pageContent.length,
      empty: pageContent.length === 0,
    };
  }

  // MÉTODOS DE CARGA ESPECÍFICOS (AHORA SOLO CAMBIAN PÁGINA LOCAL)
  loadCalendarioVigente(page: number = 0): void {
    this.loadingVigente = true;
    this.calendarioVigente.number = page;
    this.filtrarCalendariosPorEstado();
    this.loadingVigente = false;
  }

  loadCalendariosEspera(page: number = 0): void {
    this.loadingEspera = true;
    this.calendariosEspera.number = page;
    this.filtrarCalendariosPorEstado();
    this.loadingEspera = false;
  }

  loadHistorialCalendarios(page: number = 0): void {
    this.loadingHistorial = true;
    this.historialCalendarios.number = page;
    this.filtrarCalendariosPorEstado();
    this.loadingHistorial = false;
  }

  // Método para cambiar página
  changePage(tipo: string, pageNumber: number): void {
    switch (tipo) {
      case 'vigente':
        this.loadCalendarioVigente(pageNumber);
        break;
      case 'espera':
        this.loadCalendariosEspera(pageNumber);
        break;
      case 'historial':
        this.loadHistorialCalendarios(pageNumber);
        break;
      default:
        console.warn('Tipo de calendario no reconocido:', tipo);
    }
  }

  // Método para obtener páginas visibles en el paginador
  getVisiblePages(paginationData: any): number[] {
    if (
      !paginationData ||
      !paginationData.totalPages ||
      paginationData.totalPages <= 1
    ) {
      return [];
    }

    const totalPages = paginationData.totalPages;
    const currentPage = paginationData.number;
    const visiblePages: number[] = [];

    const start = Math.max(0, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  }

  formatearAnioPeriodo(anio: number, numero: number): string {
    return this.calendarioUtils.formatearAnioPeriodo(anio, numero);
  }

  // MÉTODO DE MANEJO DE ERRORES CENTRALIZADO
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

  // MÉTODOS ADICIONALES PARA CONTROLES DE LOADING
  isAnyLoading(): boolean {
    return (
      this.loading ||
      this.loadingVigente ||
      this.loadingEspera ||
      this.loadingHistorial
    );
  }

  getLoadingState(tipo: string): boolean {
    switch (tipo) {
      case 'vigente':
        return this.loadingVigente;
      case 'espera':
        return this.loadingEspera;
      case 'historial':
        return this.loadingHistorial;
      default:
        return false;
    }
  }

  // MÉTODO PARA REINTENTAR CARGA ESPECÍFICA
  reintentarCarga(tipo: string): void {
    switch (tipo) {
      case 'vigente':
        this.loadCalendarioVigente(this.calendarioVigente.number);
        break;
      case 'espera':
        this.loadCalendariosEspera(this.calendariosEspera.number);
        break;
      case 'historial':
        this.loadHistorialCalendarios(this.historialCalendarios.number);
        break;
      case 'all':
      default:
        this.cargarTodosLosCalendarios();
    }
  }
}
