import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioCarouselComponent } from '../usuario-carousel/usuario-carousel.component';
import { ActividadHelperService } from '../../../services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-usuarios',
  standalone: true,
  imports: [CommonModule, UsuarioCarouselComponent],
  templateUrl: './modal-usuarios.component.html',
  styleUrl: './modal-usuarios.component.css',
})
export class ModalUsuariosComponent {
  @Input() usuariosIds: number[] = [];
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
        // Mensaje de éxito del backend o mensaje por defecto
        const mensaje =
          resultado.mensaje || 'Usuario desasignado correctamente';
        this.toastr.success(mensaje);

        // Remover de la lista local para actualizar UI inmediatamente
        this.usuariosIds = this.usuariosIds.filter((id) => id !== oidUsuario);

        // Notificar al padre para que recargue la tabla
        this.onUsuarioDesasignado.emit();
      }

      this.desasignando = false;
    } catch (error: any) {
      console.error('Error al desasignar usuario:', error);

      // Capturar mensaje del backend o usar mensaje por defecto
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
