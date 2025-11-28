import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioHelperService } from '../../../../sgd-users-management/services';
import { Usuario } from '../../../../sgd-users-management/models';

@Component({
  selector: 'app-usuario-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario-carousel.component.html',
  styleUrl: './usuario-carousel.component.css',
})
export class UsuarioCarouselComponent implements OnInit, OnChanges {
  @Input() usuariosIds: number[] = [];
  @Input() modo: 'visualizar' | 'gestionar' = 'visualizar';
  @Input() desasignando = false;
  @Output() onDesasignarUsuario = new EventEmitter<number>();

  private usuarioHelper = inject(UsuarioHelperService);

  usuarios: Usuario[] = [];
  currentIndex: number = 0;
  usuarioActual: Usuario | null = null;
  usuarioEnConfirmacion: number | null = null;
  loading: boolean = false;
  error: string = '';

  async ngOnInit(): Promise<void> {
    if (this.usuariosIds && this.usuariosIds.length > 0) {
      await this.cargarTodosLosUsuarios();
    }
  }

  // NUEVO: Detectar cambios en usuariosIds
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuariosIds']) {
      const current = changes['usuariosIds'].currentValue;
      const previous = changes['usuariosIds'].previousValue;

      // Solo recargar si realmente cambió (no en la primera carga)
      if (!changes['usuariosIds'].firstChange && current !== previous) {
        console.log('usuariosIds cambió de', previous, 'a', current);
        this.cargarTodosLosUsuarios();
      }
    }
  }

  async cargarTodosLosUsuarios(): Promise<void> {
    // Si no hay IDs, limpiar usuarios
    if (!this.usuariosIds || this.usuariosIds.length === 0) {
      this.usuarios = [];
      this.usuarioActual = null;
      this.currentIndex = 0;
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      // Cargar todos los usuarios en paralelo
      const promesas = this.usuariosIds.map((id) =>
        this.usuarioHelper.getById(id)
      );
      const resultados = await Promise.all(promesas);

      // Filtrar usuarios válidos
      this.usuarios = resultados.filter(
        (usuario) => usuario !== null
      ) as Usuario[];

      // Resetear confirmación si el usuario fue eliminado
      if (
        this.usuarioEnConfirmacion &&
        !this.usuariosIds.includes(this.usuarioEnConfirmacion)
      ) {
        this.usuarioEnConfirmacion = null;
      }

      if (this.usuarios.length === 0) {
        this.error = 'No se pudieron cargar los usuarios';
      }
    } catch (err) {
      this.error = 'Error al cargar los usuarios';
      console.error('Error cargando usuarios:', err);
    } finally {
      this.loading = false;
    }
  }

  // Método para mostrar confirmación
  mostrarConfirmacion(oidUsuario: number): void {
    this.usuarioEnConfirmacion = oidUsuario;

    // Esperar a que Angular renderice la vista de confirmación
    setTimeout(() => {
      this.scrollToConfirmacion(oidUsuario);
    }, 100);
  }

  private scrollToConfirmacion(oidUsuario: number): void {
    // Buscar el elemento de la tarjeta con confirmación
    const elemento = document.querySelector(
      `[data-usuario-id="${oidUsuario}"]`
    );

    if (elemento) {
      elemento.scrollIntoView({
        behavior: 'smooth',
        block: 'center', // Centrar verticalmente
        inline: 'nearest',
      });
    }
  }

  // Método para cancelar confirmación
  cancelarConfirmacion(): void {
    this.usuarioEnConfirmacion = null;
  }

  // Método para confirmar desasignación
  confirmarDesasignacion(oidUsuario: number): void {
    this.onDesasignarUsuario.emit(oidUsuario);
    this.usuarioEnConfirmacion = null;
  }

  get totalUsuarios(): number {
    return this.usuarios.length;
  }
}
