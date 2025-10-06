import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaActividadesAcademicasComponent } from '../../components/activities-component/explore-activities-component/tabla-actividades-academicas/tabla-actividades-academicas.component';
import { ModalEliminarActividadComponent } from '../../components/activities-component/manage-activities-component/modal-eliminar-actividad/modal-eliminar-actividad.component';
import { ActividadResponse } from '../../models';
import { ActividadesService } from '../../services/actividades/actividades.service';
import { ActividadHelperService } from '../../services/actividades/actividad-helper.service';

@Component({
  selector: 'app-management-activities-component',
  standalone: true,
  imports: [
    CommonModule,
    TablaActividadesAcademicasComponent,
    ModalEliminarActividadComponent,
  ],
  templateUrl: './management-activities-component.component.html',
  styleUrl: './management-activities-component.component.css',
})
export class ManagementActivitiesComponentComponent {
  activeTab: string = 'academicas';
  private actividadHelperService = inject(ActividadHelperService);

  // Estados del modal de eliminación
  mostrarModalEliminar: boolean = false;
  actividadAEliminar: ActividadResponse | null = null;
  eliminando: boolean = false;

  // Mensajes de feedback
  mensajeExito: string = '';
  mensajeError: string = '';

  selectTab(tab: string): void {
    this.activeTab = tab;
    this.limpiarMensajes();
  }

  // ============= EDITAR =============
  handleEditar(actividadData: ActividadResponse): void {
    console.log('Editar actividad:', actividadData);
    // TODO: Implementar
    alert(
      `Funcionalidad de editar será implementada para: ${actividadData.actividad.nombreActividad}`
    );
  }

  async confirmarEliminacion(): Promise<void> {
    if (!this.actividadAEliminar) return;

    this.eliminando = true;
    this.limpiarMensajes();

    try {
      // Llamar al servicio para eliminar
      await this.actividadHelperService.delete(
        this.actividadAEliminar.actividad.oidActividad
      );

      // Mostrar mensaje de éxito
      this.mensajeExito = `Actividad "${this.actividadAEliminar.actividad.nombreActividad}" eliminada exitosamente.`;

      // Cerrar modal
      this.cerrarModalEliminar();

      // Auto-ocultar mensaje después de 5 segundos
      setTimeout(() => {
        this.mensajeExito = '';
      }, 5000);
    } catch (error: any) {
      console.error('Error al eliminar actividad:', error);
      this.mensajeError =
        error?.message ||
        'Error al eliminar la actividad. Por favor, intente nuevamente.';
      this.cerrarModalEliminar();

      // Auto-ocultar mensaje de error después de 8 segundos
      setTimeout(() => {
        this.mensajeError = '';
      }, 8000);
    } finally {
      this.eliminando = false;
    }
  }

  // ============= ELIMINAR =============
  handleEliminar(actividadData: ActividadResponse): void {
    this.actividadAEliminar = actividadData;
    this.mostrarModalEliminar = true;
    this.limpiarMensajes();
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
