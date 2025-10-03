import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../../../../users-roles-management/models';
import { UsuarioHelperService } from '../../../../../../users-roles-management/services/users/usuario-helper.service';

@Component({
  selector: 'app-usuario-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario-carousel.component.html',
  styleUrl: './usuario-carousel.component.css',
})
export class UsuarioCarouselComponent {
  @Input() usuariosIds: number[] = []; // IDs de los usuarios asociados
  private usuarioHelper = inject(UsuarioHelperService);

  currentIndex: number = 0;
  usuarioActual: Usuario | null = null;
  loading: boolean = false;
  error: string = '';

  ngOnInit(): void {
    if (this.usuariosIds && this.usuariosIds.length > 0) {
      this.cargarUsuario(this.usuariosIds[0]);
    }
  }

  async cargarUsuario(usuarioId: number): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      this.usuarioActual = await this.usuarioHelper.getById(usuarioId);

      if (!this.usuarioActual) {
        this.error = 'Usuario no encontrado';
      }
    } catch (err) {
      this.error = 'Error al cargar el usuario';
      console.error('Error cargando usuario:', err);
    } finally {
      this.loading = false;
    }
  }

  siguiente(): void {
    if (this.usuariosIds.length === 0) return;

    this.currentIndex = (this.currentIndex + 1) % this.usuariosIds.length;
    this.cargarUsuario(this.usuariosIds[this.currentIndex]);
  }

  anterior(): void {
    if (this.usuariosIds.length === 0) return;

    this.currentIndex =
      (this.currentIndex - 1 + this.usuariosIds.length) %
      this.usuariosIds.length;
    this.cargarUsuario(this.usuariosIds[this.currentIndex]);
  }

  get numeroPagina(): string {
    return `${this.currentIndex + 1} / ${this.usuariosIds.length}`;
  }

  get tieneMultiplesUsuarios(): boolean {
    return this.usuariosIds.length > 1;
  }
}
