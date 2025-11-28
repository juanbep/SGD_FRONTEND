import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalEliminarActividadComponent } from '../../components/manage-activities-component/modal-eliminar-actividad/modal-eliminar-actividad.component';
import { ActividadResponse, UpdateActividadDTO } from '../../models';
import { ActividadHelperService } from '../../services/actividades/actividad-helper.service';
import { ActivitiesBaseComponent } from '../../components/manage-activities-component/activities-base/activities-base.component';
import { ModalEditarActividadComponent } from '../../components/manage-activities-component/modal-editar-actividad/modal-editar-actividad.component';

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

  // Opcional: si luego quieres pasar combos al modal,
  // puedes declarar aquí y llenarlos más adelante.
  calendariosDropdown: { value: number; label: string }[] = [];
  tiposActividadDropdown: { value: number; label: string }[] = [];
  estadosDropdown: { value: number | string; label: string }[] = [];
  cargosDropdown: { value: number | string; label: string }[] = [];

  handleEditar(actividadData: ActividadResponse): void {
    console.log('Editar actividad:', actividadData);
    this.actividadAEditar = actividadData;
    this.mostrarModalEditar = true;
    this.limpiarMensajes();
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.actividadAEditar = null;
  }

  async confirmarEdicion(dto: UpdateActividadDTO): Promise<void> {
    if (!this.actividadAEditar) return;

    this.editando = true;
    this.limpiarMensajes();

    try {
      // Llamar al helper para actualizar
      await this.actividadHelperService.update(dto);

      // Actualizar el objeto en memoria para que la tabla refleje los cambios
      const act = this.actividadAEditar.actividad;
      act.nombreActividad = dto.nombreActividad ?? act.nombreActividad;
      act.semanas = dto.semanas ?? act.semanas;
      act.oidEstadoActividad = dto.oidEstadoActividad ?? act.oidEstadoActividad;
      act.tipoActividad.oidTipoActividad =
        dto.oidTipoActividad ?? act.tipoActividad.oidTipoActividad;
      act.atributos = (dto.atributos as any) ?? act.atributos;

      this.mensajeExito = `Actividad "${this.actividadAEditar.actividad.nombreActividad}" actualizada correctamente.`;
      this.cerrarModalEditar();

      setTimeout(() => {
        this.mensajeExito = '';
      }, 5000);
    } catch (error: any) {
      console.error('Error al actualizar actividad:', error);
      this.mensajeError =
        error?.message ||
        'Error al actualizar la actividad. Por favor, intente nuevamente.';

      setTimeout(() => {
        this.mensajeError = '';
      }, 8000);
    } finally {
      this.editando = false;
    }
  }

  // ============= ELIMINAR =============
  handleEliminar(actividadData: ActividadResponse): void {
    this.actividadAEliminar = actividadData;
    this.mostrarModalEliminar = true;
    this.limpiarMensajes();
  }

  async confirmarEliminacion(): Promise<void> {
    if (!this.actividadAEliminar) return;

    this.eliminando = true;
    this.limpiarMensajes();

    try {
      await this.actividadHelperService.delete(
        this.actividadAEliminar.actividad.oidActividad
      );

      this.mensajeExito = `Actividad "${this.actividadAEliminar.actividad.nombreActividad}" eliminada exitosamente.`;
      this.cerrarModalEliminar();

      setTimeout(() => {
        this.mensajeExito = '';
      }, 5000);
    } catch (error: any) {
      console.error('Error al eliminar actividad:', error);
      this.mensajeError =
        error?.message ||
        'Error al eliminar la actividad. Por favor, intente nuevamente.';
      this.cerrarModalEliminar();

      setTimeout(() => {
        this.mensajeError = '';
      }, 8000);
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
