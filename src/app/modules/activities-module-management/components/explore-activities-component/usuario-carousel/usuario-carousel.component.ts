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

  getHorasUsuario(oidUsuario: number): number {
    const asignacion = this.usuariosAsignaciones.find(
      (ua) => ua.oidUsuario === oidUsuario
    );
    return asignacion?.horas || 0;
  }

  getOidCargoUsuario(oidUsuario: number): number | null {
    const asignacion = this.usuariosAsignaciones.find(
      (ua) => ua.oidUsuario === oidUsuario
    );
    return asignacion?.oidCargoActividad || null;
  }

  mostrarConfirmacion(oidUsuario: number): void {
    this.usuarioEnConfirmacion = oidUsuario;
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
