import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalEliminarActividadComponent } from '../../components/activities-component/manage-activities-component/modal-eliminar-actividad/modal-eliminar-actividad.component';
import { ActividadResponse } from '../../models';
import { ActividadHelperService } from '../../services/actividades/actividad-helper.service';
import { ActivitiesBaseComponent } from '../../components/activities-component/manage-activities-component/activities-base/activities-base.component';

@Component({
  selector: 'app-management-activities-component',
  standalone: true,
  imports: [
    CommonModule,
    ActivitiesBaseComponent,
    ModalEliminarActividadComponent,
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
  handleEditar(actividadData: ActividadResponse): void {
    console.log('Editar actividad:', actividadData);
    // TODO: Implementar
    alert(
      `Funcionalidad de editar será implementada para: ${actividadData.actividad.nombreActividad}`
    );
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
