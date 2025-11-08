import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, DatePipe, NgIf, NgFor } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CalendarioHelperService } from '../../services/calendario/calendario-helper.service';
import { Calendario } from '../../models';
import { Utils } from '../../utils/calendario.utils';

@Component({
  selector: 'app-view-academic-calendar',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, DatePipe, RouterLink],
  templateUrl: './view-academic-calendar.component.html',
  styleUrl: './view-academic-calendar.component.css',
})
export class ViewAcademicCalendarComponent implements OnInit {
  // ===== SERVICES (patrón inject) =====
  private readonly route = inject(ActivatedRoute);
  private readonly calendarioHelper = inject(CalendarioHelperService);
  private readonly toastr = inject(ToastrService);

  // ===== SIGNALS =====
  readonly calendario = signal<Calendario | null>(null);
  readonly calendarioId = signal<number | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly descargandoPdf = signal<boolean>(false);

  // ===== COMPUTED =====
  readonly fechasOrdenadas = computed(() => {
    const cal = this.calendario();
    if (!cal?.fechas) return [];
    return Utils.ordenarFechasPorOid(cal.fechas);
  });

  readonly tieneFechas = computed(() => this.fechasOrdenadas().length > 0);

  readonly tituloCalendario = computed(() => {
    const cal = this.calendario();
    return cal
      ? `Calendario Académico ${cal.anioCalendario}-${cal.numeroCalendario}`
      : 'Cargando...';
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.calendarioId.set(+idParam);
        this.obtenerCalendarioPorId(+idParam);
      }
    });
  }

  formatearFecha(
    fechaInicial: Date | string | null,
    fechaFin: Date | string | null,
    uniqueDate: boolean,
    oidNombreFecha: number
  ): string {
    return Utils.formatearFecha(
      fechaInicial,
      fechaFin,
      uniqueDate,
      oidNombreFecha
    );
  }

  obtenerCalendarioPorId(id: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.calendarioHelper.getByIdObservable(id).subscribe({
      next: (calendario) => {
        if (calendario) {
          this.calendario.set(calendario);
          this.toastr.success('Calendario cargado correctamente');
        } else {
          this.error.set('Calendario no encontrado');
          this.toastr.warning('Calendario no encontrado');
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.handleError(error);
        this.isLoading.set(false);
      },
    });
  }

  // ===== Método para descargar o abrir PDF =====
  async descargarOAbrirPdf(): Promise<void> {
    const id = this.calendarioId();
    const cal = this.calendario();

    if (!id || !cal) {
      this.toastr.warning('No hay calendario para descargar');
      return;
    }

    this.descargandoPdf.set(true);

    try {
      // Intentar abrir en nueva pestaña
      await this.calendarioHelper.openPdfInNewTab(id);
      this.toastr.success('Calendario abierto en nueva pestaña');
    } catch (error) {
      // Si falla, descargar
      try {
        const nombreArchivo = `Calendario_${cal.anioCalendario}_${cal.numeroCalendario}.pdf`;
        await this.calendarioHelper.downloadPdf(id, nombreArchivo);
        this.toastr.success('Calendario descargado correctamente');
      } catch (downloadError) {
        this.toastr.error('Error al procesar el calendario');
        console.error('Error:', downloadError);
      }
    } finally {
      this.descargandoPdf.set(false);
    }
  }

  private handleError(error: any): void {
    const codigoBackend = error?.error?.codigo || error.status || '—';
    const mensajeBackend =
      error?.error?.mensaje ||
      error?.message ||
      'Error al cargar el calendario';

    const mensajeError = `Status Code: ${codigoBackend} - ${mensajeBackend}`;
    this.error.set(mensajeError);
    this.toastr.error(mensajeError, 'Error');
  }

  reintentar(): void {
    const id = this.calendarioId();
    if (id) {
      this.obtenerCalendarioPorId(id);
    }
  }
}
