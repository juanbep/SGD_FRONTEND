import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  UsuarioActividadAsignacion,
  UsuarioEnActividad,
} from '../../../models';

@Component({
  selector: 'app-usuario-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario-carousel.component.html',
  styleUrl: './usuario-carousel.component.css',
})
export class UsuarioCarouselComponent implements OnChanges {
  @Input() usuariosAsignaciones: UsuarioActividadAsignacion[] = [];
  @Input() usuariosCompletos: UsuarioEnActividad[] = [];
  @Input() modo: 'visualizar' | 'gestionar' = 'visualizar';
  @Input() desasignando = false;
  @Output() onDesasignarUsuario = new EventEmitter<number>();

  usuarioEnConfirmacion: number | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    // Resetear confirmación si los usuarios cambiaron
    if (changes['usuariosCompletos'] || changes['usuariosAsignaciones']) {
      if (
        this.usuarioEnConfirmacion &&
        !this.usuariosCompletos.find(
          (u) => u.oidUsuario === this.usuarioEnConfirmacion
        )
      ) {
        this.usuarioEnConfirmacion = null;
      }
    }
  }

  // Obtener las horas asignadas de un usuario específico en esta actividad
  getHorasUsuario(oidUsuario: number): number {
    const asignacion = this.usuariosAsignaciones.find(
      (ua) => ua.oidUsuario === oidUsuario
    );
    return asignacion?.horas || 0;
  }

  // Obtener el oid del cargo de un usuario específico
  getOidCargoUsuario(oidUsuario: number): number | null {
    const asignacion = this.usuariosAsignaciones.find(
      (ua) => ua.oidUsuario === oidUsuario
    );
    return asignacion?.oidCargoActividad || null;
  }

  // Obtener roles formateados como string
  getRolesString(usuario: UsuarioEnActividad): string {
    if (!usuario.roles || usuario.roles.length === 0) {
      return 'Sin roles asignados';
    }
    return usuario.roles.map((r) => r.nombre).join(', ');
  }

  mostrarConfirmacion(oidUsuario: number): void {
    this.usuarioEnConfirmacion = oidUsuario;

    setTimeout(() => {
      this.scrollToConfirmacion(oidUsuario);
    }, 100);
  }

  private scrollToConfirmacion(oidUsuario: number): void {
    const elemento = document.querySelector(
      `[data-usuario-id="${oidUsuario}"]`
    );

    if (elemento) {
      elemento.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }

  cancelarConfirmacion(): void {
    this.usuarioEnConfirmacion = null;
  }

  confirmarDesasignacion(oidUsuario: number): void {
    this.onDesasignarUsuario.emit(oidUsuario);
    this.usuarioEnConfirmacion = null;
  }

  get totalUsuarios(): number {
    return this.usuariosCompletos.length;
  }
}
