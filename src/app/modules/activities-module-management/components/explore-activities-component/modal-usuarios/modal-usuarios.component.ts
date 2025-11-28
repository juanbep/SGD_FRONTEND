import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioCarouselComponent } from '../usuario-carousel/usuario-carousel.component';
import { ActividadHelperService } from '../../../services';

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

  desasignando: boolean = false;

  desasignarUsuario(oidUsuario: number): void {
    // Validar que tenemos los 3 parámetros necesarios
    if (!this.oidActividad || !this.oidCalendario) {
      console.error('Faltan oidActividad u oidCalendario para desasignar');
      return;
    }

    if (this.desasignando) {
      return; // Evitar clicks múltiples
    }

    this.desasignando = true;

    // // Ajusta el método según la firma exacta de tu servicio
    // this.actividadHelper
    //   .desasignarUsuarioDeActividad({
    //     oidActividad: this.oidActividad,
    //     oidCalendario: this.oidCalendario,
    //     oidUsuario: oidUsuario,
    //   })
    //   .subscribe({
    //     next: () => {
    //       console.log('Usuario desasignado correctamente');

    //       // Opcional: remover de la lista local para actualizar la UI inmediatamente
    //       this.usuariosIds = this.usuariosIds.filter((id) => id !== oidUsuario);

    //       // Notificar al padre para que recargue la tabla
    //       this.onUsuarioDesasignado.emit();

    //       this.desasignando = false;
    //     },
    //     error: (err) => {
    //       console.error('Error al desasignar usuario:', err);
    //       this.desasignando = false;
    //       // Aquí podrías agregar un toastr con el error
    //     },
    //   });
  }

  cerrar(): void {
    this.onCerrar.emit();
  }
}
