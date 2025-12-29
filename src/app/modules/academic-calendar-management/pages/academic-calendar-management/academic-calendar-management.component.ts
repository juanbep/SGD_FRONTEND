import { Component, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ListAcademicCalendarsComponent } from '../../components/list-academic-calendars/list-academic-calendars.component';
import { CalendarioService, CalendarioHelperService } from '../../services';
import { Calendario } from '../../models';
import { ModalEliminarCalendarioComponent } from '../../components/modal-eliminar-calendario/modal-eliminar-calendario.component';

@Component({
  selector: 'app-academic-calendar-management',
  standalone: true,
  imports: [
    CommonModule,
    ListAcademicCalendarsComponent,
    ModalEliminarCalendarioComponent,
  ],
  templateUrl: './academic-calendar-management.component.html',
  styleUrl: './academic-calendar-management.component.css',
})
export class AcademicCalendarManagementComponent {
  @ViewChild(ListAcademicCalendarsComponent)
  tablaCalendarios!: ListAcademicCalendarsComponent;

  private readonly router = inject(Router);
  private readonly calendarioHelperService = inject(CalendarioHelperService);
  private readonly toastr = inject(ToastrService);

  // ===== SIGNALS =====
  readonly modalEliminarVisible = signal<boolean>(false);
  readonly calendarioAEliminar = signal<Calendario | null>(null);

  // ===== MÉTODOS DE NAVEGACIÓN Y ACCIONES =====
  onEditarCalendario(calendario: Calendario): void {
    this.router.navigate([
      '/app/gestion-calendario-academico/editar',
      calendario.oidcalendario,
    ]);
  }

  onEliminarCalendario(calendario: Calendario): void {
    this.calendarioAEliminar.set(calendario);
    this.modalEliminarVisible.set(true);
  }

  // ===== MODAL ELIMINAR =====
  cerrarModalEliminar(): void {
    this.modalEliminarVisible.set(false);
    this.calendarioAEliminar.set(null);
  }

  async confirmarEliminarCalendario(): Promise<void> {
    const calendario = this.calendarioAEliminar();
    if (!calendario) return;

    // Validación de roles
    if (!this.validarRol()) {
      this.toastr.error('No tienes permisos para eliminar calendarios');
      this.cerrarModalEliminar();
      return;
    }

    try {
      const resultado = await this.calendarioHelperService.delete(
        calendario.oidcalendario
      );

      if (resultado) {
        this.toastr.success('Calendario eliminado correctamente');
        this.cerrarModalEliminar();
        this.tablaCalendarios.cargarCalendarios();
      }
    } catch (error: any) {
      this.cerrarModalEliminar();
      const mensaje =
        error?.error?.mensaje || 'Error al eliminar el calendario';
      this.toastr.error(mensaje);
    }
  }

  private validarRol(): boolean {
    const rolesLocalStorage = localStorage.getItem('userRoles');
    if (rolesLocalStorage) {
      const userRoles = JSON.parse(rolesLocalStorage);
      return userRoles.includes('SECRETARIA/O FACULTAD');
    }
    return false;
  }
}
