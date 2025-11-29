import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalEliminarActividadComponent } from '../../components/manage-activities-component/modal-eliminar-actividad/modal-eliminar-actividad.component';
import { ActividadResponse, UpdateActividadDTO } from '../../models';
import { ActividadHelperService } from '../../services/actividades/actividad-helper.service';
import { ActivitiesBaseComponent } from '../../components/manage-activities-component/activities-base/activities-base.component';
import { ModalEditarActividadComponent } from '../../components/manage-activities-component/modal-editar-actividad/modal-editar-actividad.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-management-activities-component',
  standalone: true,
  imports: [
    CommonModule,
    ActivitiesBaseComponent,
    ModalEliminarActividadComponent,
    ModalEditarActividadComponent,
  ],
  templateUrl: './management-activities-component.component.html',
  styleUrl: './management-activities-component.component.css',
})
export class ManagementActivitiesComponentComponent {
  private actividadHelperService = inject(ActividadHelperService);
  private toastr = inject(ToastrService);

  @ViewChild(ActivitiesBaseComponent) activitiesBase!: ActivitiesBaseComponent;

  // Estados del modal de eliminación
  mostrarModalEliminar: boolean = false;
  actividadAEliminar: ActividadResponse | null = null;
  eliminando: boolean = false;

  // Mensajes de feedback
  mensajeExito: string = '';
  mensajeError: string = '';

  // ============= EDITAR =============
  mostrarModalEditar: boolean = false;
  actividadAEditar: ActividadResponse | null = null;
  editando: boolean = false;

  // Opcional: pasar combos select al modal
  calendariosDropdown: { value: number; label: string }[] = [];
  tiposActividadDropdown: { value: number; label: string }[] = [];
  estadosDropdown: { value: number | string; label: string }[] = [];
  cargosDropdown: { value: number | string; label: string }[] = [];

  handleEditar(actividadData: ActividadResponse): void {
    this.actividadAEditar = actividadData;
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.actividadAEditar = null;
  }

  async confirmarEdicion(dto: UpdateActividadDTO): Promise<void> {
    if (!this.actividadAEditar) return;

    this.editando = true;

    try {
      console.log('📡 Enviando al backend:', dto);

      const resultado = await this.actividadHelperService.update(dto);

      console.log('✅ Respuesta del backend:', resultado);

      this.toastr.success(
        `Actividad "${this.actividadAEditar.actividad.nombreActividad}" actualizada correctamente`,
        'Actualización exitosa'
      );
      this.cerrarModalEditar();
      this.activitiesBase.recargarTabla();
    } catch (error: any) {
      console.error('❌ Error al actualizar:', error);
      const mensajeError =
        error?.error?.mensaje ||
        error?.message ||
        'Error al actualizar la actividad.';
      this.toastr.error(mensajeError, 'Error al actualizar');
    } finally {
      this.editando = false;
    }
  }

  handleEliminar(actividadData: ActividadResponse): void {
    this.actividadAEliminar = actividadData;
    this.mostrarModalEliminar = true;
  }

  async confirmarEliminacion(): Promise<void> {
    if (!this.actividadAEliminar) return;

    this.eliminando = true;

    try {
      await this.actividadHelperService.delete(
        this.actividadAEliminar.actividad.oidActividad
      );

      this.toastr.success(
        `Actividad "${this.actividadAEliminar.actividad.nombreActividad}" eliminada exitosamente`,
        'Eliminación exitosa'
      );
      this.cerrarModalEliminar();

      // Llamar método para recargar
      this.activitiesBase.recargarTabla();
    } catch (error: any) {
      console.error('Error al eliminar actividad:', error);
      const mensajeError =
        error?.error?.mensaje ||
        error?.message ||
        'Error al eliminar la actividad.';
      this.toastr.error(mensajeError, 'Error al eliminar');
      this.cerrarModalEliminar();
    } finally {
      this.eliminando = false;
    }
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.actividadAEliminar = null;
  }

  limpiarMensajes(): void {
    this.mensajeExito = '';
    this.mensajeError = '';
  }

  cerrarMensaje(tipo: 'exito' | 'error'): void {
    if (tipo === 'exito') {
      this.mensajeExito = '';
    } else {
      this.mensajeError = '';
    }
  }
}
