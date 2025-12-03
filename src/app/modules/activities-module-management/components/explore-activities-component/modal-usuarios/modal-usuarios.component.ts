import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioCarouselComponent } from '../usuario-carousel/usuario-carousel.component';
import { ActividadHelperService } from '../../../services';
import { ToastrService } from 'ngx-toastr';
import {
  UsuarioActividadAsignacion,
  UsuarioEnActividad,
} from '../../../models';

@Component({
  selector: 'app-modal-usuarios',
  standalone: true,
  imports: [CommonModule, UsuarioCarouselComponent],
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

  private actividadHelper = inject(ActividadHelperService);
  private toastr = inject(ToastrService);

  desasignando: boolean = false;

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
    this.onCerrar.emit();
  }
}
