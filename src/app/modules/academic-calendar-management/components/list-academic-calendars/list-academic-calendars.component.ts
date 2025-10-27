import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Calendario } from '../../models';
import { Utils } from '../../utils/calendario.utils';
import { CalendarioService } from '../../services';

@Component({
  selector: 'app-list-academic-calendars',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-academic-calendars.component.html',
  styleUrl: './list-academic-calendars.component.css',
})
export class ListAcademicCalendarsComponent implements OnInit {
  @Input() modo: 'visualizar' | 'gestionar' = 'visualizar';
  @Output() onEditar = new EventEmitter<Calendario>();
  @Output() onEliminar = new EventEmitter<Calendario>();

  //Servicios
  private calendarioService = inject(CalendarioService);
  private toastr = inject(ToastrService);

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
          if (response.codigo >= 200 && response.codigo < 300) {
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

  irAPagina(nuevaPagina: number): void {
    this.page = nuevaPagina;
    this.cargarCalendarios();
  }

  onPageSizeChange(event: any): void {
    this.size = parseInt(event.target.value);
    this.page = 0; // Resetear a primera página
    this.cargarCalendarios();
  }

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

  // Métodos para gestión
  editarCalendario(calendario: Calendario): void {
    this.onEditar.emit(calendario);
  }

  eliminarCalendario(calendario: Calendario): void {
    this.onEliminar.emit(calendario);
  }

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
