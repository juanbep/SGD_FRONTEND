import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, DatePipe, NgIf, NgFor } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CalendarioHelperService } from '../../../services/calendario/calendario-helper.service';
import { Calendario } from '../../../models';

@Component({
  selector: 'app-view-academic-calendar',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, DatePipe, RouterLink],
  templateUrl: './view-academic-calendar.component.html',
  styleUrl: './view-academic-calendar.component.css',
})
export class ViewAcademicCalendarComponent implements OnInit {
  calendario: Calendario | null = null;
  calendarioId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private calendarioHelper: CalendarioHelperService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.calendarioId = +idParam;
        this.obtenerCalendarioPorId(this.calendarioId);
      }
    });
  }

  obtenerCalendarioPorId(id: number): void {
    this.loading = true;
    this.error = null;

    this.calendarioHelper.getByIdObservable(id).subscribe({
      next: (calendario) => {
        if (calendario) {
          this.calendario = calendario;
          this.toastr.success('Calendario cargado correctamente');
        } else {
          this.error = 'Calendario no encontrado';
          this.toastr.warning('Calendario no encontrado');
        }
        this.loading = false;
      },
      error: (error) => {
        this.handleError(error);
        this.loading = false;
      },
    });
  }

  private handleError(error: any): void {
    const codigoBackend = error?.error?.codigo || error.status || '—';
    const mensajeBackend =
      error?.error?.mensaje ||
      error?.message ||
      'Error al cargar el calendario';

    this.error = `Status Code: ${codigoBackend} - ${mensajeBackend}`;
    this.toastr.error(this.error, 'Error');
  }

  reintentar(): void {
    if (this.calendarioId) {
      this.obtenerCalendarioPorId(this.calendarioId);
    }
  }
}
