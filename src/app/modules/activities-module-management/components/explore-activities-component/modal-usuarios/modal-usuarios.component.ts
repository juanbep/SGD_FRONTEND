import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioCarouselComponent } from '../usuario-carousel/usuario-carousel.component';
import { ActividadHelperService } from '../../../services';
import { ToastrService } from 'ngx-toastr';
import {
  UsuarioActividadAsignacion,
  UsuarioEnActividad,
} from '../../../models';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-modal-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    UsuarioCarouselComponent,
    FormsModule,
    NgSelectModule,
  ],
  templateUrl: './modal-usuarios.component.html',
  styleUrl: './modal-usuarios.component.css',
})
export class ModalUsuariosComponent {
  @Input() usuariosAsignaciones: UsuarioActividadAsignacion[] = [];
  @Input() usuariosCompletos: UsuarioEnActividad[] = [];
  @Input() visible: boolean = false;
  @Input() oidActividad: number | null = null;
  @Input() oidCalendario: number | null = null;
  @Input() modo: 'visualizar' | 'gestionar' = 'visualizar';

  @Output() onCerrar = new EventEmitter<void>();
  @Output() onUsuarioDesasignado = new EventEmitter<void>();
  @Output() onUsuarioAsignado = new EventEmitter<void>();

  private actividadHelper = inject(ActividadHelperService);
  private toastr = inject(ToastrService);

  desasignando: boolean = false;

  // ========== PROPIEDADES PARA ASIGNACIÓN ==========

  mostrandoFormularioAsignacion: boolean = false;
  asignando: boolean = false;

  // Dropdowns
  usuariosDisponibles: { value: number; label: string }[] = [];
  cargosDisponibles: { value: number; label: string }[] = [];

  // Modelo del formulario
  nuevoUsuario = {
    oidUsuario: null as number | null,
    oidCargoActividad: null as number | null,
    horas: 0,
  };

  // ========== MÉTODOS PARA DESASIGNAR USUARIO ==========

  async desasignarUsuario(oidUsuario: number): Promise<void> {
    if (!this.oidActividad || !this.oidCalendario) {
      console.error('Faltan oidActividad u oidCalendario para desasignar');
      this.toastr.error('Error: Faltan datos necesarios para desasignar');
      return;
    }

    if (this.desasignando) {
      return;
    }

    this.desasignando = true;

    try {
      const resultado = await this.actividadHelper.desasignarUsuario(
        this.oidActividad,
        this.oidCalendario,
        oidUsuario
      );

      if (resultado) {
        const mensaje =
          resultado.mensaje || 'Usuario desasignado correctamente';
        this.toastr.success(mensaje);

        // Remover de ambas listas locales
        this.usuariosAsignaciones = this.usuariosAsignaciones.filter(
          (ua) => ua.oidUsuario !== oidUsuario
        );
        this.usuariosCompletos = this.usuariosCompletos.filter(
          (u) => u.oidUsuario !== oidUsuario
        );

        this.onUsuarioDesasignado.emit();
      }

      this.desasignando = false;
    } catch (error: any) {
      console.error('Error al desasignar usuario:', error);

      const mensaje =
        error?.error?.mensaje ||
        'Error al desasignar el usuario de la actividad';

      this.toastr.error(mensaje);
      this.desasignando = false;
    }
  }

  cerrar(): void {
    this.mostrandoFormularioAsignacion = false;
    this.resetearFormulario();

    this.onCerrar.emit();
  }

  // ========== MÉTODOS PARA ASIGNAR USUARIO ==========

  abrirFormularioAsignacion(): void {
    this.mostrandoFormularioAsignacion = true;
    // TODO: Aquí después cargaremos usuarios y cargos disponibles
  }

  cerrarFormularioAsignacion(): void {
    this.mostrandoFormularioAsignacion = false;
    this.resetearFormulario();
  }

  resetearFormulario(): void {
    this.nuevoUsuario = {
      oidUsuario: null,
      oidCargoActividad: null,
      horas: 0,
    };
  }

  validarFormulario(): boolean {
    if (!this.nuevoUsuario.oidUsuario) {
      this.toastr.warning('Debe seleccionar un usuario');
      return false;
    }
    if (!this.nuevoUsuario.oidCargoActividad) {
      this.toastr.warning('Debe seleccionar un cargo');
      return false;
    }
    if (this.nuevoUsuario.horas <= 0) {
      this.toastr.warning('Las horas deben ser mayor a 0');
      return false;
    }
    return true;
  }

  async asignarUsuario(): Promise<void> {
    if (!this.validarFormulario()) {
      return;
    }

    if (!this.oidActividad || !this.oidCalendario) {
      this.toastr.error('Error: Faltan datos necesarios para asignar');
      return;
    }

    this.asignando = true;

    try {
      // TODO: Aquí implementaremos la lógica de asignación usando los servicios
      console.log('Datos a asignar:', this.nuevoUsuario);

      // Simulación temporal
      this.toastr.info('Función de asignación pendiente de implementar');

      this.asignando = false;
      this.cerrarFormularioAsignacion();
    } catch (error: any) {
      console.error('Error al asignar usuario:', error);
      this.toastr.error('Error al asignar el usuario a la actividad');
      this.asignando = false;
    }
  }
}
