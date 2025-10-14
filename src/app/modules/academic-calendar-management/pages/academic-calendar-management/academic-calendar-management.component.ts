import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ListAcademicCalendarsComponent } from '../../components/list-academic-calendars/list-academic-calendars.component';
import { CalendarioService, CalendarioHelperService } from '../../services';
import { Calendario } from '../../models';

@Component({
  selector: 'app-academic-calendar-management',
  standalone: true,
  imports: [CommonModule, ListAcademicCalendarsComponent],
  templateUrl: './academic-calendar-management.component.html',
  styleUrl: './academic-calendar-management.component.css',
})
export class AcademicCalendarManagementComponent {
  @ViewChild(ListAcademicCalendarsComponent)
  tablaCalendarios!: ListAcademicCalendarsComponent;

  private router = inject(Router);
  private calendarioService = inject(CalendarioService);
  private calendarioHelperService = inject(CalendarioHelperService);
  private toastr = inject(ToastrService);

  // Estado para confirmación de eliminación
  calendarioAEliminar: Calendario | null = null;
  mostrarModalConfirmacion = false;
  eliminando = false;

  onEditarCalendario(calendario: Calendario): void {
    console.log(calendario.oidcalendario);
    this.router.navigate([
      '/app/gestion-calendario-academico/editar',
      calendario.oidcalendario,
    ]);
  }

  onEliminarCalendario(calendario: Calendario): void {
    // Mostrar modal de confirmación
    this.calendarioAEliminar = calendario;
    this.mostrarModalConfirmacion = true;
  }

  async confirmarEliminacion(): Promise<void> {
    if (!this.calendarioAEliminar) return;

    this.eliminando = true;
    const id = this.calendarioAEliminar.oidcalendario;

    try {
      const resultado = await this.calendarioHelperService.delete(id);

      if (resultado) {
        this.toastr.success('Calendario eliminado correctamente');
        this.cerrarModal();
        // Recargar la lista usando el ViewChild
        this.tablaCalendarios.cargarCalendarios();
      } else {
        this.toastr.warning('No se pudo eliminar el calendario');
        this.eliminando = false;
      }
    } catch (error) {
      console.log("acontinuacion el error")
      console.log(error)
      this.handleError(error);
      this.eliminando = false;
    }
  }

  cancelarEliminacion(): void {
    this.cerrarModal();
  }

  private cerrarModal(): void {
    this.mostrarModalConfirmacion = false;
    this.calendarioAEliminar = null;
    this.eliminando = false;
  }

  private handleError(error: any): void {
    const codigoBackend = error?.error?.codigo || error.status || '—';
    const mensajeBackend =
      error?.error?.mensaje ||
      error?.message ||
      'Error al eliminar el calendario';
    this.toastr.error(
      `Status Code: ${codigoBackend} - ${mensajeBackend}`,
      'Error'
    );
  }
}
