// edit-academic-calendar.component.ts (SIMPLIFICADO)

import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CalendarioService, FechaHelperService } from '../../services';
import { Calendario, Fecha } from '../../models';
import { ModalEliminarFechaComponent } from './modal-eliminar-fecha/modal-eliminar-fecha.component';
import { DetalleCalendarioComponent } from './detalle-calendario/detalle-calendario.component';
import { Utils } from '../../utils/calendario.utils';

@Component({
  selector: 'app-edit-academic-calendar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ModalEliminarFechaComponent,
    DetalleCalendarioComponent,
  ],
  templateUrl: './edit-academic-calendar.component.html',
  styleUrl: './edit-academic-calendar.component.css',
})
export class EditAcademicCalendarComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly calendarioService = inject(CalendarioService);
  private readonly fechaHelper = inject(FechaHelperService);

  // ===== SIGNALS =====
  readonly calendario = signal<Calendario | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly modalEliminarVisible = signal<boolean>(false);
  readonly fechaAEliminar = signal<Fecha | null>(null);

  // ===== COMPUTED =====
  readonly tituloCalendario = computed(() => {
    const cal = this.calendario();
    return cal
      ? `Calendario académico ${cal.anioCalendario}-${cal.numeroCalendario}`
      : 'Cargando...';
  });

  readonly fechasCalendario = computed(() => this.calendario()?.fechas || []);

  // ===== CONSTANTES =====
  readonly OIDS_FECHA_UNICA = [1, 3, 4, 5, 7, 8, 9, 10, 14, 16, 18];

  // ===== MÉTODOS HELPER =====
  readonly formatoFecha = (fecha: Fecha): string => {
    return Utils.formatearFecha(
      fecha.fechaInicial,
      fecha.fechaFin,
      fecha.oidNombreFecha,
      this.OIDS_FECHA_UNICA
    );
  };

  ngOnInit(): void {
    this.cargarCalendario();
  }

  // ===== CARGA DE DATOS =====
  private cargarCalendario(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id || isNaN(+id)) {
      this.toastr.error('ID de calendario inválido');
      this.router.navigate(['/app/gestion-calendario-academico']);
      return;
    }

    this.isLoading.set(true);

    this.calendarioService.getCalendarioAcademicoById(+id).subscribe({
      next: (response) => {
        if (response.codigo === 200 && response.data) {
          this.calendario.set(response.data);
        } else {
          const mensaje = response.mensaje || 'No se pudo cargar el calendario';
          this.toastr.error(mensaje);
          this.router.navigate(['/app/gestion-calendario-academico']);
        }
      },
      error: (error) => {
        console.error('Error al cargar calendario:', error);
        const mensajeError =
          error?.error?.mensaje || 'Ocurrió un error inesperado';
        this.toastr.error(mensajeError);
        this.router.navigate(['/app/gestion-calendario-academico']);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  // ===== HANDLER PARA ACTUALIZACIÓN DESDE HIJO =====
  onCalendarioActualizado(calendarioActualizado: Calendario): void {
    this.calendario.set(calendarioActualizado);
  }

  // ===== MODAL ELIMINAR FECHAS =====
  abrirModalEliminar(fecha: Fecha): void {
    this.fechaAEliminar.set(fecha);
    this.modalEliminarVisible.set(true);
  }

  cerrarModalEliminar(): void {
    this.modalEliminarVisible.set(false);
    this.fechaAEliminar.set(null);
  }

  async confirmarEliminarFecha(): Promise<void> {
    const fecha = this.fechaAEliminar();
    if (!fecha) return;

    try {
      const resultado = await this.fechaHelper.delete(fecha.oidFecha);

      if (resultado) {
        const calendarioActual = this.calendario();
        if (calendarioActual?.fechas) {
          const fechasActualizadas = calendarioActual.fechas.filter(
            (f) => f.oidFecha !== fecha.oidFecha
          );

          this.calendario.set({
            ...calendarioActual,
            fechas: fechasActualizadas,
          });
        }

        this.toastr.success('Fecha eliminada con éxito');
        this.cerrarModalEliminar();
      }
    } catch (error: any) {
      console.log('ERROR CAPTURADO EN COMPONENTE:', error);
      this.cerrarModalEliminar();
      const mensaje = error?.error?.mensaje || 'Error al eliminar la fecha';
      this.toastr.error(mensaje);
    }
  }
}
